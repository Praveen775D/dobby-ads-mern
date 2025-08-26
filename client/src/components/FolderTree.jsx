export default function FolderTree({ breadcrumbs, folders, onOpen, onBack }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ marginBottom: 8 }}>
        <button disabled={!onBack} onClick={onBack}>⬅ Back</button>
        <span style={{ marginLeft: 8 }}>
          {breadcrumbs.map((f, i) => (
            <span key={f._id}>
              {i > 0 && ' / '} {f.name}
            </span>
          ))}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {folders.map(f => (
          <div key={f._id} onClick={() => onOpen(f)} style={{ border:'1px solid #ddd', padding:10, cursor:'pointer', width:160 }}>
            📁 {f.name}
          </div>
        ))}
        {folders.length === 0 && <div>No folders</div>}
      </div>
    </div>
  );
}
