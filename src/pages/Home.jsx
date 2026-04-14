import ProfileCard from "../components/ProfileCard";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collection } from "firebase/firestore";
import SwipeCards from "../components/SwipeCards";

function Home() {
  const [users, setUsers] = useState([]); // 🔥 real users
  const [selectedCity, setSelectedCity] = useState("All");
  const navigate = useNavigate();

  // 🔥 FETCH DATA FROM FIREBASE
 

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
    const userList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUsers(userList);
  });

  return () => unsubscribe();
}, []);

  // 🔥 FILTER
  const filteredUsers =
    selectedCity === "All"
      ? users
      : users.filter((user) => user.city === selectedCity); // 🔥 city not location

  // 🔥 MATCH LOGIC
  const calculateMatch = (user) => {
    let score = 50;

    if (user.city === selectedCity) score += 20;
    if (user.profession?.includes("Engineer")) score += 10;
    if (user.age >= 24 && user.age <= 28) score += 20;

    return score;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center min-h-screen px-4 md:px-10">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
          Find Your Perfect <span className="text-pink-600">Life Partner</span> 💖
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl text-lg">
          Wedly helps you discover meaningful connections.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap justify-center">

          <div className="text-center py-10">
  <h2 className="text-3xl font-bold mb-6">Why Choose Wedly?</h2>

  <div className="flex flex-col md:flex-row justify-center gap-6 text-lg">
    <div className="bg-white px-6 py-4 rounded-xl shadow">
      ✅ Verified Profiles
    </div>

    <div className="bg-white px-6 py-4 rounded-xl shadow">
      🤖 AI-Based Matching
    </div>

    <div className="bg-white px-6 py-4 rounded-xl shadow">
      🔐 Secure Platform
    </div>
  </div>
</div>

  <button
    onClick={() => navigate("/create-profile")}
    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
  >
    Get Started
  </button>

  <button
    onClick={() =>
      document.getElementById("matches").scrollIntoView({ behavior: "smooth" })
    }
    className="border border-pink-600 text-pink-600 px-6 py-3 rounded-lg hover:bg-pink-100 transition transform hover:scale-105"
  >
    Browse Matches
  </button>

</div>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 justify-center mb-6">
        <select
          className="px-4 py-2 border rounded-lg"
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="All">All Cities</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center mt-10">
        Matches For You 💖
      </h2>

      {/* CARDS */}
      <div id="matches">
  <SwipeCards users={filteredUsers} />
</div>

    </div>
  );
}

export default Home;