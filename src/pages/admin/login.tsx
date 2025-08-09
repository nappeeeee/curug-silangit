'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginAdmin } from '@/utils/auth';
import { FaUser, FaLock } from 'react-icons/fa';
import './AdminLogin.css'; // <--- Tambahkan ini

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(username, password);
    if (success) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2 className="login-title">Login Admin Wisata</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">Masuk</button>
      </form>
    </div>
  );
}
