import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD7CcnooqZNupolmCuJH1FYLj_j62ggbsc",
  authDomain: "curug-silangit.firebaseapp.com",
  projectId: "curug-silangit",
  storageBucket: "curug-silangit.appspot.com", // ✅ Sudah benar di sini
  messagingSenderId: "830429948973",
  appId: "1:830429948973:web:34e5bd75b21cd013651ca4",
  measurementId: "G-97YWYKFKEL"
};

// ✅ Cek dulu apakah sudah ada instance Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
export const db = getFirestore(app);
export const storage = getStorage(app);
