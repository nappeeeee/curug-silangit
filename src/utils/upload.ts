import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebase/config';

export const uploadImage = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'upload_galeri'); // Pastikan sama dengan preset Cloudinary kamu
  formData.append('folder', 'galeri');

  // Upload ke Cloudinary
  const res = await fetch('https://api.cloudinary.com/v1_1/dwy5gp05w/image/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Upload ke Cloudinary gagal');
  }
  const data = await res.json();
  const imageUrl = data.secure_url;
  const publicId = data.public_id; // ← Tambahkan ini


  // Simpan link gambar ke Firestore
  const db = getFirestore(app);
  await addDoc(collection(db, 'galeri'), {
    url: imageUrl,
     public_id: publicId, // ← Simpan public_id-nya
    createdAt: serverTimestamp(),
  });
};
