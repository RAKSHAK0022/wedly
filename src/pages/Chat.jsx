import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

function Chat() {
  const { id } = useParams(); // other user
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const currentUser = auth.currentUser;

  // 🔥 Create unique chatId (IMPORTANT FIX)
  const chatId =
    currentUser && id
      ? [currentUser.uid, id].sort().join("_")
      : null;

  // 🔥 REAL-TIME LISTENER (ONLY THIS CHAT)
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(msgs);
    });

    return unsubscribe;
  }, [chatId]);

  // 🔥 SEND MESSAGE
  const handleSend = async () => {
    if (!message.trim() || !chatId) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        sender: currentUser.uid,
        receiver: id,
        text: message,
        timestamp: serverTimestamp(), // ✅ better than new Date()
      });

      setMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col">

      {/* HEADER */}
      <div className="bg-pink-600 text-white p-4">
        💬 Chat with {id}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg w-fit max-w-[70%] ${
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
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;