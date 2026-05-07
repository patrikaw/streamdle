#!/usr/bin/env python3
"""
Parchea app/higherdle/page.js para hacer los nombres de streamer clickeables
Ejecutar desde la raíz del proyecto streamdle:
    python3 apply_higherdle_patch.py
"""
import os

PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app', 'higherdle', 'page.js')

SLUG_FN = """function getSlug(s) { return s.display_name.toLowerCase().replace(/\\s+/g,\'-\'); }\n\n"""

if not os.path.exists(PATH):
    print(f"No encontrado: {PATH}"); exit(1)

with open(PATH, encoding='utf-8') as f:
    content = f.read()

original = content

# 1. Agregar getSlug
if 'function getSlug' not in content:
    content = content.replace(
        "function formatNum(n) {",
        SLUG_FN.replace("\\", "\\") + "function formatNum(n) {",
        1
    )

# 2. StreamerCard: hacer el nombre clickeable
# En StreamerCard hay el nombre del streamer:
#   <div style={{ fontSize: '28px', fontWeight: '800', ... }}>
#     {streamer.display_name}
#   </div>
old_name = """        <div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {streamer.display_name}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{streamer.country}</div>
        </div>"""
new_name = """        <div>
          <a href={`/${getSlug(streamer)}`} style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-purple-light)'}
              onMouseOut={e => e.currentTarget.style.color = 'white'}>
              {streamer.display_name}
            </div>
          </a>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{streamer.country}</div>
        </div>"""

if old_name in content:
    content = content.replace(old_name, new_name, 1)
    print("✅ Nombre en StreamerCard clickeable")

# 3. Game over: los 2 streamers (left y right) ya se muestran pero sin link
# Buscar el lugar donde se muestran en la pantalla de game over no hay cards de streamers
# El game over tiene un modal centrado sin mostrar los streamers directamente
# Solo el fondo difuminado - no hay nada más que hacer aquí

if content != original:
    with open(PATH, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("✅ higherdle/page.js actualizado")
else:
    print("⚠️ Sin cambios")
