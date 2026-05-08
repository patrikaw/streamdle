"""
fix_modal_slugs.py

Verifica y corrige que los modales de emojidle, chatdle y categorydle
tengan el streamer clickeable con getSlug.

Ejecutar desde la raíz del proyecto:
    python3 fix_modal_slugs.py
"""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))

SLUG_FN = """function getSlug(s) { return s.display_name.toLowerCase().replace(/\\s+/g,'-'); }\n\n"""

RESULT_TEXT_FN = """function getResultText(country, won, attempts, streamer) {
  const texts = {
    ES: { won:["¡Eso es, tío! Lo tenías clarinete 🔥","¿Ves como eres un crack? 😎","¡Ole! Llegaste 😂"], lost:["Anda ya, ¡vergüenza! 😂","¿En serio no lo sabías? 💀","Ponete al día con los streamers 😅"] },
    AR: { won:["¡La rompisteee! Sos un capo 🔥","¡Qué crack! 😂","¡La pegaste! Sos un fenómeno"], lost:["Andá a ver más streams che 💀","Mirá que mal... 😂","¿No lo conocías? Qué papelón 😅"] },
    MX: { won:["¡Órale! Le caíste al tiro 🔥","¡A toda máquina! 😂","¡Chingón! Lo sabías de una"], lost:["Ay wey... ¿ni ese conocías? 💀","¡Aguas! A ponerle más ganas 😂","No manches, qué mal 😅"] },
    default: { won:["¡Lo adivinaste! Sos un crack 🔥","¡Bien jugado! 😎","¡Ahí está!"], lost:["¡Casi! La próxima seguro 💀","¡Andá a ver más streams! 😂","No te preocupes, mañana hay otro 😅"] },
  };
  const r = texts[country] || texts.default;
  const pool = won ? r.won : r.lost;
  return pool[attempts % pool.length];
}\n\n"""

games = {
    'emojidle':    ('app/emojidle/page.js',    'const MAX_ATTEMPTS = 6;'),
    'chatdle':     ('app/chatdle/page.js',      'const MAX_ATTEMPTS = 6;'),
    'categorydle': ('app/categorydle/page.js',  'const MAX_ATTEMPTS = 8;'),
}

