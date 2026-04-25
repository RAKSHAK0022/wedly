import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // ✅ FIXED

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);

      await createUserWithEmailAndPassword(auth, email, password);

      alert("Account Created 🔥");

      navigate("/login"); // ✅ now works
    } catch (err) {
      console.error("Signup error:", err);

      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else {
        alert("Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-pink-50">

      <h1 className="text-3xl font-bold text-pink-600">
        Create Account 💖
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 w-80">

        <input
          type="email"
          placeholder="Email"
          className="border px-4 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={isLoading}
          className={`px-6 py-2 rounded text-white ${
            isLoading
              ? "bg-gray-400"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isLoading ? "Creating..." : "Signup"}
        </button>

      </div>
    </div>
  );
}

export default Signup;