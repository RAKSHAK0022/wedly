import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setIsLoading(true);

      // 🔐 Sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔍 Check profile
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        navigate("/create-profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Better error messages
      if (err.code === "auth/user-not-found") {
        alert("User not found");
      } else if (err.code === "auth/wrong-password") {
        alert("Wrong password");
      } else {
        alert("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-pink-50">

      <h1 className="text-3xl font-bold text-pink-600">
        Welcome Back 💖
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

          <p className="text-sm text-pink-600 cursor-pointer mt-2">
             <a href="/forgot-password">Forgot Password?</a>
          </p>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`px-6 py-2 rounded text-white ${
            isLoading
              ? "bg-gray-400"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}

export default Login;