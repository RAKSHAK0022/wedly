import TinderCard from "react-tinder-card";
import { useState } from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";




function SwipeCards({ users }) {

    const [lastDirection, setLastDirection] = useState("");
  const [matchUser, setMatchUser] = useState(null); // ✅ HERE

  

  const swiped = async (direction, userId) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  if (direction === "right") {
    try {
      const currentUserRef = doc(db, "users", currentUser.uid);

      // Save like
      await updateDoc(currentUserRef, {
         likes: arrayUnion(userId),
           });

      console.log("Liked:", userId);

      // 🔥 CHECK IF MATCH
      const likedUserSnap = await getDoc(doc(db, "users", userId));
      const likedUserData = likedUserSnap.data() || {};

      if (likedUserData?.likes?.includes(currentUser.uid)) {
  setMatchUser({
    name: likedUserData.name,
    photo: likedUserData.photo,
  });
}

    } catch (err) {
      console.error("Error:", err);
    }
  }

  setLastDirection(direction);
};

  // ❌ remove yourself from list
  const currentUser = auth.currentUser;
  const filteredUsers = users.filter(
    (user) => user.id !== currentUser?.uid
  );

  return (
    <div className="flex flex-col items-center mt-10">

      <div className="relative w-80 h-96">
        {filteredUsers.map((user) => (
          <TinderCard
            key={user.id}
            onSwipe={(dir) => swiped(dir, user.id)}
            preventSwipe={["up", "down"]}
          >
            <div className="absolute bg-white w-80 h-96 rounded-2xl shadow-lg overflow-hidden">

              <img
                src={user.photo || "https://via.placeholder.com/300"}
                alt=""
                className="w-full h-64 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold">
                  {user.name}, {user.age}
                </h2>
                <p className="text-gray-600">{user.city}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {user.profession}
                </p>
              </div>

            </div>
          </TinderCard>
        ))}
      </div>

      {lastDirection && (
        <h2 className="mt-4 text-lg">
          You swiped {lastDirection}
        </h2>
      )}





     {matchUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 text-center shadow-xl w-80 animate-pop">

      <h2 className="text-2xl font-bold text-pink-600">
        💖 It's a Match!
      </h2>

      <p className="mt-2 text-gray-600">
        You and {matchUser.name} liked each other
      </p>

      <img
        src={matchUser.photo || "https://via.placeholder.com/150"}
        alt=""
        className="w-24 h-24 rounded-full mx-auto mt-4 object-cover"
      />

      <button
        onClick={() => setMatchUser(null)}
        className="mt-6 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
      >
        Continue
      </button>

    </div>

  </div>
)}

    </div>
  );
}

export default SwipeCards;