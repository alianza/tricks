import Link from "next/link";
import ColoredButton from "../../util/coloredButton/coloredButton";
import { useRouter } from "next/router";
import { useState } from "react";

export default function FlatGroundTrickCard({ flatGroundTrick, mode = "view" || "delete" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    console.log(`'delete'`, "delete");
    try {
      await fetch(`/api/flatGroundTricks/${router.query._id}`, {
        method: "Delete",
      });
      await router.push("/");
    } catch (error) {
      setMessage("Failed to delete the flatground trick.");
    }
  };

  return (
    <div
      key={flatGroundTrick._id}
      className="relative w-80 h-[28rem] rounded-3xl overflow-hidden group"
    >
      <img
        alt={`Image of ${flatGroundTrick.name}`}
        className="object-cover w-full h-full"
        src={flatGroundTrick.image_url || "/placeholder.webp"}
      />
      <h5 className="absolute p-4 bottom-0 text-neutral-100 text-xl shadow-neutral-500 text-shadow transition-opacity group-hover:opacity-0">
        {flatGroundTrick.name}
      </h5>
      <div className="absolute p-8 top-0 left-0 bg-white/90 w-full h-full duration-300 transition-opacity opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
        <Link href="/[_id]" as={`/${flatGroundTrick._id}`}>
          <p className="font-bold text-xl hover:underline">{flatGroundTrick.name}</p>
        </Link>
      </div>
    </div>
  );
}
