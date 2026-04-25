export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // ⚠️ IMPORTANT: use EXACT key
    formData.append("upload_preset", "wedly_upload");

    console.log("Sending preset:", "wedly_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dneeihxjq/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("Cloudinary response:", data);

    if (!data.secure_url) {
      throw new Error("Upload failed");
    }

    return data.secure_url;
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed");
  }
};