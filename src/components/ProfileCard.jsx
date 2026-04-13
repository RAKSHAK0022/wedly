import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function ProfileCard({ user }) {
  const navigate = useNavigate();

  // 🔥 SEND INTEREST FUNCTION
  const handleInterest = async (e) => {
    e.stopPropagation(); // 🚫 prevent card click

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Login first!");
      return;
    }

    try {
      await setDoc(doc(db, "interests", currentUser.uid + "_" + user.id), {
        from: currentUser.uid,
        to: user.id,
      });

      alert("Interest Sent 💖");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/profile/${user.id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden w-72 hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
    >
      {/* Image */}
     <img
  src={user.image || "https://via.placeholder.com/300"}
  alt={user.name}
  className="w-full h-60 object-cover"
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/300";
  }}
/>

      {/* Details */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">
          {user.name}, {user.age}
        </h2>

        {/* 🔥 FIX: city instead of location */}
        <p className="text-gray-600 mt-1">📍 {user.city}</p>

        <p className="text-gray-600">💼 {user.profession}</p>

        <p className="text-gray-600">💰 ₹{user.salary}</p>

<p className="text-xs text-white bg-blue-500 inline-block px-2 py-1 rounded mt-1">
  {user.gender}
</p>

        <p className="mt-2 text-pink-600 font-semibold">
          🔥 {user.match}% Match
        </p>

        {/* 🔥 BUTTON FIX */}
        <button
          onClick={handleInterest}
          className="mt-4 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
        >
          ❤️ Send Interest
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;