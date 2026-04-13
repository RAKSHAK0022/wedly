import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <h1>Loading...</h1>;

  return (
    <div className="p-10 text-center">
      <img
        src={user.image}
        className="w-40 h-40 mx-auto rounded-full"
      />

      <h1>{user.name}, {user.age}</h1>
      <p>{user.city}</p>
      <p>{user.profession}</p>
    </div>
  );
}

export default Profile;