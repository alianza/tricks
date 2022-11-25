import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
import Pet from "../../models/Pet";
import findAndSerializeMongoDoc from "../../lib/util";
import mongoose, { Model } from "mongoose";
import PetCard from "../../components/cards/pet/petCard";

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

  return <PetCard pet={pet} mode="delete" />;
};

export default PetPage;
