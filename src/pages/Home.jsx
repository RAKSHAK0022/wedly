import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collection } from "firebase/firestore";
import SwipeCards from "../components/SwipeCards";

function Home() {
  const [users, setUsers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const navigate = useNavigate();

  // 🔥 FETCH USERS (REAL-TIME)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(userList);
      },
      (error) => {
        console.error("Fetch users error:", error);
      }
    );

    return unsubscribe;
  }, []);

  // 🧠 MEMOIZED FILTER (performance improvement)
  const filteredUsers = useMemo(() => {
    if (selectedCity === "All") return users;

    return users.filter(
      (user) =>
        user?.city &&
        user.city.toLowerCase() === selectedCity.toLowerCase()
    );
  }, [users, selectedCity]);

  // 📜 Scroll safely
  const scrollToMatches = () => {
    const section = document.getElementById("matches");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center min-h-screen px-4">

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Find Your Perfect{" "}
          <span className="text-pink-600">Life Partner</span> 💖
        </h1>

        <p className="mt-4 text-gray-600 max-w-xl">
          Wedly helps you discover meaningful connections.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">

          <button
            onClick={() => navigate("/create-profile")}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg shadow-md transition"
          >
            Get Started
          </button>

          <button
            onClick={scrollToMatches}
            className="w-full border border-pink-600 text-pink-600 py-3 rounded-lg hover:bg-pink-100 transition"
          >
            Browse Matches
          </button>

        </div>

        {/* WHY SECTION */}
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Why Choose Wedly?
          </h2>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <FeatureCard text="Verified Profiles" icon="✅" />
            <FeatureCard text="AI-Based Matching" icon="🤖" />
            <FeatureCard text="Secure Platform" icon="🔐" />
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex justify-center mt-6">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-6 py-3 border rounded-lg shadow text-center"
        >
          <option value="All">All Cities</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center mt-8">
        Matches For You 💖
      </h2>

      {/* SWIPE */}
      <div id="matches" className="mt-6">
        <SwipeCards users={filteredUsers} />
      </div>

    </div>
  );
}

/**
 * Small reusable component
 */
const FeatureCard = ({ text, icon }) => (
  <div className="bg-white px-6 py-4 rounded-xl shadow">
    {icon} {text}
  </div>
);

export default Home;