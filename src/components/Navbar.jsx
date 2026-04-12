import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold text-pink-600">
        Wedly 💖
      </h1>

      {/* Links */}
      <ul className="flex gap-6 text-gray-700 font-medium">
       <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
       <li><Link to="/matches" className="hover:text-pink-600">Matches</Link></li>
       <li><Link to="/interests" className="hover:text-pink-600">Interests</Link></li>
      </ul>

      {/* Buttons */}
      <div className="flex gap-4 items-center">
  {user ? (
    <>
      <span className="text-gray-700">{user.email}</span>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <a href="/login" className="text-pink-600 font-semibold">
        Login
      </a>
      <a href="/signup" className="bg-pink-600 text-white px-4 py-2 rounded-lg">
        Sign Up
      </a>
    </>
  )}
</div>

    </nav>
  );
}

export default Navbar;