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
    <div key={pet._id} className="group relative h-[28rem] w-80 overflow-hidden rounded-3xl">
      <img
        alt={`Image of ${pet.name}`}
        className="h-full w-full object-cover"
        src={pet.image_url}
      />
      <h5 className="text-shadow absolute bottom-0 p-4 text-2xl text-neutral-50 shadow-neutral-900 transition-opacity group-hover:opacity-0">
        {pet.name}
      </h5>

      <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="max-h-[24rem] overflow-y-auto p-6 pr-7 overflow-x-hidden scrollbar-thin scrollbar-thumb-neutral-400">
          <Link href={`/pet/${pet._id}`}>
            <h1 className="text-2xl font-bold text-neutral-900 hover:underline">{pet.name}</h1>
          </Link>
          <p className="text-xl text-gray-600">Owner: {pet.owner_name}</p>
          <p className="text-md text-gray-600">Age: {getAge(pet.birthdate)}</p>
          <p className="text-md text-gray-600">Species: {pet.species}</p>

          {[{ likes: pet.likes }, { dislikes: pet.dislikes }, { diet: pet.diet }].map(
            (item, index) => {
              const key = Object.keys(item)[0];
              return (
                <div className="mt-1 text-gray-700" key={index}>
                  <p className="font-bold">{capitalize(key)}</p>
                  <ul className="flex gap-1 overflow-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-neutral-400">
                    {item[key].map((data, index) => (
                      <li
                        className="inline-block scroll-auto rounded-md bg-gray-300 px-1"
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

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href="/pet/[_id]/edit" as={`/pet/${pet._id}/edit`}>
            {" "}
            <ColoredButton
              className={"bg-green-500 focus:ring-green-600/50 hover:bg-green-600"}
              text="Edit"
            />
          </Link>
          {mode === "view" && (
            <Link href="/pet/[_id]" as={`/pet/${pet._id}`}>
              <ColoredButton
                className={"bg-blue-500 focus:ring-blue-600/50 hover:bg-blue-600"}
                text="View"
              />
            </Link>
          )}
          {mode === "delete" && (
            <div onClick={handleDelete}>
              <ColoredButton
                className={"bg-red-500 focus:ring-red-600/50 hover:bg-red-600"}
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
