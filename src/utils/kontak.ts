import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const getKontakInfo = async () => {
  try {
    // Path: informasi (collection) -> wisata (document)
    const docRef = doc(db, "informasi", "wisata");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("🔥 Data kontak dari Firestore:", docSnap.data());
      return docSnap.data();
    } else {
      console.error("❌ Dokumen kontak tidak ditemukan!");
      return null;
    }
  } catch (error) {
    console.error("⚠️ Error mengambil data kontak:", error);
    return null;
  }
};
