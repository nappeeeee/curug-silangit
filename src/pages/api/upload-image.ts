import { v2 as cloudinary } from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase/config'; // atau config yang sesuai
import { collection, addDoc, Timestamp } from 'firebase/firestore';

cloudinary.config({
  cloud_name: 'dwy5gp05w',
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl, fileName } = req.body;

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'galeri',
      public_id: fileName, // opsional jika kamu ingin set nama
    });

    // ✅ Simpan URL dan public_id ke Firestore
    await addDoc(collection(db, 'galeri'), {
      url: result.secure_url,
      public_id: result.public_id, // ← penting!
      createdAt: Timestamp.now(),
    });

    res.status(200).json({ message: 'Image uploaded', result });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
}
