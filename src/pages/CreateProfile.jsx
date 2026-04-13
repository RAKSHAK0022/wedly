
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateProfile() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [profession, setProfession] = useState("");
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("");
  const [salary, setSalary] = useState("");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    setCurrentUser(user);

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      setName(data.name || "");
      setAge(data.age || "");
      setCity(data.city || "");
      setProfession(data.profession || "");
      setGender(data.gender || "");
      setSalary(data.salary || "");
      setImage(data.image || "");
    }
  });

  return () => unsubscribe();
}, []);
//HANDLE SAVE 

const handleSave = async () => {
  try {
    console.log("Button clicked");

    const user = currentUser;

if (!user) {
  console.log("User is null ❌");
  alert("User not loaded yet, wait 1 sec and try again");
  return;
}

    let imageUrl = image;

    // upload image if new selected
    // upload image safely
if (file) {
  const storageRef = ref(storage, `profiles/${user.uid}`);

  uploadBytes(storageRef, file)
    .then(() => getDownloadURL(storageRef))
    .then((url) => {
      console.log("Image uploaded later:", url);

      // 🔥 update image AFTER profile saved
      setDoc(doc(db, "users", user.uid), {
        image: url,
      }, { merge: true });
    })
    .catch((err) => {
      console.error("Image upload failed:", err);
    });
}

    await setDoc(
      doc(db, "users", user.uid),
      {
        name,
        age,
        city,
        profession,
        gender,
        salary,
        image: imageUrl,
        email: user.email,
      },
      { merge: true }
    );

    alert("Profile Updated 🔥");
    navigate("/");

  } catch (err) {
    console.error(err);
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
    {file ? (
  <img
    src={URL.createObjectURL(file)}
    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
  />
) : image ? (
  <img
    src={image}
    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
  />
) : null}

    {/* INPUTS */}
    <div className="flex flex-col gap-4">

        <input
        value={name}
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
        value={age}
        placeholder="Age"
        type="number"
        onChange={(e) =>
  setAge(e.target.value === "" ? "" : Number(e.target.value))
}
        className="border px-4 py-2 rounded-lg"
      />

      <input
        value={city}
        placeholder="City"
        onChange={(e) => setCity(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      />

      <input
        value={profession}
        placeholder="Profession"
        onChange={(e) => setProfession(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      />

      
      <select
      value={gender}
          onChange={(e) => setGender(e.target.value)}
          >

        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input
        value={salary}
  placeholder="Salary (₹)"
  onChange={(e) => setSalary(e.target.value)}
  className="border px-4 py-2 rounded-lg"
/>

      <button
      type="button"
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