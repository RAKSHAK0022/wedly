import { useState } from "react";
import { uploadImage } from "../uploadImage";

/**
 * ImageUpload Component
 * مسؤول: Handles selecting and uploading an image file
 * Props:
 * - setImageUrl: function to store uploaded image URL in parent
 */
const ImageUpload = ({ setImageUrl }) => {
  // State to track loading status
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles file selection and upload process
   */
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];

    // If no file selected, stop execution
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      // Upload file and get URL
      const uploadedUrl = await uploadImage(selectedFile);

      // Pass URL back to parent component
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />

      {/* Upload Status */}
      {isUploading && (
        <p className="text-sm text-gray-500">Uploading image...</p>
      )}
    </div>
  );
};

export default ImageUpload;