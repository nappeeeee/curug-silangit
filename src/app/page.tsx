'use client';

import { useEffect, useState } from 'react';
import { getAllGaleri } from '@/utils/galeri';
import { getKontakInfo } from '@/utils/kontak';
import './UserGaleri.css';

export default function HalamanUserGaleri() {
  const [galeri, setGaleri] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [kontakInfo, setKontakInfo] = useState<any>(null);

  useEffect(() => {
    const fetchGaleri = async () => {
      const data = await getAllGaleri();
      setGaleri(data);
    };

    const fetchKontak = async () => {
      const data = await getKontakInfo();
      console.log("🔥 Data kontak dari Firestore:", data); // DEBUG
      setKontakInfo(data);
    };

    fetchGaleri();
    fetchKontak();

    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }

      document.querySelectorAll<HTMLElement>('.section').forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          sec.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="user-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Curug Silangit</div>

        {/* Hamburger button */}
        <div
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav links */}
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a></li>
          <li><a href="#galeri" onClick={() => setIsMenuOpen(false)}>Galeri</a></li>
          <li><a href="#kontak" onClick={() => setIsMenuOpen(false)}>Kontak</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <header
        id="home"
        className="hero"
        style={{
          backgroundImage: "url('/curug-silangit.jpg')",
        }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">Curug Silangit</h1>
          <p className="hero-description">
            Menyatu dengan alam, dikelilingi tebing dan pepohonan, cocok untuk wisatawan yang mencari ketenangan.
          </p>
        </div>
      </header>

      {/* ABOUT US */}
      <section id="about" className="section info-section">
        <h2 className="section-title">Tentang Curug Silangit</h2>
        <div className="info-card">
          <p>{kontakInfo?.deskripsi || 'Memuat deskripsi...'}</p>
        </div>
      </section>

      {/* GALERI */}
      <section id="galeri" className="section galeri-section">
        <h2 className="section-title">Galeri Curug Silangit</h2>
        {galeri.length === 0 ? (
          <p className="galeri-empty">Belum ada foto yang ditampilkan.</p>
        ) : (
          <div className="galeri-grid">
            {galeri.map((item) => (
              <div
                key={item.id}
                className="galeri-item"
                onClick={() => setSelectedImage(item.url)}
              >
                <img src={item.url} alt="Foto Galeri" className="galeri-img" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* POPUP LIGHTBOX */}
      {selectedImage && (
        <div className="lightbox active" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Foto Besar" />
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}

      {/* KONTAK & MAP */}
<section id="kontak" className="section contact-map-section">
  <h2 className="section-title">Lokasi & Kontak</h2>
  <div className="contact-map-wrapper">
    <div className="contact-info">
      <ul>
        <li><strong>Alamat:</strong> {kontakInfo?.nama || '-'}</li> {/* Kalau mau nama jadi alamat */}
        <li><strong>Kontak:</strong> {kontakInfo?.kontak || '-'}</li>
        <li>
          <strong>Instagram:</strong> {kontakInfo?.instagram ? (
            <a href={`https://instagram.com/${kontakInfo.instagram}`} target="_blank" rel="noopener noreferrer">
              @{kontakInfo.instagram}
            </a>
          ) : '-'}
        </li>
        <li><strong>Jam Operasional:</strong> {kontakInfo?.jam || '-'}</li>
        <li><strong>Tiket Masuk:</strong> {kontakInfo?.tiket || '-'}</li>

      </ul>
    </div>
    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.5861723040684!2d109.60328203509623!3d-7.619925703021375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7ab4e4dcdd53a7%3A0x1fb1e6382c21bc09!2sCurug%20Silangit%20Sidoagung%20(Kedungprayogo)!5e0!3m2!1sid!2sid!4v1754714358604!5m2!1sid!2sid"
        width="100%"
        height="350"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>


      {/* FOOTER */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Curug Silangit. Hak cipta dilindungi.
      </footer>
    </div>
  );
}
