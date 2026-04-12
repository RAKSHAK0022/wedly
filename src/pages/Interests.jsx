import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc, setDoc } from "firebase/firestore";

function Interests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      const currentUser = auth.currentUser;

      const snapshot = await getDocs(collection(db, "interests"));

      const data = snapshot.docs
        .map((doc) => doc.data())
        .filter((item) => item.to === currentUser.uid);

      setRequests(data);
    };

    fetchInterests();
  }, []);
  
   const handleAccept = async (item) => {
  const currentUser = auth.currentUser;

  try {
    // 🔥 create match
    await setDoc(doc(db, "matches", currentUser.uid + "_" + item.from), {
      users: [currentUser.uid, item.from],
    });

    // 🔥 delete interest
    await deleteDoc(doc(db, "interests", item.from + "_" + currentUser.uid));

    alert("Match Created 💖");

    // 🔥 update UI
    setRequests((prev) => prev.filter((r) => r.from !== item.from));
  } catch (err) {
    console.error(err);
  }
};

const handleReject = async (item) => {
  const currentUser = auth.currentUser;

  try {
    await deleteDoc(doc(db, "interests", item.from + "_" + currentUser.uid));

    alert("Rejected ❌");

    // 🔥 update UI
    setRequests((prev) => prev.filter((r) => r.from !== item.from));
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💖 Received Interests</h1>

      {requests.length === 0 ? (
        <p>No interests yet</p>
      ) : (
        requests.map((item, index) => (
          <div key={index} className="border p-4 mb-3 rounded">
            <p>From User ID: {item.from}</p>

            <div className="mt-2 flex gap-2">
              <button
  onClick={() => handleAccept(item)}
  className="bg-green-500 text-white px-4 py-1 rounded"
>
  Accept
</button>

<button
  onClick={() => handleReject(item)}
  className="bg-red-500 text-white px-4 py-1 rounded"
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