import Link from "next/link";
import ColoredButton from "../../util/coloredButton/coloredButton";
import { useRouter } from "next/router";
import { useState } from "react";

export default function FlatgroundTrickCard({ flatgroundTrick: trick, mode = "view" || "delete" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      await fetch(`/api/flatgroundtricks/${router.query._id}`, {
        method: "Delete",
      });
      await router.push("/");
    } catch (error) {
      setMessage("Failed to delete the flatground trick.");
    }
  };

  return (
    <div key={trick._id} className="group relative h-[28rem] w-80 overflow-hidden rounded-3xl">
      <img
        alt={`Image of ${trick.name}`}
        className="h-full w-full object-cover"
        src={trick.image_url || "/placeholder.webp"}
      />
      <h5 className="text-shadow absolute bottom-0 p-4 text-2xl text-neutral-50 shadow-neutral-900 transition-opacity group-hover:opacity-0">
        {trick.name}
      </h5>

      <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="max-h-[24rem] overflow-y-auto p-6 pr-7 overflow-x-hidden scrollbar-thin scrollbar-thumb-neutral-400">
          <Link href={`/flatgroundtricks/${trick._id}`}>
            <h1 className="text-2xl font-bold text-neutral-900 hover:underline">{trick.name}</h1>
          </Link>
          <p className="text-xl text-gray-600">Stance: {trick.stance}</p>
          {trick.direction && <p className="text-md text-gray-600">Direction: {trick.direction}</p>}
          <p className="text-md mt-4 text-gray-600">{trick.description}</p>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href="/flatgroundtrick/[_id]/edit" as={`/flatgroundtrick/${trick._id}/edit`}>
            <ColoredButton
              className={"bg-green-500 focus:ring-green-600/50 hover:bg-green-600"}
              text="Edit"
            />
          </Link>
          {mode === "view" && (
            <Link href="/flatgroundtrick/[_id]" as={`/flatgroundtrick/${trick._id}`}>
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
