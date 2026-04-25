export const uploadImage = async (file) => {
  if (!file) {
    alert("No file selected");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    // 🔐 Move this to ENV later (recommended)
    formData.append("upload_preset", "wedly_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dneeihxjq/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    // ❗ Handle HTTP errors
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    // ❗ Cloudinary error handling
    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.secure_url) {
      throw new Error("Upload failed: No URL returned");
    }

    return data.secure_url;
  } catch (err) {
    console.error("Upload error:", err.message);
    alert("Image upload failed. Try again.");
    return null; // ✅ important (prevents undefined bugs)
  }
};