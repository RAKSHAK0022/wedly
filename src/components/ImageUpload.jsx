import { useState } from "react";
import { uploadImage } from "../uploadImage";

const ImageUpload = ({ setImageUrl }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const url = await uploadImage(file);
    setImageUrl(url);
    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}
    </div>
  );
};

export default ImageUpload;