export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "upload_galeri"); // Pastikan ini sama dengan preset yg kamu buat di Cloudinary
  formData.append("folder", "galeri");

  const response = await fetch("https://api.cloudinary.com/v1_1/dwy5gp05w/image/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload ke Cloudinary gagal");
  }

  const data = await response.json();
  return data.secure_url;
};
