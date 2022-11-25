import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
import Pet from "../../models/Pet";
import findAndSerializeMongoDoc from "../../lib/util";
import mongoose, { Model } from "mongoose";

export async function getServerSideProps({ params: { _id } }) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { props: { error: "Not a valid pet id" } };
  }

  const pet = await findAndSerializeMongoDoc(Pet, Model.findById, { _id });

  if (!pet) {
    return { notFound: true };
  }

  return { props: { pet } };
}

/* Allows you to view pet card info and delete pet card*/
const PetPage = ({ pet, error }) => {
  const router = useRouter();
  const [message, setMessage] = useState("" || error);

  const handleDelete = async () => {
    try {
      await fetch(`/api/pets/${router.query._id}`, { method: "Delete" });
      await router.push("/");
    } catch (error) {
      setMessage("Failed to delete the pet.");
    }
  };

  if (error) {
    return <h1 className="text-xl">{error}</h1>;
  }

  return (
    <div key={pet._id}>
      <div className="card">
        <img src={pet.image_url} />
        <h5 className="pet-name">{pet.name}</h5>
        <div className="main-content">
          <p className="pet-name">{pet.name}</p>
          <p className="owner">Owner: {pet.owner_name}</p>

          {/* Extra Pet Info: Likes and Dislikes */}
          <div className="likes info">
            <p className="label">Likes</p>
            <ul>
              {pet.likes.map((data, index) => (
                <li key={index}>{data} </li>
              ))}
            </ul>
          </div>
          <div className="dislikes info">
            <p className="label">Dislikes</p>
            <ul>
              {pet.dislikes.map((data, index) => (
                <li key={index}>{data} </li>
              ))}
            </ul>
          </div>

          <div className="btn-container">
            <Link href="/[_id]/edit" as={`/${pet._id}/edit`}>
              <button className="btn edit">Edit</button>
            </Link>
            <button className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PetPage;
