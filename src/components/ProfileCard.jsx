import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

function ProfileCard({ user }) {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  // 🔥 SEND INTEREST FUNCTION
  const handleInterest = async (e) => {
    e.stopPropagation(); // 🚫 prevent card click

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Login first!");
      return;
    }

    // Prevent duplicate clicks
    if (isSending) return;

    try {
      setIsSending(true);

      await setDoc(
        doc(db, "interests", `${currentUser.uid}_${user.id}`),
        {
          from: currentUser.uid,
          to: user.id,
          createdAt: serverTimestamp(), // ✅ added timestamp
        }
      );

      alert("Interest Sent 💖");
    } catch (err) {
      console.error("Error sending interest:", err);
      alert("Something went wrong!");
    } finally {
      setIsSending(false);
    }
  };

  // 🔒 Safe fallback values
  const {
    name = "Unknown",
    age = "-",
    city = "Not specified",
    profession = "Not specified",
    salary = "-",
    gender = "N/A",
    match = 0,
    image,
    id,
  } = user || {};

  return (
    <div
      onClick={() => navigate(`/profile/${id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden w-72 hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
    >
      {/* Image */}
      <img
        src={image || "https://via.placeholder.com/300"}
        alt={name}
        className="w-full h-60 object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300";
        }}
      />

      {/* Details */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">
          {name}, {age}
        </h2>

        <p className="text-gray-600 mt-1">📍 {city}</p>
        <p className="text-gray-600">💼 {profession}</p>
        <p className="text-gray-600">💰 ₹{salary}</p>

        <span className="text-xs text-white bg-blue-500 inline-block px-2 py-1 rounded mt-1">
          {gender}
        </span>

        <p className="mt-2 text-pink-600 font-semibold">
          🔥 {match}% Match
        </p>

        {/* Button */}
        <button
          onClick={handleInterest}
          disabled={isSending}
          className={`mt-4 w-full py-2 rounded-lg text-white transition ${
            isSending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isSending ? "Sending..." : "❤️ Send Interest"}
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;