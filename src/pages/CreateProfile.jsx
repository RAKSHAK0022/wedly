import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { uploadImage } from "../uploadImage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateProfile() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 🔥 FORM STATE (grouped → cleaner)
  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    profession: "",
    gender: "",
    salary: "",
    image: "",
  });

  const [file, setFile] = useState(null);

  // 🔐 LOAD USER DATA
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      setCurrentUser(user);

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setForm((prev) => ({
          ...prev,
          ...docSnap.data(),
        }));
      }
    });

    return unsubscribe;
  }, []);

  // 🧠 HANDLE INPUT CHANGE (single handler)
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 💾 HANDLE SAVE
  const handleSave = async () => {
    if (!currentUser || isSaving) return;

    const { name, age, city, image } = form;

    if (!name || !city || !age) {
      alert("Please fill required fields");
      return;
    }

    try {
      setIsSaving(true);

      let imageUrl = image || "";

      // 📤 Upload new image if selected
      if (file) {
        const uploaded = await uploadImage(file);
        if (!uploaded) {
          alert("Image upload failed");
          return;
        }
        imageUrl = uploaded;
      }

      if (!imageUrl) {
        alert("Please upload image");
        return;
      }

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          ...form,
          age: Number(age),
          image: imageUrl,
          email: currentUser.email,
        },
        { merge: true }
      );

      alert("Profile Updated 🔥");

      navigate("/"); // ✅ removed reload (important fix)

    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
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
        ) : form.image ? (
          <img
            src={form.image}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        ) : null}

        <div className="flex flex-col gap-4">

          <input
            value={form.name}
            placeholder="Name"
            onChange={(e) => handleChange("name", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            value={form.age}
            placeholder="Age"
            type="number"
            onChange={(e) =>
              handleChange("age", e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border px-4 py-2 rounded-lg"
          />

          <input
            value={form.city}
            placeholder="City"
            onChange={(e) => handleChange("city", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            value={form.profession}
            placeholder="Profession"
            onChange={(e) => handleChange("profession", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <select
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            value={form.salary}
            placeholder="Salary (₹)"
            onChange={(e) => handleChange("salary", e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`py-2 rounded-lg text-white ${
              isSaving
                ? "bg-gray-400"
                : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default CreateProfile;