import TinderCard from "react-tinder-card";
import { useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

function SwipeCards({ users }) {
  const [lastDirection, setLastDirection] = useState("");
  const [matchUser, setMatchUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = auth.currentUser;

  // 🔥 HANDLE SWIPE
  const swiped = async (direction, userId) => {
    if (!currentUser || isProcessing) return;

    setIsProcessing(true);

    try {
      if (direction === "right") {
        const currentUserRef = doc(db, "users", currentUser.uid);

        // ✅ Save like (safe)
        await updateDoc(currentUserRef, {
          likes: arrayUnion(userId),
        });

        // 🔍 Check if other user liked back
        const likedUserRef = doc(db, "users", userId);
        const likedUserSnap = await getDoc(likedUserRef);
        const likedUserData = likedUserSnap.data() || {};

        if (likedUserData?.likes?.includes(currentUser.uid)) {
          // 💖 MATCH FOUND

          // 🔥 Create match document (NEW FEATURE - safe addition)
          const matchId = [currentUser.uid, userId].sort().join("_");

          await setDoc(doc(db, "matches", matchId), {
            users: [currentUser.uid, userId],
            createdAt: serverTimestamp(),
          });

          setMatchUser({
            name: likedUserData.name,
            image: likedUserData.image,
          });
        }
      }

      setLastDirection(direction);
    } catch (err) {
      console.error("Swipe error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ❌ Remove yourself safely
  const filteredUsers = users?.filter(
    (user) => user.id !== currentUser?.uid
  );

  return (
    <div className="flex flex-col items-center mt-10">

      {/* ================= SWIPE CARDS ================= */}
      <div className="relative w-80 h-[520px]">

        {filteredUsers?.map((user) => (
          <TinderCard
            key={user.id}
            onSwipe={(dir) => swiped(dir, user.id)}
            preventSwipe={["up", "down"]}
          >
            <div className="absolute w-80 h-[500px] rounded-3xl overflow-hidden shadow-2xl transition duration-300 hover:scale-[1.05]">

              {/* 👤 IMAGE */}
              <img
                src={
                  user.image?.replace(
                    "/upload/",
                    "/upload/q_auto:best,f_auto,dpr_auto/"
                  ) || "https://via.placeholder.com/400"
                }
                alt={user.name || "profile"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400";
                }}
              />

              {/* 🔥 OVERLAY INFO */}
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent text-white">
                <h2 className="text-2xl font-bold">
                  {user.name || "Unknown"}, {user.age || "-"}
                </h2>

                <p className="text-sm">{user.city || "Unknown"}</p>
                <p className="text-xs opacity-80">
                  {user.profession || ""}
                </p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      {/* ================= SWIPE TEXT ================= */}
      {lastDirection && (
        <h2 className="mt-4 text-lg">
          You swiped {lastDirection}
        </h2>
      )}

      {/* ================= MATCH POPUP ================= */}
      {matchUser && (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-300/40 via-rose-200/30 to-pink-400/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-6 text-center shadow-2xl w-80 animate-pop">

            <h2 className="text-2xl font-bold text-pink-600">
              💖 It's a Match!
            </h2>

            <p className="mt-2 text-gray-600">
              You and {matchUser.name} liked each other
            </p>

            {/* 🔥 IMAGE + EFFECT */}
            <div className="relative flex justify-center items-center mt-4">

              <div className="w-44 h-44 rounded-full border-4 border-pink-400 animate-spin absolute"></div>

              <img
                src={
                  matchUser.image?.replace(
                    "/upload/",
                    "/upload/q_auto:best,f_auto,dpr_auto/"
                  ) || "https://via.placeholder.com/300"
                }
                alt="profile"
                className="w-40 h-40 object-cover rounded-full z-10"
              />

            </div>

            {/* 🔘 BUTTON */}
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