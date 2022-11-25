import Link from "next/link";
import ColoredButton from "../../util/coloredButton/coloredButton";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PetCard({ pet, mode = "view" || "delete" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const getAge = (date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age === 1 ? `${age} year` : `${age} years`;
  };

  const handleDelete = async () => {
    console.log(`'delete'`, "delete");
    try {
      await fetch(`/api/pets/${router.query._id}`, { method: "Delete" });
      await router.push("/");
    } catch (error) {
      setMessage("Failed to delete the pet.");
    }
  };

  return (
    <div key={pet._id} className="relative w-[300px] h-[400px] rounded-3xl overflow-hidden group">
      <img alt={`Image of ${pet.name}`} className="object-cover w-full h-full" src={pet.image_url} />
      <h5 className="absolute p-4 bottom-0 text-light text-xl shadow-dark text-shadow transition-opacity group-hover:opacity-0">
        {pet.name}
      </h5>
      <div className="absolute p-8 top-0 left-0 bg-white/90 w-full h-full duration-300 transition-opacity opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
        <Link href="/[_id]" as={`/${pet._id}`}>
          <p className="font-bold text-2xl hover:underline">{pet.name}</p>
        </Link>
        <p className="text-accent-4 text-xl">Owner: {pet.owner_name}</p>
        <p className="text-accent-4 text-md">Age: {getAge(pet.birthdate)}</p>
        <p className="text-accent-4 text-md">Species: {pet.species}</p>

        {[pet.likes, pet.dislikes, pet.diet].map((item, index) => (
          <div className="mt-2 text-accent-7" key={index}>
            <p className="font-bold">Likes</p>
            <ul className="flex flex-wrap gap-1 p-2 pt-0">
              {item.map((data, index) => (
                <li className="bg-accent-3 inline-block px-1 rounded-md" key={index}>
                  {data}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="absolute flex gap-2 bottom-4 right-4">
          <Link href="/[_id]/edit" as={`/${pet._id}/edit`}>
            <ColoredButton className={"bg-green-500 hover:bg-green-600 focus:ring-green-600/50"} text="Edit" />
          </Link>
          {mode === "view" && (
            <Link href="/[_id]" as={`/${pet._id}`}>
              <ColoredButton className={"bg-blue-500 hover:bg-blue-600 focus:ring-blue-600/50"} text="View" />
            </Link>
          )}
          {mode === "delete" && (
            <div onClick={handleDelete}>
              <ColoredButton className={"bg-red-500 hover:bg-red-600 focus:ring-red-600/50"} text="Delete" />
            </div>
          )}
        </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
