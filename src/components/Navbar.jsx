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
  <nav className="flex justify-between items-center px-4 md:px-10 py-4 shadow-md bg-white">

    {/* Logo */}
    <h1 className="text-xl md:text-2xl font-bold text-pink-600 whitespace-nowrap">
      Wedly 💖
    </h1>

    {/* Links */}
    <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
      <li>
        <Link to="/" className="hover:text-pink-600">Home</Link>
      </li>
      <li>
        <Link to="/matches" className="hover:text-pink-600">Matches</Link>
      </li>
      <li>
        <Link to="/interests" className="hover:text-pink-600">Interests</Link>
      </li>
    </ul>

    {/* Buttons */}
    <div className="flex items-center gap-3 md:gap-6">

      {user ? (
        <>
          {/* Hide email on small screens */}
          <span className="hidden md:block text-gray-700 text-sm">
            {user.email}
          </span>

          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="text-pink-600 font-semibold text-sm md:text-base"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-pink-600 hover:bg-pink-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition"
          >
            Sign Up
          </Link>
        </>
      )}

    </div>
  </nav>
);
}

export default Navbar;