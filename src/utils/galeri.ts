import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase/config';

export const getAllGaleri = async () => {
  const db = getFirestore(app);
  const galeriRef = collection(db, 'galeri');
  const snapshot = await getDocs(galeriRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};
