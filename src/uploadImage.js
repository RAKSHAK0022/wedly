export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "wedly_upload");

  const res = await fetch("https://api.cloudinary.com/v1_1/dneeihxjq/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};