export default function ImageGrid({ images }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {images.map(img => (
        <div key={img._id} style={{ border:'1px solid #eee', padding:8 }}>
          <img src={img.url} alt={img.name} style={{ width :'100%', height :120, objectFit:'cover' }} />
          <div style={{ marginTop :6, fontSize:14 }}>{img.name}</div>
        </div>
      ))}
      {images.length === 0 && <div>No images</div>}
    </div>
  );
}
