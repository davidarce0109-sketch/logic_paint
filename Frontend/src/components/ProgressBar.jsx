export default function ProgressBar({ painted, total }) {
  const percent = total === 0 ? 0 : Math.round((painted / total) * 100);
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={painted} aria-label="Progreso de la imagen">
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress__text">{painted} de {total} piezas</span>
    </div>
  );
}
