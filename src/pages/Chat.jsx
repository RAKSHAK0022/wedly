import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";

function Chat() {
  const { id } = useParams(); // other user
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const currentUser = auth.currentUser;

  // 🔥 REAL-TIME LISTENER
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());

      const filtered = msgs.filter(
        (m) =>
          (m.sender === currentUser.uid && m.receiver === id) ||
          (m.sender === id && m.receiver === currentUser.uid)
      );

      setMessages(filtered);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 SEND MESSAGE
  const handleSend = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      sender: currentUser.uid,
      receiver: id,
      text: message,
      timestamp: new Date(),
    });

    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col">

      {/* HEADER */}
      <div className="bg-pink-600 text-white p-4">
        💬 Chat with {id}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg w-fit ${
              msg.sender === currentUser.uid
                ? "bg-pink-500 text-white ml-auto"
                : "bg-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-4 flex gap-2 border-t">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Type message..."
        />

        <button
          onClick={handleSend}
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;