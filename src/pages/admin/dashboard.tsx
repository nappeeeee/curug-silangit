'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './DashboardAdmin.css';
import { uploadImage } from '@/utils/upload';
import { getAllGaleri } from '@/utils/galeri';
import { getFirestore, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';

export default function DashboardAdmin() {
  const router = useRouter();
  const db = getFirestore(app);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [galeri, setGaleri] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // State untuk informasi wisata
  const [infoWisata, setInfoWisata] = useState({
    nama: '',
    deskripsi: '',
    kontak: '',
    instagram: '',
    jam: '',
    tiket: '',
    fasilitas: ''
  });
  const [savingInfo, setSavingInfo] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.replace('/admin/login');
    } else {
      fetchGaleri();
      fetchInfoWisata();
    }
  }, []);

  const fetchGaleri = async () => {
    const data = await getAllGaleri();
    setGaleri(data);
  };

  const fetchInfoWisata = async () => {
    try {
      const docRef = doc(db, 'informasi', 'wisata');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInfoWisata(docSnap.data() as typeof infoWisata);
      }
    } catch (error) {
      console.error('Gagal mengambil informasi wisata', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setMessage('');
      await uploadImage(selectedFile);
      setMessage('Upload berhasil!');
      setSelectedFile(null);
      await fetchGaleri();
    } catch (err) {
      console.error(err);
      setMessage('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string, docId: string) => {
    try {
      const res = await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (!res.ok) {
        throw new Error(`Gagal menghapus gambar: ${res.statusText}`);
      }

      await deleteDoc(doc(db, 'galeri', docId));

      alert('Gambar berhasil dihapus!');
      await fetchGaleri();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menghapus gambar.');
    }
  };

  const handleView = (url: string) => {
    setSelectedImage(url);
    setShowPopup(true);
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfoWisata({
      ...infoWisata,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveInfo = async () => {
    try {
      setSavingInfo(true);
      await setDoc(doc(db, 'informasi', 'wisata'), infoWisata);
      alert('Informasi wisata berhasil disimpan!');
    } catch (error) {
      console.error('Gagal menyimpan informasi wisata', error);
      alert('Gagal menyimpan informasi');
    } finally {
      setSavingInfo(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <div className="dashboard-header">
          <h1>Dashboard Admin</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          {/* Kelola Galeri */}
          <div className="dashboard-card">
            <h2>Kelola Galeri Foto</h2>
            <p>Upload gambar untuk galeri wisata.</p>

            <div className="upload-form">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="upload-button"
              >
                {uploading ? 'Mengupload...' : 'Upload Gambar'}
              </button>
              {message && <p className="upload-message">{message}</p>}
            </div>

            <div className="galeri-container">
              <h3 className="text-lg font-semibold mt-6 mb-2">Foto Galeri</h3>
              {galeri.length === 0 ? (
                <p>Belum ada gambar di galeri.</p>
              ) : (
                <div className="galeri-grid">
                  {galeri.map((item) => (
                    <div key={item.id} className="galeri-item">
                      <img src={item.url} alt="Galeri" />
                      <div className="button-group">
                        <button
                          className="view-button"
                          onClick={() => handleView(item.url)}
                        >
                          Lihat
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(item.public_id, item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Informasi Wisata */}
          <div className="dashboard-card">
            <h2>Informasi Wisata</h2>
            <p>Ubah deskripsi, alamat, dan kontak wisata.</p>

            <div className="info-form">
              <input
                type="text"
                name="nama"
                placeholder="Nama Wisata"
                value={infoWisata.nama}
                onChange={handleInfoChange}
              />
              <textarea
                name="deskripsi"
                placeholder="Deskripsi Wisata"
                value={infoWisata.deskripsi}
                onChange={handleInfoChange}
              />
              <input
                type="text"
                name="kontak"
                placeholder="Kontak"
                value={infoWisata.kontak}
                onChange={handleInfoChange}
              />
              <input
                type="text"
                name="instagram"
                placeholder="Instagram"
                value={infoWisata.instagram}
                onChange={handleInfoChange}
              />
              <input
                type="text"
                name="jam"
                placeholder="Jam Operasional"
                value={infoWisata.jam}
                onChange={handleInfoChange}
              />
              <input
                type="text"
                name="tiket"
                placeholder="Harga Tiket"
                value={infoWisata.tiket}
                onChange={handleInfoChange}
              />

              <button onClick={handleSaveInfo} disabled={savingInfo}>
                {savingInfo ? 'Menyimpan...' : 'Simpan Informasi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal PopUp Gambar */}
      {showPopup && selectedImage && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Preview" />
            <button className="close-button" onClick={() => setShowPopup(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
