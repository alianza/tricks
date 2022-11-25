import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import findAndSerializeMongoDoc from "../lib/util";
import Pet from "../models/Pet";
import FlatGroundTrick from "../models/FlatGroundTrick";
import { Model } from "mongoose";

export async function getServerSideProps() {
  await dbConnect();

  const pets = await findAndSerializeMongoDoc(Pet, Model.find, {});
  const flatGroundTricks = await findAndSerializeMongoDoc(FlatGroundTrick, Model.find, {});

  return { props: { pets, flatGroundTricks } };
}

const Index = ({ pets, flatGroundTricks }) => {
  console.log(`flatGroundTricks`, flatGroundTricks);
  return (
    <>
      <div id="pets" className="flex flex-wrap gap-2">
        {pets.map((pet) => (
          <div key={pet._id} className="relative max-w-xs rounded-3xl overflow-hidden group">
            <img className="object-cover w-full h-full" src={pet.image_url} />
            <h5 className="absolute p-4 bottom-0 text-light text-xl shadow-dark text-shadow transition-opacity group-hover:opacity-0">
              {pet.name}
            </h5>
            <div className="absolute p-8 top-0 left-0 bg-white/90 w-full h-full duration-300 transition-opacity opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
              <Link href="/[_id]" as={`/${pet._id}`}>
                <p className="font-bold text-xl hover:underline">{pet.name}</p>
              </Link>
            </div>
          </div>
        ))}
        {pets.map((pet) => (
          <div key={pet._id}>
            <div className="card">
              <img src={pet.image_url} />
              <h5 className="pet-name">{pet.name}</h5>
              <div className="main-content">
                <Link href="/[_id]" as={`/${pet._id}`}>
                  <p className="pet-name hover:underline">{pet.name}</p>
                </Link>
                <p className="owner">Owner: {pet.owner_name}</p>
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
                  <Link href="/[_id]" as={`/${pet._id}`}>
                    <button className="btn view">View</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="flat-ground-tricks" className="flex flex-wrap gap-2">
        {flatGroundTricks.map((flatGroundTrick) => (
          <div key={flatGroundTrick._id} className="relative w-80 h-96 rounded-3xl overflow-hidden group">
            <img className="object-cover w-full h-full" src={flatGroundTrick.image_url} />
            <h5 className="absolute p-4 bottom-0 text-light text-xl shadow-dark text-shadow transition-opacity group-hover:opacity-0">
              {flatGroundTrick.name}
            </h5>
            <div className="absolute p-8 top-0 left-0 bg-white/90 w-full h-full duration-300 transition-opacity opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
              <Link href="/[_id]" as={`/${flatGroundTrick._id}`}>
                <p className="font-bold text-xl hover:underline">{flatGroundTrick.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Index;
