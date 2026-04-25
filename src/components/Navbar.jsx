import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link } from "react-router-dom";

/**
 * Advanced Navbar Component
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fake notification count (replace with DB later)
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 md:px-10 py-4 bg-white shadow-md">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold text-pink-600">
          Wedly 💖
        </h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 font-medium text-gray-700">
          <NavLinks />
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          {currentUser && (
            <div className="relative">
              <span className="text-xl">💬</span>

              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications}
                </span>
              )}
            </div>
          )}

          {/* Avatar */}
          {currentUser && (
            <img
              src={currentUser.photoURL || "https://via.placeholder.com/40"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
            />
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <AuthSection user={currentUser} onLogout={handleLogout} />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 bg-white shadow-lg">

          <NavLinks onClick={() => setIsMenuOpen(false)} />

          {currentUser && (
            <>
              <img
                src={currentUser.photoURL || "https://via.placeholder.com/80"}
                alt="profile"
                className="w-16 h-16 rounded-full border-2 border-pink-500"
              />
              <p className="text-sm text-gray-600">{currentUser.email}</p>
            </>
          )}

          <AuthSection
            user={currentUser}
            onLogout={handleLogout}
            isMobile
          />
        </div>
      )}
    </>
  );
}

/**
 * Navigation Links
 */
const NavLinks = ({ onClick }) => (
  <>
    <Link to="/" onClick={onClick} className="hover:text-pink-600">Home</Link>
    <Link to="/matches" onClick={onClick} className="hover:text-pink-600">Matches</Link>
    <Link to="/interests" onClick={onClick} className="hover:text-pink-600">Interests</Link>
  </>
);

/**
 * Auth Section
 */
const AuthSection = ({ user, onLogout, isMobile = false }) => {
  if (user) {
    return (
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Logout
      </button>
    );
  }

  return (
    <>
      <Link
        to="/login"
        className={`${isMobile ? "" : "hidden md:block"} text-pink-600 font-semibold`}
      >
        Login
      </Link>

      <Link
        to="/signup"
        className={`${isMobile ? "" : "hidden md:block"} bg-pink-600 text-white px-4 py-2 rounded-lg`}
      >
        Sign Up
      </Link>
    </>
  );
};

export default Navbar;