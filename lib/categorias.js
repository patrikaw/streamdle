// Categorías de Twitch/Kick que no son juegos: no se "juegan", se "hacen streams de" eso.
const NO_JUEGO = ['just chatting', 'irl', 'sports', 'kings league', 'talk shows & podcasts', 'asmr', 'art', 'music', 'special events'];

export const esJuego = (cat) => !!cat && !NO_JUEGO.includes(cat.trim().toLowerCase());

const sobreQue = (cat) => (cat.trim().toLowerCase() === 'irl' ? 'streams IRL' : `streams de ${cat}`);

// "Juega Fortnite" / "Hace streams de Just Chatting"
export const actividadCorta = (cat) => (!cat ? '' : esJuego(cat) ? `Juega ${cat}` : `Hace ${sobreQue(cat)}`);

// " que juega sobre todo Fortnite" / " que hace sobre todo streams de Just Chatting"
export const actividadLarga = (cat) => (!cat ? '' : esJuego(cat) ? ` que juega sobre todo ${cat}` : ` que hace sobre todo ${sobreQue(cat)}`);
