import Link from "next/link";
import ColoredButton from "../../util/coloredButton/coloredButton";
import { useRouter } from "next/router";
import { useState } from "react";
import { capitalize } from "../../../lib/util";

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
    <div key={pet._id} className="relative w-80 h-[28rem] rounded-3xl overflow-hidden group">
      <img
        alt={`Image of ${pet.name}`}
        className="object-cover w-full h-full"
        src={pet.image_url}
      />
      <h5 className="absolute p-4 bottom-0 text-neutral-50 text-xl shadow-neutral-900 text-shadow transition-opacity group-hover:opacity-0">
        {pet.name}
      </h5>

      <div className="absolute top-0 left-0 bg-white/90 w-full h-full duration-300 transition-opacity opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="p-6 pr-7 max-h-[24rem] overflow-y-auto overflow-x-hidden">
          <Link href="/[_id]" as={`/${pet._id}`}>
            <h1 className="font-bold text-2xl hover:underline">{pet.name}</h1>
          </Link>
          <p className="text-gray-600 text-xl">Owner: {pet.owner_name}</p>
          <p className="text-gray-600 text-md">Age: {getAge(pet.birthdate)}</p>
          <p className="text-gray-600 text-md">Species: {pet.species}</p>

          {[{ likes: pet.likes }, { dislikes: pet.dislikes }, { diet: pet.diet }].map(
            (item, index) => {
              const key = Object.keys(item)[0];
              return (
                <div className="mt-1 text-gray-700" key={index}>
                  <p className="font-bold">{capitalize(key)}</p>
                  <ul className="flex gap-1 pb-3 pt-1 overflow-auto scrollbar-thin scrollbar-thumb-neutral-400">
                    {item[key].map((data, index) => (
                      <li
                        className="bg-gray-300 inline-block px-1 rounded-md scroll-auto"
                        key={index}
                      >
                        {data}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
          )}
        </div>

        <div className="absolute flex gap-2 bottom-4 right-4">
          <Link href="/[_id]/edit" as={`/${pet._id}/edit`}>
            <ColoredButton
              className={"bg-green-500 hover:bg-green-600 focus:ring-green-600/50"}
              text="Edit"
            />
          </Link>
          {mode === "view" && (
            <Link href="/[_id]" as={`/${pet._id}`}>
              <ColoredButton
                className={"bg-blue-500 hover:bg-blue-600 focus:ring-blue-600/50"}
                text="View"
              />
            </Link>
          )}
          {mode === "delete" && (
            <div onClick={handleDelete}>
              <ColoredButton
                className={"bg-red-500 hover:bg-red-600 focus:ring-red-600/50"}
                text="Delete"
              />
            </div>
          )}
        </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
