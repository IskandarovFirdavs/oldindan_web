export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}
