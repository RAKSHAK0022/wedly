import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function Matches() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchMatches = async () => {
    const currentUser = auth.currentUser;

    const snapshot = await getDocs(collection(db, "matches"));

    const matchedUsers = [];

    for (const matchDoc of snapshot.docs) {
      const data = matchDoc.data();

      if (data.users.includes(currentUser.uid)) {
        const otherUserId = data.users.find(
          (id) => id !== currentUser.uid
        );

        // 🔥 fetch full user profile
        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          matchedUsers.push({
            id: otherUserId,
            ...userSnap.data(),
          });
        }
      }
    }

    setMatches(matchedUsers);
  };

  fetchMatches();
}, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💖 Your Matches</h1>

      {matches.length === 0 ? (
        <p>No matches yet</p>
      ) : (
        matches.map((match, index) => {
          const otherUser = match.users.find(
            (id) => id !== auth.currentUser.uid
          );

          return (
            <div
              key={index}
              className="border p-4 mb-3 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/chat/${otherUser}`)}
            >
              {matches.map((user, index) => (
  <div
    key={index}
    onClick={() => navigate(`/chat/${user.id}`)}
    className="border p-4 mb-3 flex gap-4 cursor-pointer"
  >
    <img src={user.image} className="w-16 h-16 rounded-full" />

    <div>
      <p>{user.name}</p>
      <p>{user.city}</p>
    </div>
  </div>
))}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Matches;