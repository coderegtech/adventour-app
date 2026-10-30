"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAllTouristSpots } from "../../../config/hooks";
import ShowItem from "../../../components/ShowItem";
import Loader from "../../../components/Loader";

export default function PlaceItemScreen() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetchAllTouristSpots().then(({ data }) => {
      if (!active) return;
      const found = data.find((row) => row.id === id);
      if (!found) setError("Destination not found.");
      else setItem(found);
    }).catch((error) => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [id]);
  if (error) return <p role="alert" className="p-4">{error}</p>;
  if (!item) return <Loader />;
  return <ShowItem data={item} close={() => router.back()} />;
}
