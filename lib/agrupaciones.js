import { STREAMERS } from '../data/streamers';

export const SITE = 'https://streamdle.net';
// Una lista existe desde 1 streamer, pero solo se indexa desde 4.
export const MIN_INDEXAR = 4;

export const streamerSlug = (s) => s.display_name.toLowerCase().replace(/\s+/g, '-');

const norm = (v) =>
  String(v || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

// ── Signos ───────────────────────────────────────────────────────────────────
const SIGNOS = [
  { slug: 'aries',       label: 'Aries',       emoji: '♈', elemento: 'fuego',  fechas: '21 de marzo – 19 de abril' },
  { slug: 'tauro',       label: 'Tauro',       emoji: '♉', elemento: 'tierra', fechas: '20 de abril – 20 de mayo' },
  { slug: 'geminis',     label: 'Géminis',     emoji: '♊', elemento: 'aire',   fechas: '21 de mayo – 20 de junio' },
  { slug: 'cancer',      label: 'Cáncer',      emoji: '♋', elemento: 'agua',   fechas: '21 de junio – 22 de julio' },
  { slug: 'leo',         label: 'Leo',         emoji: '♌', elemento: 'fuego',  fechas: '23 de julio – 22 de agosto' },
  { slug: 'virgo',       label: 'Virgo',       emoji: '♍', elemento: 'tierra', fechas: '23 de agosto – 22 de septiembre' },
  { slug: 'libra',       label: 'Libra',       emoji: '♎', elemento: 'aire',   fechas: '23 de septiembre – 22 de octubre' },
  { slug: 'escorpio',    label: 'Escorpio',    emoji: '♏', elemento: 'agua',   fechas: '23 de octubre – 21 de noviembre' },
  { slug: 'sagitario',   label: 'Sagitario',   emoji: '♐', elemento: 'fuego',  fechas: '22 de noviembre – 21 de diciembre' },
  { slug: 'capricornio', label: 'Capricornio', emoji: '♑', elemento: 'tierra', fechas: '22 de diciembre – 19 de enero' },
  { slug: 'acuario',     label: 'Acuario',     emoji: '♒', elemento: 'aire',   fechas: '20 de enero – 18 de febrero' },
  { slug: 'piscis',      label: 'Piscis',      emoji: '♓', elemento: 'agua',   fechas: '19 de febrero – 20 de marzo' },
];

// ── Generaciones ─────────────────────────────────────────────────────────────
const GENERACIONES = [
  { slug: 'gen-z',      label: 'Gen Z',      dato: 'Gen Z',      rango: '1997–2012' },
  { slug: 'millennial', label: 'Millennial', dato: 'Millennial', rango: '1981–1996' },
  { slug: 'gen-x',      label: 'Gen X',      dato: 'Gen X',      rango: '1965–1980' },
];

// ── Personalidad: el campo tiene ~190 palabras casi todas únicas; se agrupan en
// familias para que cada página tenga masa suficiente. ─────────────────────────
const FAMILIAS = [
  { slug: 'divertidos', label: 'Divertidos y bromistas', emoji: '😂',
    intro: 'Los que viven del humor: bromas, ironía y ocurrencias en cada directo.',
    palabras: 'divertido bromista ocurrente comico ironico sarcastico absurdo parodico mordaz acida histrionico teatral peculiar bizarro alocado excentrico ingenioso infantil jovial alegre optimista positivo extravagante exagerado' },
  { slug: 'carismaticos', label: 'Carismáticos y sociables', emoji: '✨',
    intro: 'Magnetismo, cercanía y facilidad para conectar con el chat.',
    palabras: 'carismatico carismatica magnetico cercano amiguero sociable extrovertido amistoso amable galan elegante lider genuino autentico natural encantador' },
  { slug: 'competitivos', label: 'Competitivos y estrategas', emoji: '🏆',
    intro: 'Van a ganar: espíritu competitivo, cabeza fría y mucha ambición.',
    palabras: 'competitivo estratega ambicioso habilidoso atleta beligerante agresivo intenso explosivo autoritario imponente legendario talentoso talentosa prodigio genio' },
  { slug: 'disciplinados', label: 'Disciplinados y constantes', emoji: '🎯',
    intro: 'Constancia, método y oficio: años de directos sin aflojar.',
    palabras: 'perseverante disciplinado tenaz persistente resiliente constante metodico meticuloso perfeccionista profesional tecnico analitico enfocada veterano respetado historico longevo robusto' },
  { slug: 'tranquilos', label: 'Tranquilos y reservados', emoji: '😌',
    intro: 'Estilo calmado, pocas pulsaciones y mucha observación.',
    palabras: 'relajado relajada tranquilo sereno templado chill pacifico pacifista mediador reservado introvertido observador timida distraida frio' },
  { slug: 'calidos', label: 'Cálidos y leales', emoji: '💜',
    intro: 'Cercanía emocional: ternura, lealtad y cuidado de su comunidad.',
    palabras: 'dulce tierno tierna noble protector protectora leal familiar sensible caritativa humilde nostalgico' },
  { slug: 'creativos', label: 'Creativos e intelectuales', emoji: '🎨',
    intro: 'Ideas propias: creatividad, curiosidad y ganas de enseñar o inventar.',
    palabras: 'creativo creativa imaginativa innovadora visionario curioso intelectual estetica estetico narrador polifacetica versatil abstracto didactico educativo tecnologico misterioso mistico' },
  { slug: 'energicos', label: 'Enérgicos y aventureros', emoji: '⚡',
    intro: 'Pura energía: impulsivos, inquietos y siempre listos para lo próximo.',
    palabras: 'energico energetica activo dinamico hiperactivo inquieto aventurero intrepido arriesgado espontaneo espontanea impulsivo atrevida entusiasta apasionado pasional desinhibido atolondrado fanatico caotico errático erratico volatil' },
  { slug: 'rebeldes', label: 'Rebeldes y polémicos', emoji: '🔥',
    intro: 'Sin filtro: irreverentes, críticos y a veces polémicos.',
    palabras: 'polemico provocador rebelde irreverente cinico critico toxico gruñon gruñon directa dramatico empoderada guerrera' },
];

const familiaPorPalabra = new Map();
FAMILIAS.forEach((f) => f.palabras.split(/\s+/).forEach((w) => familiaPorPalabra.set(norm(w), f)));

export function familiaDe(personalidad) {
  return familiaPorPalabra.get(norm(personalidad)) ?? null;
}

// ── Definición de cada agrupación ────────────────────────────────────────────
function enriquecer(s, extra) {
  return { ...s, _slug: streamerSlug(s), ...extra };
}

export const TIPOS = {
  signo: {
    ruta: 'signo',
    singular: 'signo zodiacal',
    hubTitulo: 'Streamers por signo zodiacal',
    hubDesc: 'Descubrí qué streamers hispanos son Aries, Tauro, Géminis, Escorpio y el resto de los signos del zodiaco. Fichas con fecha de nacimiento, seguidores y país.',
    grupos() {
      return SIGNOS.map((g) => ({
        ...g,
        titulo: `Streamers ${g.label}`,
        etiqueta: `${g.emoji} ${g.label}`,
        miembros: STREAMERS.filter((s) => norm(s.zodiac) === g.slug).map((s) =>
          enriquecer(s, { detalle: s.birth_date || '' })),
      }));
    },
    intro(g) {
      return `${g.label} es un signo de ${g.elemento} (${g.fechas}). Estos son los streamers hispanos de Twitch y Kick nacidos bajo este signo.`;
    },
  },
  generacion: {
    ruta: 'generacion',
    singular: 'generación',
    hubTitulo: 'Streamers por generación',
    hubDesc: 'Streamers hispanos de la Gen Z, Millennials y Gen X en Twitch y Kick: quién es de qué generación y cuántos seguidores tiene.',
    grupos() {
      return GENERACIONES.map((g) => ({
        ...g,
        titulo: `Streamers ${g.label}`,
        etiqueta: `${g.label} · ${g.rango}`,
        miembros: STREAMERS.filter((s) => s.generation === g.dato).map((s) =>
          enriquecer(s, { detalle: s.birth_year ? `Nació en ${s.birth_year}` : '' })),
      }));
    },
    intro(g) {
      return `La generación ${g.label} abarca a los nacidos entre ${g.rango.replace('–', ' y ')}. Estos son los streamers hispanos de Twitch y Kick que pertenecen a ella.`;
    },
  },
  nacimiento: {
    ruta: 'nacimiento',
    singular: 'año de nacimiento',
    hubTitulo: 'Streamers por año de nacimiento',
    hubDesc: 'Qué streamers hispanos nacieron en cada año: de los 70 a los 2000. Edad, fecha de nacimiento, país y seguidores en Twitch y Kick.',
    grupos() {
      const porAnio = new Map();
      STREAMERS.forEach((s) => {
        if (!s.birth_year) return;
        if (!porAnio.has(s.birth_year)) porAnio.set(s.birth_year, []);
        porAnio.get(s.birth_year).push(s);
      });
      return [...porAnio.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([anio, lista]) => ({
          slug: String(anio),
          label: String(anio),
          titulo: `Streamers nacidos en ${anio}`,
          etiqueta: String(anio),
          anio,
          miembros: lista.map((s) => enriquecer(s, { detalle: s.birth_date || '' })),
        }));
    },
    intro(g) {
      const edad = new Date().getFullYear() - g.anio;
      return `Streamers hispanos de Twitch y Kick que nacieron en ${g.anio}, hoy con ${edad - 1} o ${edad} años según el día de su cumpleaños.`;
    },
  },
  personalidad: {
    ruta: 'personalidad',
    singular: 'personalidad',
    hubTitulo: 'Streamers por personalidad',
    hubDesc: 'Divertidos, competitivos, tranquilos, carismáticos o rebeldes: los streamers hispanos agrupados por su personalidad en Twitch y Kick.',
    grupos() {
      return FAMILIAS.map((f) => ({
        slug: f.slug,
        label: f.label,
        titulo: `Streamers ${f.label.toLowerCase()}`,
        etiqueta: `${f.emoji} ${f.label}`,
        introFija: f.intro,
        miembros: STREAMERS.filter((s) => familiaDe(s.personality)?.slug === f.slug).map((s) =>
          enriquecer(s, { detalle: s.personality || '' })),
      }));
    },
    intro(g) {
      return `${g.introFija} Estos son los streamers hispanos cuya personalidad encaja en esta familia.`;
    },
  },
};

export function gruposDe(tipo) {
  return TIPOS[tipo]
    .grupos()
    .map((g) => ({ ...g, miembros: [...g.miembros].sort((a, b) => (b.total_followers || 0) - (a.total_followers || 0)) }))
    .filter((g) => g.miembros.length >= 1)
    .map((g) => ({ ...g, indexable: g.miembros.length >= MIN_INDEXAR }));
}

export function resumenDe(grupo) {
  const m = grupo.miembros;
  const top = m.slice(0, 3).map((s) => s.display_name);
  const cuenta = (campo) => {
    const c = {};
    m.forEach((s) => { if (s[campo]) c[s[campo]] = (c[s[campo]] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  };
  const paises = { ES: 'España', AR: 'Argentina', MX: 'México', PE: 'Perú', CO: 'Colombia', CL: 'Chile', UY: 'Uruguay', VE: 'Venezuela' };
  const [pais] = cuenta('country')[0] ?? [];
  const [cat] = cuenta('top_category')[0] ?? [];
  const partes = [m.length === 1 ? 'Hay 1 streamer en esta lista.' : `Hay ${m.length} streamers en esta lista.`];
  if (top.length) partes.push(`Los más seguidos son ${top.join(', ')}.`);
  if (pais) partes.push(`El país más repetido es ${paises[pais] ?? pais}.`);
  if (cat) partes.push(`La categoría más habitual es ${cat}.`);
  return partes.join(' ');
}

export function enlacesDeFicha(s) {
  const gen = GENERACIONES.find((g) => g.dato === s.generation);
  const fam = familiaDe(s.personality);
  return {
    signo: s.zodiac ? `/streamers/signo/${norm(s.zodiac)}` : null,
    generacion: gen ? `/streamers/generacion/${gen.slug}` : null,
    nacimiento: s.birth_year ? `/streamers/nacimiento/${s.birth_year}` : null,
    personalidad: fam ? `/streamers/personalidad/${fam.slug}` : null,
  };
}

export const TIPOS_LISTA = [
  { tipo: 'signo', label: '♈ Por signo' },
  { tipo: 'generacion', label: '👥 Por generación' },
  { tipo: 'nacimiento', label: '🎂 Por año de nacimiento' },
  { tipo: 'personalidad', label: '🎭 Por personalidad' },
];

export { MESES };
