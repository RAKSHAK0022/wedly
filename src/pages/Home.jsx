import ProfileCard from "../components/ProfileCard";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collection } from "firebase/firestore";

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
    <div className="bg-gradient-to-r from-pink-50 to-pink-100">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center h-[90vh] px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
          Find Your Perfect <span className="text-pink-600">Life Partner</span> 💖
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl text-lg">
          Wedly helps you discover meaningful connections.
        </p>

        <div className="mt-8 flex gap-4">
          <button
        onClick={() => navigate("/create-profile")}
           className="bg-pink-600 text-white px-6 py-3 rounded-lg"
            >
            Get Started
                </button>
          

          <button
  onClick={() =>
    document.getElementById("matches").scrollIntoView({ behavior: "smooth" })
  }
  className="border border-pink-600 text-pink-600 px-6 py-3 rounded-lg"
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
      <div
  id="matches"
  className="py-10 flex flex-wrap justify-center gap-8 px-6"
>
  {filteredUsers.map((user) => (
          <ProfileCard
            key={user.id}
            user={{ ...user, match: calculateMatch(user) }}
          />
        ))}
      </div>

    </div>
  );
}

export default Home;