import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Matches() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // 🔥 ONLY FETCH YOUR MATCHES (FIXED)
    const q = query(
      collection(db, "matches"),
      where("users", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const matchedUsers = [];

      for (const matchDoc of snapshot.docs) {
        const data = matchDoc.data();

        const otherUserId = data.users.find(
          (id) => id !== currentUser.uid
        );

        // 🔥 Fetch user profile
        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          matchedUsers.push({
            id: otherUserId,
            ...userSnap.data(),
          });
        }
      }

      setMatches(matchedUsers);
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        💖 Your Matches
      </h1>

      {matches.length === 0 ? (
        <p>No matches yet</p>
      ) : (
        matches.map((user) => (
          <div
            key={user.id}
            onClick={() => navigate(`/chat/${user.id}`)}
            className="border p-4 mb-3 flex gap-4 cursor-pointer hover:bg-gray-100 rounded-lg shadow-sm"
          >
            <img
              src={user.image || "https://via.placeholder.com/80"}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80";
              }}
            />

            <div>
              <p className="font-semibold">{user.name || "Unknown"}</p>
              <p className="text-sm text-gray-600">
                {user.city || ""}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Matches;