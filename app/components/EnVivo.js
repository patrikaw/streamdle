import { fmtNum } from '../../lib/formato';

export default function EnVivo({ viewers, style }) {
  return <span className="ui-live" style={style}>EN VIVO{viewers > 0 ? ` · ${fmtNum(viewers)}` : ''}</span>;
}
