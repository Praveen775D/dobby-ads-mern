import { useState } from 'react';

export default function Toolbar({ onCreateFolder, onSearch, onLogout }) {
  const [name, setName] = useState('');
  const [q, setQ] = useState('');

  return (
    <div className="toolbar" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <input placeholder="New folder name" value={name} onChange={(e)=>setName(e.target.value)} />
      <button onClick={()=>{ if(name.trim()) {onCreateFolder(name); setName('');}}}>+ Folder</button>

      <input placeholder="Search images by name" value={q} onChange={(e)=>setQ(e.target.value)} />
      <button onClick={()=>onSearch(q)}>Search</button>

      <div style={{ marginLeft: 'auto' }}>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
