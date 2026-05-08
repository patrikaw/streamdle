import csv, re, json

def norm_url(url, platform):
    if not url or not url.strip(): return ''
    url = url.strip().rstrip('/')
    prefixes = {
        'twitch': ['https://www.twitch.tv/', 'https://twitch.tv/', 'http://www.twitch.tv/', 'http://twitch.tv/', 'www.twitch.tv/', 'twitch.tv/'],
        'kick':   ['https://kick.com/', 'http://kick.com/', 'kick.com/'],
    }
    for p in prefixes.get(platform, []):
        if url.lower().startswith(p.lower()):
            return url[len(p):]
    if '/' not in url: return url
    return url

def parse_birth(s):
    if not s or not s.strip(): return None, None, None, None
    s = s.strip()
    months = {'enero':1,'febrero':2,'marzo':3,'abril':4,'mayo':5,'junio':6,
              'julio':7,'agosto':8,'septiembre':9,'octubre':10,'noviembre':11,'diciembre':12}
    m = re.match(r'(\d+)\s+de\s+(\w+)\s+de\s+(\d{4})', s.lower())
    if not m: return None, None, None, None
    d, mn, y = int(m.group(1)), m.group(2), int(m.group(3))
    mo = months.get(mn)
    return y, mo, d, s

def zodiac(mo, d):
    if not mo or not d: return None
    z = [((3,21),(4,19),'Aries'),((4,20),(5,20),'Tauro'),((5,21),(6,20),'Geminis'),
         ((6,21),(7,22),'Cancer'),((7,23),(8,22),'Leo'),((8,23),(9,22),'Virgo'),
         ((9,23),(10,22),'Libra'),((10,23),(11,21),'Escorpio'),((11,22),(12,21),'Sagitario'),
         ((12,22),(1,19),'Capricornio'),((1,20),(2,18),'Acuario'),((2,19),(3,20),'Piscis')]
    for (sm,sd),(em,ed),name in z:
        if sm <= em:
            if mo == sm and d >= sd: return name
            if mo == em and d <= ed: return name
            if sm < mo < em: return name
        else:
            if (mo == sm and d >= sd) or (mo == em and d <= ed): return name
    return None

def generation(y):
    if not y: return None
    if y < 1965: return 'Baby Boomer'
    if y < 1981: return 'Gen X'
    if y < 1997: return 'Millennial'
    if y < 2013: return 'Gen Z'
    return 'Gen Alpha'

def clip_id(url):
    if not url: return None
    m = re.search(r'/clip/([^/?]+)', url)
    return m.group(1) if m else None

def jv(v):
    if v is None: return 'null'
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, int): return str(v)
    if isinstance(v, list):
        if not v: return '[]'
        return '[' + ','.join(json.dumps(i, ensure_ascii=False) for i in v) + ']'
    return json.dumps(v, ensure_ascii=False)

