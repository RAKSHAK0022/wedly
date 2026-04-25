import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

function Interests() {
  const [requests, setRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = auth.currentUser;

  // 🔥 REAL-TIME FETCH (ONLY YOUR INTERESTS)
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "interests"),
      where("to", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, // ✅ important
          ...doc.data(),
        }));

        setRequests(data);
      },
      (error) => {
        console.error("Fetch error:", error);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  // 💖 ACCEPT
  const handleAccept = async (item) => {
    if (!currentUser || isProcessing) return;

    try {
      setIsProcessing(true);

      // 🔥 UNIQUE MATCH ID (FIXED)
      const matchId = [currentUser.uid, item.from].sort().join("_");

      await setDoc(doc(db, "matches", matchId), {
        users: [currentUser.uid, item.from],
        createdAt: serverTimestamp(),
      });

      // ❌ delete interest
      await deleteDoc(doc(db, "interests", item.id));

      alert("Match Created 💖");
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ❌ REJECT
  const handleReject = async (item) => {
    if (!currentUser || isProcessing) return;

    try {
      setIsProcessing(true);

      await deleteDoc(doc(db, "interests", item.id));

      alert("Rejected ❌");
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        💖 Received Interests
      </h1>

      {requests.length === 0 ? (
        <p>No interests yet</p>
      ) : (
        requests.map((item) => (
          <div
            key={item.id}
            className="border p-4 mb-3 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-600">
              From User ID: {item.from}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleAccept(item)}
                disabled={isProcessing}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => handleReject(item)}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Interests;