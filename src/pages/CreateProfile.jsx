import { useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function CreateProfile() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [profession, setProfession] = useState("");
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("");
  const [salary, setSalary] = useState("");
  

const handleSave = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    let imageUrl = image; // keep old image

    // 🔥 upload image to Firebase
    if (file) {
  const storageRef = ref(storage, `profiles/${user.uid}`);
  await uploadBytes(storageRef, file);
  imageUrl = await getDownloadURL(storageRef);
}

    await setDoc(
  doc(db, "users", user.uid),
  {
    name,
    age,
    city,
    profession,
    gender,
    salary, // ✅ ADD THIS
    image: imageUrl,
    email: user.email,
  },
  { merge: true } // 🔥 VERY IMPORTANT
);

    alert("Profile Saved 🔥");
window.location.href = "/";

  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-6">

  <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

    <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">
      Create Your Profile 💖
    </h1>

    {/* IMAGE PREVIEW */}
    {file && (
  <img
    src={URL.createObjectURL(file)}
    alt="preview"
    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
  />
)}

    {/* INPUTS */}
    <div className="flex flex-col gap-4">

        <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      />


      <input
   type="file"
   onChange={(e) => setFile(e.target.files[0])}
   className="border px-4 py-2 rounded-lg"
      />

      <input
        placeholder="Age"
        type="number"
        onChange={(e) => setAge(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      />

      <input
        placeholder="City"
        onChange={(e) => setCity(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      />

      <input
        placeholder="Profession"
        onChange={(e) => setProfession(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      />

      
      <select
        onChange={(e) => setGender(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input
  placeholder="Salary (₹)"
  onChange={(e) => setSalary(e.target.value)}
  className="border px-4 py-2 rounded-lg"
/>

      <button
        onClick={handleSave}
        className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
      >
        Save Profile
      </button>

    </div>

  </div>

</div>
  );
}

export default CreateProfile;