with open('c:/Users/Usuario/Downloads/Stream Data - Sheet1.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

entries = []
for r in rows:
    twitch = norm_url(r.get('twitch_url',''), 'twitch')
    kick   = norm_url(r.get('kick_url',''),   'kick')
    by, bmo, bd, bdate = parse_birth(r.get('birth_year',''))

    aliases_raw = r.get('aliases','').strip()
    aliases = [a.strip() for a in aliases_raw.split(',')] if aliases_raw else []

    comm_raw = r.get('community','').strip()
    if ',' in comm_raw:
        community = [c.strip() for c in comm_raw.split(',')]
    elif comm_raw:
        community = comm_raw
    else:
        community = None

    events_raw = r.get('events','').strip()
    events = [e.strip() for e in events_raw.split(',')] if events_raw else []

    def si(k, default=0):
        v = r.get(k,'').strip()
        try: return int(v) if v else default
        except: return default

    cl_url  = r.get('top_clip_url','').strip() or None
    cl_id   = clip_id(cl_url)
    youtube_url = r.get('youtube_url','').strip() or None

    parts = [
        'id:' + str(si('id')),
        'name:' + jv(r.get('name','').strip()),
        'display_name:' + jv(r.get('display_name','').strip()),
        'country:' + jv(r.get('country','').strip()),
        'language:' + jv(r.get('language','').strip()),
        'twitch:' + jv(twitch),
        'kick:' + jv(kick),
        'youtube:' + jv(''),
        'twitch_followers:' + str(si('twitch_followers')),
        'kick_followers:' + str(si('kick_followers')),
        'total_followers:' + str(si('total_followers')),
        'twitch_hours:' + str(si('twitch_hours_streamed')),
        'kick_hours:' + str(si('kick_hours_streamed')),
        'total_hours:' + str(si('total_hours_streamed')),
        'top_category:' + jv(r.get('top_category','').strip() or None),
        'second_category:' + jv(r.get('second_category','').strip() or None),
        'peak_viewers:' + str(si('peak_viewers')),
        'is_active:' + jv(r.get('is_active','').strip().upper()=='TRUE'),
        'aliases:' + jv(aliases),
        'catchphrase:' + jv(r.get('catchphrase','').strip() or None),
        'emojis:' + jv(r.get('emojis','').strip() or None),
        'community:' + jv(community),
        'esports_team:' + jv(r.get('esports_team','').strip() or None),
        'real_name:' + jv(r.get('real_name','').strip() or None),
        'events:' + jv(events),
        'birth_year:' + jv(by),
        'birth_month:' + jv(bmo),
        'birth_day:' + jv(bd),
        'birth_date:' + jv(bdate),
        'zodiac:' + jv(zodiac(bmo,bd)),
        'generation:' + jv(generation(by)),
        'created_at:' + jv(r.get('created_at','').strip() or None),
        'broadcaster_type:' + jv(r.get('broadcaster_type','').strip() or None),
        'description:' + jv(r.get('description','').strip() or None),
        'personality:' + jv(r.get('personality','').strip() or None),
        'twitter_url:' + jv(r.get('twitter_url','').strip() or None),
        'instagram_url:' + jv(r.get('instagram_url','').strip() or None),
        'tiktok_url:' + jv(r.get('tiktok_url','').strip() or None),
        'youtube_url:' + jv(youtube_url),
        'top_clip_url:' + jv(cl_url),
        'top_clip_id:' + jv(cl_id),
        'top_clip_title:' + jv(r.get('top_clip_title','').strip() or None),
        'top_clip_views:' + str(si('top_clip_views')),
        'top_content:' + jv(r.get('top_content','').strip() or None),
        'second_content:' + jv(r.get('second_content','').strip() or None),
        'bio:' + jv(r.get('bio','').strip() or None),
        'trivia_q:' + jv(r.get('trivia_q','').strip() or None),
        'trivia_a:' + jv(r.get('trivia_a','').strip() or None),
        'trivia_opts:' + jv([o.strip() for o in r.get('trivia_opts','').split('|') if o.strip()] or None),
        'trivia_exp:' + jv(r.get('trivia_exp','').strip() or None),
    ]
    entries.append('{' + ', '.join(parts) + '}')

header = '// Auto-generado — NO editar manualmente\nexport const STREAMERS = [\n'
body = ',\n'.join('  ' + e for e in entries)
footer = '''
];

export const COUNTRIES = [
  {code:"ALL",label:"\U0001f30e Todos"},
  {code:"AR",label:"\U0001f1e6\U0001f1f7 Argentina"},
  {code:"MX",label:"\U0001f1f2\U0001f1fd México"},
  {code:"ES",label:"\U0001f1ea\U0001f1f8 España"},
  {code:"LATAM",label:"\U0001f30e LATAM"},
];
export const LATAM_COUNTRIES = ["AR","MX","CO","PE","CL","VE","UY","SV","PR","DO","GT","HN","CR","PA","CU","NI","BO","PY","EC","FR","NO"];
export const REDUCED_WEIGHT_COUNTRIES = ["AR","MX"];

export function getStreamersByCountry(country) {
  if (country === "ALL") return STREAMERS;
  if (country === "LATAM") return STREAMERS.filter(s => s.country !== "ES");
  return STREAMERS.filter(s => s.country === country);
}

export function searchStreamers(query, country = "ALL") {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const pool = getStreamersByCountry(country);
  const score = s => {
    const d = s.display_name.toLowerCase();
    if (d.startsWith(q)) return 0;
    if ((s.twitch||"").toLowerCase().startsWith(q)) return 1;
    if ((s.kick||"").toLowerCase().startsWith(q)) return 2;
    if (s.aliases.some(a => a.toLowerCase().startsWith(q))) return 3;
    if (d.includes(q)) return 4;
    if ((s.twitch||"").toLowerCase().includes(q)) return 5;
    if ((s.kick||"").toLowerCase().includes(q)) return 6;
    if (s.aliases.some(a => a.toLowerCase().includes(q))) return 7;
    return 8;
  };
  return pool.map(s=>({s,sc:score(s)})).filter(x=>x.sc<8)
    .sort((a,b)=>a.sc!==b.sc?a.sc-b.sc:a.s.display_name.localeCompare(b.s.display_name))
    .map(x=>x.s).slice(0,12);
}

export function getDailyStreamer(country = "ALL", gameOffset = 0) {
  const pool = getStreamersByCountry(country);
  const t = new Date();
  const seed = t.getFullYear()*10000+(t.getMonth()+1)*100+t.getDate();
  return pool[(seed+gameOffset)%pool.length];
}

const GAME_COUNTRIES = ['ALL', 'AR', 'MX', 'ES', 'LATAM'];
const COOLDOWN_DAYS = 30;

function _dateSeed(date) {
  return date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate();
}

function _buildPool(country, filter) {
  let pool = getStreamersByCountry(country);
  if (filter) pool = pool.filter(filter);
  return pool;
}

function _pickForDate(country, offset, filter, date) {
  const seed = _dateSeed(date);
  const recentIds = new Set();
  for (let d = 1; d <= COOLDOWN_DAYS; d++) {
    const past = new Date(date);
    past.setDate(past.getDate() - d);
    const pastSeed = _dateSeed(past);
    for (const c of GAME_COUNTRIES) {
      const pastPool = _buildPool(c, filter);
      if (pastPool.length === 0) continue;
      const picked = pastPool[(pastSeed + offset) % pastPool.length];
      if (picked) recentIds.add(picked.id);
    }
  }
  const pool = _buildPool(country, filter);
  let available = pool.filter(s => !recentIds.has(s.id));
  if (available.length < 3) {
    const localRecent = new Set();
    for (let d = 1; d <= 7; d++) {
      const past = new Date(date);
      past.setDate(past.getDate() - d);
      const pastSeed = _dateSeed(past);
      const pastPool = _buildPool(country, filter);
      if (pastPool.length === 0) continue;
      const picked = pastPool[(pastSeed + offset) % pastPool.length];
      if (picked) localRecent.add(picked.id);
    }
    available = pool.filter(s => !localRecent.has(s.id));
    if (available.length === 0) available = pool;
  }
  return available[(seed + offset) % available.length];
}

export function getDailyStreamerNoRepeat(country="ALL", gameKey="classic", offset=0, filter=null) {
  return _pickForDate(country, offset, filter, new Date());
}

export function getYesterdayStreamer(country="ALL", gameKey="classic", offset=0, filter=null) {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return _pickForDate(country, offset, filter, y);
}
'''

with open('C:/Users/Usuario/Desktop/streamdle/data/streamers.js', 'w', encoding='utf-8') as f:
    f.write(header + body + footer)

# Verify
bad = [r for r in rows if r.get('twitch_url','').strip() and '/' in norm_url(r.get('twitch_url',''), 'twitch')]
print(f"Streamers escritos: {len(rows)}")
print(f"URLs de Twitch mal formadas restantes: {len(bad)}")
if bad:
    for r in bad:
        print(f"  {r['name']}: {r['twitch_url']} -> {norm_url(r['twitch_url'], 'twitch')}")
