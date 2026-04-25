import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-50 p-6">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">

        {/* IMAGE */}
        <img
          src={user.image || "https://via.placeholder.com/200"}
          alt="profile"
          className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-pink-400"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200";
          }}
        />

        {/* NAME */}
        <h1 className="text-2xl font-bold mt-4">
          {user.name || "Unknown"}, {user.age || "-"}
        </h1>

        {/* DETAILS */}
        <p className="text-gray-600 mt-2">
          📍 {user.city || "Not specified"}
        </p>

        <p className="text-gray-600">
          💼 {user.profession || "Not specified"}
        </p>

        {user.salary && (
          <p className="text-gray-600">
            💰 ₹{user.salary}
          </p>
        )}

        {user.gender && (
          <span className="inline-block mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded">
            {user.gender}
          </span>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-3 justify-center">

          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            💬 Chat
          </button>

          <button
            onClick={() => navigate(-1)}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Back
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;