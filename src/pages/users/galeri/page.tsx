// app/galeri/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAllGaleri } from '@/utils/galeri';

export default function GaleriPage() {
  const [galeri, setGaleri] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllGaleri();
      setGaleri(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Galeri Wisata</h1>

      {galeri.length === 0 ? (
        <p>Belum ada gambar tersedia.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galeri.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer hover:opacity-80 transition"
              onClick={() => setSelectedImage(item.url)}
            >
              <img
                src={item.url}
                alt="Galeri"
                className="w-full h-40 object-cover rounded-lg shadow"
              />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 bg-white text-black px-2 py-1 rounded-bl-md text-sm"
            >
              Tutup
            </button>
            <img
              src={selectedImage}
              alt="Popup Galeri"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
