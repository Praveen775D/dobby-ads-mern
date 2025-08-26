import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await signup(name, email, password);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth" style={{ maxWidth : 360, margin:'80px auto' }}>
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {err && <div style={{ color:'red' }}>{err}</div>}
        <button type="submit">Create account</button>
      </form>
      <div style={{ marginTop :8 }}>Have an account? <Link to="/login">Login</Link></div>
    </div>
  );
}
