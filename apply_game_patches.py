"""
apply_game_patches.py

Ejecutá este script desde la raíz de tu proyecto streamdle:
    python3 apply_game_patches.py

Aplica los siguientes cambios a emojidle, chatdle y categorydle:
- Agrega getSlug() y getResultText() (textos por país)
- ShareModal recibe country
- Card del streamer en el modal es clickeable → /[slug]
- country pasado al render del ShareModal
- Lista de intentos clickeable → /[slug] (emojidle y chatdle)
- "El streamer de ayer" clickeable → /[slug]
"""

import os, re, sys

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

SLUG_FN = """function getSlug(s) { return s.display_name.toLowerCase().replace(/\\s+/g,'-'); }

"""

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
}

"""

def patch_file(path, game):
    if not os.path.exists(path):
        print(f"  ❌ No encontrado: {path}")
        return False
    
    with open(path, encoding='utf-8') as f:
        content = f.read()
    
    original = content
    applied = []

    # 1. Agregar helpers antes de MAX_ATTEMPTS
    max_line = "const MAX_ATTEMPTS = 8;" if game == 'categorydle' else "const MAX_ATTEMPTS = 6;"
    if 'function getSlug' not in content:
        content = content.replace(max_line, SLUG_FN + RESULT_TEXT_FN + max_line, 1)
        applied.append("getSlug + getResultText")

    # 2. country al ShareModal
    if game == 'categorydle':
        old = "function ShareModal({ won, attempts, target, avatars, guesses, onClose, onOtherGames })"
        new = "function ShareModal({ won, attempts, target, avatars, guesses, country, onClose, onOtherGames })"
    else:
        old = "function ShareModal({ won, attempts, target, avatars, onClose, onOtherGames })"
        new = "function ShareModal({ won, attempts, target, avatars, country, onClose, onOtherGames })"
    if old in content:
        content = content.replace(old, new, 1)
        applied.append("country en ShareModal params")

    # 3. resultText + slug en modal
    emoji_line_6 = "  const emoji = won ? (attempts <= 2 ? '🔥' : attempts <= 4 ? '✅' : '😅') : '💀';"
    emoji_line_8 = "  const emoji = won ? (attempts <= 3 ? '🔥' : attempts <= 6 ? '✅' : '😅') : '💀';"
    emoji_line = emoji_line_8 if game == 'categorydle' else emoji_line_6
    if emoji_line in content and 'resultText' not in content:
        content = content.replace(
            emoji_line,
            emoji_line + "\n  const resultText = getResultText(country, won, attempts, target);\n  const slug = getSlug(target);",
            1
        )
        applied.append("resultText + slug declarados")

    # 4. resultText en render
    if game == 'categorydle':
        search_p = "          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>\n            {won ? `Lo lograste en ${attempts} intento${attempts > 1 ? 's' : ''}` : `Eran: ${target.top_category} + ${target.second_category}`}\n          </p>"
    else:
        search_p = "          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>\n            {won ? `Lo lograste en ${attempts} intento${attempts > 1 ? 's' : ''}` : `Era ${target.display_name}`}\n          </p>"
    
    if search_p in content and '{resultText}' not in content:
        content = content.replace(
            search_p,
            search_p + "\n          <p style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginTop: '6px' }}>{resultText}</p>",
            1
        )
        applied.append("resultText en render")

    # 5. Card clickeable en modal
    # Buscar el div con border purple y hacerlo <a>
    # Pattern: div con 'background: var(--bg-primary)' y 'border: 1px solid var(--color-purple)'
    card_pattern = r"(<div style=\{\{[^}]*background: 'var\(--bg-primary\)'[^}]*marginBottom: '[12][60]px'[^}]*border: '1px solid var\(--color-purple\)'[^}]*\}>)"
    if re.search(card_pattern, content) and "href={`/${slug}`}" not in content:
        # Buscar el bloque completo del div de la card y reemplazarlo
        # Más seguro: buscar líneas específicas
        for old_start, new_start in [
            ("          display: 'flex', alignItems: 'center', gap: '12px',\n          marginBottom: '20px', border: '1px solid var(--color-purple)',\n        }>",
             "          display: 'flex', alignItems: 'center', gap: '12px',\n          marginBottom: '16px', border: '1px solid var(--color-purple)',\n          textDecoration: 'none', color: 'inherit', transition: 'border-color 0.18s',\n        }}\n          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-purple-light)'}\n          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-purple)'}\n        >"),
            ("          display: 'flex', alignItems: 'center', gap: '12px',\n          marginBottom: '16px', border: '1px solid var(--color-purple)',\n        }>",
             "          display: 'flex', alignItems: 'center', gap: '12px',\n          marginBottom: '16px', border: '1px solid var(--color-purple)',\n          textDecoration: 'none', color: 'inherit', transition: 'border-color 0.18s',\n        }}\n          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-purple-light)'}\n          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-purple)'}\n        >"),
        ]:
            if old_start in content:
                # Cambiar el tag div→a y agregar href
                content = content.replace(
                    "        <div style={{\n          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',\n" + "          " + old_start.split("          ")[1],
                    "        <a href={`/${slug}`} style={{\n          background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px',\n          " + new_start.split("          ")[1],
                    1
                )
                # Encontrar el </div> de cierre de esta card y cambiarlo por </a>
                # Esto es complejo sin parsear JSX, mejor solo marcar
                applied.append("card inicio convertida a <a> (verificar cierre manualmente)")
                break

    # 6. Pasar country al render del ShareModal
    for old_r, new_r in [
        ("avatars={avatars}\n          onClose={() => setShowModal(false)}",
         "avatars={avatars} country={country}\n          onClose={() => setShowModal(false)}"),
        ("avatars={avatars} guesses={guesses}\n          onClose={() => setShowModal(false)}",
         "avatars={avatars} guesses={guesses} country={country}\n          onClose={() => setShowModal(false)}"),
    ]:
        if old_r in content:
            content = content.replace(old_r, new_r, 1)
            applied.append("country en render del ShareModal")
            break

    # 7. Intentos clickeables (emojidle y chatdle, no categorydle)
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
            # Cerrar con </a>
            old_close = "                  <span style={{ marginLeft: 'auto', fontSize: '16px' }}>{isCorrect ? '✅' : '❌'}</span>\n                </div>"
            new_close = "                  <span style={{ marginLeft: 'auto', fontSize: '16px' }}>{isCorrect ? '✅' : '❌'}</span>\n                </a>"
            content = content.replace(old_close, new_close, 1)

    # 8. Ayer clickeable
    old_ayer = "href={yesterday.kick ? `https://kick.com/${yesterday.kick}` : `https://twitch.tv/${yesterday.twitch}`}"
    new_ayer = "href={`/${getSlug(yesterday)}`}"
    if old_ayer in content:
        content = content.replace(old_ayer, new_ayer)
        applied.append("ayer clickeable")

    if content != original:
        with open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        print(f"  ✅ {len(applied)} cambios aplicados: {', '.join(applied)}")
        return True
    else:
        print(f"  ⚠️  Sin cambios (puede que ya estén aplicados o los patrones no matchearon)")
        return False


games = {
    'emojidle':    'app/emojidle/page.js',
    'chatdle':     'app/chatdle/page.js',
    'categorydle': 'app/categorydle/page.js',
}

print(f"Aplicando patches desde: {PROJECT_ROOT}\n")
for game, rel_path in games.items():
    path = os.path.join(PROJECT_ROOT, rel_path)
    print(f"📁 {game} ({rel_path})")
    patch_file(path, game)
    print()

print("✅ Listo. Revisá los cambios y pusheá.")
print()
print("IMPORTANTE: La card del streamer en el modal necesita verificación manual.")
print("Buscá en cada archivo: '<div style={{' justo antes de 'border: 1px solid var(--color-purple)'")
print("y asegurate que sea <a href={`/${slug}`}> con el cierre </a> al final del bloque.")
