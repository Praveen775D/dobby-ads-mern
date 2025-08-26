import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Toolbar from '../components/Toolbar';
import FolderTree from '../components/FolderTree';
import ImageGrid from '../components/ImageGrid';
import UploadModal from '../components/UploadModal';

export default function Drive() {
  const { logout } = useAuth();
  const [stack, setStack] = useState([]); // breadcrumb stack of folders
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const currentFolderId = useMemo(() => (stack.length ? stack[stack.length - 1]._id : null), [stack]);

  const loadFolders = async (parentId = null) => {
    const { data } = await api.get('/folders', { params: { parentId } });
    setFolders(data);
  };

  const loadImages = async () => {
    if (!currentFolderId) { setImages([]); return; }
    const { data } = await api.get('/images', { params: { folderId: currentFolderId } });
    setImages(data);
  };

  const refresh = async () => {
    await loadFolders(currentFolderId);
    await loadImages();
  };

  useEffect(() => { refresh(); }, [currentFolderId]);

  const createFolder = async (name) => {
    await api.post('/folders', { name, parentId: currentFolderId });
    await loadFolders(currentFolderId);
  };

  const openFolder = async (f) => {
    setStack((s) => [...s, f]);
  };

  const goBack = () => {
    setStack((s) => s.slice(0, -1));
  };

  const doSearch = async (q) => {
    if (!q.trim()) { await loadImages(); return; }
    const { data } = await api.get('/images/search', { params: { q } });
    setImages(data);
  };

  const doUpload = async ({ name, file }) => {
    const form = new FormData();
    form.append('name', name);
    form.append('folderId', currentFolderId);
    form.append('image', file);
    await api.post('/images/upload', form, { headers: { 'Content-Type': 'multipart/form-data' }});
    setUploadOpen(false);
    await loadImages();
  };

  return (
    <div style={{ maxWidth :1000, margin:'20px auto', padding:16 }}>
      <Toolbar onCreateFolder={createFolder} onSearch={doSearch} onLogout={logout} />
      <FolderTree
        breadcrumbs={[{ _id:'root', name:'Root' }, ...stack]}
        folders={folders}
        onOpen={openFolder}
        onBack={stack.length ? goBack : undefined}
      />

      <div style={{ display:'flex', alignItems:'center', gap:8, margin:'8px 0' }}>
        <button disabled={!currentFolderId} onClick={()=>setUploadOpen(true)}>Upload Image</button>
        {!currentFolderId && <span>Tip: open a folder before uploading</span>}
      </div>

      <ImageGrid images={images} />
      <UploadModal open={uploadOpen} onClose={()=>setUploadOpen(false)} onUpload={doUpload} />
    </div>
  );
}
