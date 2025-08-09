import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

export const loginAdmin = async (username: string, password: string) => {
  const q = query(
    collection(db, "admins"),
    where("username", "==", username),
    where("password", "==", password)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
