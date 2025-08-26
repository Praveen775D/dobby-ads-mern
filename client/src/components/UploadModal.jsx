import { useRef, useState } from 'react';

export default function UploadModal({ open, onClose, onUpload }) {
  const [name, setName] = useState('');
  const fileRef = useRef();

  if (!open) return null;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center' }}>
      <div style={{ background:'#fff', padding:16, width :360 }}>
        <h3>Upload Image</h3>
        <input placeholder="Image name" value={name} onChange={(e)=>setName(e.target.value)} style={{ width :'100%', margin:'8px 0' }} />
        <input type="file" accept="image/*" ref={fileRef} />
        <div style={{ display:'flex', gap:8, marginTop :12 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={()=>{
            const file = fileRef.current?.files?.[0];
            if (!name.trim() || !file) return;
            onUpload({ name, file });
            setName('');
            if (fileRef.current) fileRef.current.value = '';
          }}>Upload</button>
        </div>
      </div>
    </div>
  );
}
