"""
Actualiza desde TwitchTracker (all time): twitch_hours, total_hours, peak_viewers,
top_category y second_category de data/streamers.js.

  python scripts/twitchtracker.py                 -> simula, escribe scripts/ultimo-reporte-tt.md
  python scripts/twitchtracker.py --write         -> aplica los cambios
  python scripts/twitchtracker.py --solo=ibai     -> un solo streamer
  python scripts/twitchtracker.py --visible       -> muestra Chrome (por si Cloudflare bloquea)

peak_viewers no se toca si el streamer tiene Kick (su pico real puede ser en Kick).
Horas y peak nunca bajan: si TwitchTracker devuelve menos que lo guardado, se ignora.
Requisitos: pip install selenium undetected-chromedriver setuptools
"""
import re, sys, time
from pathlib import Path
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

RAIZ = Path(__file__).resolve().parent.parent
ARCHIVO = RAIZ / 'data' / 'streamers.js'
REPORTE = RAIZ / 'scripts' / 'ultimo-reporte-tt.md'
ESCRIBIR = '--write' in sys.argv
VISIBLE = '--visible' in sys.argv
SOLO = next((a.split('=')[1].lower() for a in sys.argv if a.startswith('--solo=')), None)
ESPERA, PAUSA = 12, 2


def num(t):
    t = re.sub(r'[\s,]', '', str(t or ''))
    try:
        if t[-1:].upper() == 'K': return int(float(t[:-1]) * 1_000)
        if t[-1:].upper() == 'M': return int(float(t[:-1]) * 1_000_000)
        return int(float(re.sub(r'[^\d.]', '', t)))
    except Exception:
        return None


def esperar(driver, css):
    try:
        WebDriverWait(driver, ESPERA).until(EC.presence_of_element_located((By.CSS_SELECTOR, css)))
    except Exception:
        time.sleep(ESPERA)


def bloqueada(driver):
    s = driver.page_source.lower()
    return len(s) < 500 or 'just a moment' in s[:3000] or 'not found' in s[:2000]


def estadisticas(driver, login):
    r = {'horas': None, 'peak': None}
    driver.get(f'https://twitchtracker.com/{login}/statistics')
    esperar(driver, '[class*="g-x-s"]')
    if bloqueada(driver): return None
    vals = driver.find_elements(By.CSS_SELECTOR, '[class*="g-x-s-value"], [class*="stat-value"]')
    labs = driver.find_elements(By.CSS_SELECTOR, '[class*="g-x-s-label"], [class*="stat-label"]')
    for v, l in zip(vals, labs):
        l, n = l.text.strip().lower(), num(v.text)
        if n is None: continue
        if 'hours streamed' in l and r['horas'] is None: r['horas'] = n
        if 'peak viewers' in l and r['peak'] is None: r['peak'] = n
    return r


def categorias(driver, login):
    driver.get(f'https://twitchtracker.com/{login}/games')
    esperar(driver, 'table, [class*="game"]')
    if bloqueada(driver): return []
    out = []
    for a in driver.find_elements(By.CSS_SELECTOR, 'td a[href*="/category/"], td a[href*="/games/"]'):
        n = a.text.strip()
        if n and not n.isdigit() and n not in out: out.append(n)
        if len(out) >= 2: break
    return out


def valor(linea, campo):
    m = re.search(rf'\b{campo}:(\d+)', linea)
    return int(m.group(1)) if m else 0


def main():
    texto = ARCHIVO.read_text(encoding='utf8')
    lineas = texto.split('\n')
    cambios, avisos, nuevas = [], [], {}

    driver = uc.Chrome(options=(lambda o: (o.add_argument('--no-sandbox'), o.add_argument('--disable-dev-shm-usage'), o)[2])(uc.ChromeOptions()), headless=not VISIBLE)
    driver.set_page_load_timeout(30)
    bloqueos = 0
    try:
        for i, l in enumerate(lineas):
            m = re.match(r'^  \{id:\d+, name:"[^"]*", display_name:"([^"]*)".*?\btwitch:"([^"]+)"', l)
            if not m: continue
            nombre, login = m.group(1), m.group(2).lower()
            if SOLO and login != SOLO: continue
            if bloqueos >= 5:
                avisos.append('Demasiados bloqueos seguidos (¿Cloudflare?): se corta la corrida.')
                break
            nueva = l
            try:
                est = estadisticas(driver, login)
                if est is None:
                    bloqueos += 1
                    avisos.append(f'{nombre}: TwitchTracker no respondió o bloqueó.')
                    continue
                bloqueos = 0
                tiene_kick = not re.search(r'\bkick:""', l)
                h_old, p_old = valor(l, 'twitch_hours'), valor(l, 'peak_viewers')
                if est['horas'] and est['horas'] >= h_old and est['horas'] != h_old:
                    kick_h = valor(l, 'kick_hours')
                    nueva = re.sub(r'\btwitch_hours:\d+', f'twitch_hours:{est["horas"]}', nueva)
                    nueva = re.sub(r'\btotal_hours:\d+', f'total_hours:{est["horas"] + kick_h}', nueva)
                    cambios.append((nombre, 'horas', h_old, est['horas']))
                elif est['horas'] and est['horas'] < h_old:
                    avisos.append(f'{nombre}: horas bajarían de {h_old} a {est["horas"]}; se ignora.')
                if est['peak'] and not tiene_kick and est['peak'] > p_old:
                    nueva = re.sub(r'\bpeak_viewers:\d+', f'peak_viewers:{est["peak"]}', nueva)
                    cambios.append((nombre, 'peak', p_old, est['peak']))
                time.sleep(PAUSA)
                cats = categorias(driver, login)
                for campo, idx in (('top_category', 0), ('second_category', 1)):
                    if len(cats) > idx:
                        viejo = re.search(rf'\b{campo}:"([^"]*)"', nueva)
                        if viejo and viejo.group(1) != cats[idx]:
                            nueva = nueva.replace(viejo.group(0), f'{campo}:"{cats[idx]}"', 1)
                            cambios.append((nombre, campo, viejo.group(1), cats[idx]))
                time.sleep(PAUSA)
                if nueva != l: nuevas[i] = nueva
                print(f'{nombre}: ok', flush=True)
            except Exception as e:
                avisos.append(f'{nombre}: error {type(e).__name__}')
    finally:
        try: driver.quit()
        except Exception: pass

    rep = [f'# TwitchTracker ({time.strftime("%Y-%m-%d")})', '', 'Modo: ' + ('**aplicado**' if ESCRIBIR else '**simulación**'), '',
           f'## Cambios ({len(cambios)})', '', '| Streamer | Campo | Antes | Ahora |', '|---|---|---|---|']
    rep += [f'| {n} | {c} | {a} | {b} |' for n, c, a, b in cambios]
    if avisos: rep += ['', f'## Avisos ({len(avisos)})', ''] + [f'- {a}' for a in avisos]
    REPORTE.write_text('\n'.join(rep), encoding='utf8')
    if ESCRIBIR and nuevas:
        for i, l in nuevas.items(): lineas[i] = l
        ARCHIVO.write_text('\n'.join(lineas), encoding='utf8')
    print(f'{"Aplicado" if ESCRIBIR else "Simulación"}: {len(cambios)} cambios, {len(avisos)} avisos')


if __name__ == '__main__':
    main()