for game, (rel_path, max_line) in games.items():
    path = os.path.join(ROOT, rel_path)
    if not os.path.exists(path):
        print(f"❌ No encontrado: {path}")
        continue

    with open(path, encoding='utf-8') as f:
        content = f.read()

    original = content
    applied = []

    # 1. Agregar getSlug + getResultText si no están
    if 'function getSlug' not in content:
        content = content.replace(max_line, SLUG_FN + RESULT_TEXT_FN + max_line, 1)
        applied.append("getSlug + getResultText")

    # 2. country al ShareModal params
    for old, new in [
        ("function ShareModal({ won, attempts, target, avatars, onClose, onOtherGames })",
         "function ShareModal({ won, attempts, target, avatars, country, onClose, onOtherGames })"),
        ("function ShareModal({ won, attempts, target, avatars, guesses, onClose, onOtherGames })",
         "function ShareModal({ won, attempts, target, avatars, guesses, country, onClose, onOtherGames })"),
    ]:
        if old in content and 'country, onClose' not in content:
            content = content.replace(old, new, 1)
            applied.append("country en ShareModal")
            break

    # 3. resultText + slug en el modal
    emoji_line = ("  const emoji = won ? (attempts <= 3 ? '🔥' : attempts <= 6 ? '✅' : '😅') : '💀';"
                  if game == 'categorydle' else
                  "  const emoji = won ? (attempts <= 2 ? '🔥' : attempts <= 4 ? '✅' : '😅') : '💀';")
    if emoji_line in content and 'resultText' not in content:
        content = content.replace(
            emoji_line,
            emoji_line + "\n  const resultText = getResultText(country, won, attempts, target);\n  const slug = getSlug(target);",
            1
        )
        applied.append("resultText + slug")

    # 4. Mostrar resultText en el modal
    if game == 'categorydle':
        p_text = "`Eran: ${target.top_category} + ${target.second_category}`"
    else:
        p_text = "`Era ${target.display_name}`"

    search_p = f"            {{won ? `Lo lograste en ${{attempts}} intento${{attempts > 1 ? 's' : ''}}` : {p_text}}}"
    if search_p in content and '{resultText}' not in content:
        content = content.replace(
            search_p,
            search_p + "\n          </p>\n          <p style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginTop: '6px' }}>{resultText}",
            1
        )
        applied.append("resultText en render")

    # 5. Card del streamer clickeable en el modal
    # Buscar el div con border purple y convertirlo a <a href={`/${slug}`}>
    # Patrón: div inmediatamente antes de avatarUrl check
    old_div_start = "        <div style={{\n          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',\n          display: 'flex', alignItems: 'center', gap: '12px',\n          marginBottom: '"
    
    if old_div_start in content and "href={`/${slug}`}" not in content:
        # Reemplazar apertura del div por <a>
        for margin in ["'20px'", "'16px'"]:
            old_tag = f"        <div style={{\n          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',\n          display: 'flex', alignItems: 'center', gap: '12px',\n          marginBottom: {margin}, border: '1px solid var(--color-purple)',\n        }}>"
            new_tag = f"        <a href={{`/${{slug}}`}} style={{\n          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',\n          display: 'flex', alignItems: 'center', gap: '12px',\n          marginBottom: '16px', border: '1px solid var(--color-purple)',\n          textDecoration: 'none', color: 'inherit', transition: 'border-color 0.18s',\n        }}\n          onMouseOver={{e => e.currentTarget.style.borderColor = 'var(--color-purple-light)'}}\n          onMouseOut={{e => e.currentTarget.style.borderColor = 'var(--color-purple)'}}\n        >"
            if old_tag in content:
                content = content.replace(old_tag, new_tag, 1)
                applied.append("card abierta como <a>")
                break

    # Para chatdle el layout es diferente (bloque de frase + streamer)
    if game == 'chatdle' and "href={`/${slug}`}" not in content:
        old_chatdle = "        <div style={{\n          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',\n          marginBottom: '16px', border: '1px solid var(--color-purple)',\n        }}>"
        new_chatdle = "        <a href={`/${slug}`} style={{\n          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',\n          marginBottom: '16px', border: '1px solid var(--color-purple)',\n          textDecoration: 'none', color: 'inherit', transition: 'border-color 0.18s', display: 'block',\n        }}\n          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-purple-light)'}\n          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-purple)'}\n        >"
        if old_chatdle in content:
            content = content.replace(old_chatdle, new_chatdle, 1)
            applied.append("card chatdle como <a>")

    # 6. Buscar el </div> de cierre de la card y cambiarlo por </a>
    # Patrón: justo después de los badges de plataforma hay un </div> que cierra la card
    # Es el primer </div> después de los badges
    if "href={`/${slug}`}" in content:
        # Reemplazar el </div> que sigue a los badges por </a>
        # Buscamos el patrón específico del cierre
        for old_close, new_close in [
            # Para emojidle/categorydle: el div de badges + cierre
            ("            </div>\n          </div>\n        </div>",
             "            </div>\n          </div>\n        </a>"),
            # Para chatdle: cierre diferente
            ("            </div>\n          </div>\n        </div>",
             "            </div>\n          </div>\n        </a>"),
        ]:
            if old_close in content and '</a>' not in content.split("href={`/${slug}`}")[1][:500]:
                # Solo reemplazar la primera ocurrencia después del href
                idx = content.find("href={`/${slug}`}")
                after = content[idx:]
                if old_close in after[:1500]:
                    first_occurrence = after.index(old_close)
                    content = content[:idx] + after[:first_occurrence] + new_close + after[first_occurrence + len(old_close):]
                    applied.append("card cerrada como </a>")
                    break

    # 7. Agregar "Ver perfil completo →" dentro de la card
    if "Ver perfil completo" not in content and "href={`/${slug}`}" in content:
        for old_badges, new_badges in [
            # Emojidle y categorydle
            ("              {target.twitch && <span className=\"badge-twitch\">Twitch</span>}\n              {target.kick && <span className=\"badge-kick\">Kick</span>}\n              {target.youtube && <span className=\"badge-youtube\">YouTube</span>}\n            </div>\n          </div>",
             "              {target.twitch && <span className=\"badge-twitch\">Twitch</span>}\n              {target.kick && <span className=\"badge-kick\">Kick</span>}\n              {target.youtube && <span className=\"badge-youtube\">YouTube</span>}\n            </div>\n            <div style={{ fontSize: '11px', color: 'var(--color-purple-light)', marginTop: '4px', fontWeight: '600' }}>Ver perfil completo →</div>\n          </div>"),
            # Chatdle
            ("              {target.twitch && <span className=\"badge-twitch\">Twitch</span>}\n                {target.kick && <span className=\"badge-kick\">Kick</span>}\n                {target.youtube && <span className=\"badge-youtube\">YouTube</span>}",
             "              {target.twitch && <span className=\"badge-twitch\">Twitch</span>}\n                {target.kick && <span className=\"badge-kick\">Kick</span>}\n                {target.youtube && <span className=\"badge-youtube\">YouTube</span>}\n              <div style={{ fontSize: '11px', color: 'var(--color-purple-light)', marginTop: '4px', fontWeight: '600' }}>Ver perfil completo →</div>"),
        ]:
            if old_badges in content:
                content = content.replace(old_badges, new_badges, 1)
                applied.append("Ver perfil completo →")
                break

    # 8. Pasar country al render del ShareModal
    for old_r, new_r in [
        ("avatars={avatars}\n          onClose={() => setShowModal(false)}",
         "avatars={avatars} country={country}\n          onClose={() => setShowModal(false)}"),
        ("avatars={avatars} guesses={guesses}\n          onClose={() => setShowModal(false)}",
         "avatars={avatars} guesses={guesses} country={country}\n          onClose={() => setShowModal(false)}"),
        ("target={target} avatars={avatars}\n          onClose={() => setShowModal(false)}",
         "target={target} avatars={avatars} country={country}\n          onClose={() => setShowModal(false)}"),
    ]:
        if old_r in content and 'country={country}' not in content.split('setShowModal')[0][-200:]:
            content = content.replace(old_r, new_r, 1)
            applied.append("country en render")
            break

    # 9. Intentos clickeables (emojidle y chatdle)
    if game != 'categorydle':
        old_div = """                <div key={guess.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: isCorrect ? '#16A34A22' : '#DC262622',
                  border: `1px solid ${isCorrect ? '#16A34A44' : '#DC262644'}`,
                  borderRadius: '8px', padding: '8px 12px',
                  animation: 'fadeIn 0.3s ease',
                }}>"""
        new_a = """                <a key={guess.id} href={`/${getSlug(guess)}`} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: isCorrect ? '#16A34A22' : '#DC262622',
                  border: `1px solid ${isCorrect ? '#16A34A44' : '#DC262644'}`,
                  borderRadius: '8px', padding: '8px 12px',
                  animation: 'fadeIn 0.3s ease',
                  textDecoration: 'none', color: 'inherit',
                }}>"""
        if old_div in content:
            content = content.replace(old_div, new_a, 1)
            applied.append("intentos clickeables")
            old_close = "                  <span style={{ marginLeft: 'auto', fontSize: '16px' }}>{isCorrect ? '✅' : '❌'}</span>\n                </div>"
            new_close = "                  <span style={{ marginLeft: 'auto', fontSize: '16px' }}>{isCorrect ? '✅' : '❌'}</span>\n                </a>"
            content = content.replace(old_close, new_close, 1)

    # 10. Ayer clickeable
    old_ayer = "href={yesterday.kick ? `https://kick.com/${yesterday.kick}` : `https://twitch.tv/${yesterday.twitch}`}"
    new_ayer = "href={`/${getSlug(yesterday)}`}"
    if old_ayer in content:
        content = content.replace(old_ayer, new_ayer)
        applied.append("ayer clickeable")

    if content != original:
        with open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        print(f"✅ {game}: {len(applied)} cambios → {', '.join(applied)}")
    else:
        print(f"⚠️  {game}: sin cambios (puede que ya estén aplicados)")

print("\nListo. Revisá en el navegador que los modales sean clickeables.")
