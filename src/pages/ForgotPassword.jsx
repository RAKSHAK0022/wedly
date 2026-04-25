import { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent ✅");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">

        <h2 className="text-xl font-bold mb-4 text-pink-600">
          Reset Password 🔑
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
        >
          Send Reset Link
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;