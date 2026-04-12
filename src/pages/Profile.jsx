import { useParams } from "react-router-dom";
import users from "../data/users";

function Profile() {
  const { id } = useParams();

  const user = users.find((u) => u.id === parseInt(id));

  if (!user) return <h1>User not found</h1>;

  return (
    <div className="p-10 text-center">
      <img
        src={user.image}
        alt={user.name}
        className="w-40 h-40 mx-auto rounded-full"
      />

      <h1 className="text-3xl font-bold mt-4">
        {user.name}, {user.age}
      </h1>

      <p className="mt-2 text-gray-600">📍 {user.location}</p>
      <p className="text-gray-600">💼 {user.profession}</p>

      <button className="mt-6 bg-pink-600 text-white px-6 py-2 rounded-lg">
        ❤️ Send Interest
      </button>

      <button
  onClick={() => window.location.href = "/chat"}
  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
>
  💬 Start Chat
</button>
    </div>
  );
}

export default Profile;