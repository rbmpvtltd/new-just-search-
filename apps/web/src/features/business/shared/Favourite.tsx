"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { IoMdHeart } from "react-icons/io";

function Favourite({businessId,initialFav}:{businessId:number,initialFav:boolean}) {
  const trpc = useTRPC();

  const [isFavourite, setIsFavourite] = useState<boolean>(initialFav);

  const mutation = useMutation(
    trpc.businessrouter.toggleFavourite.mutationOptions({
      onSuccess: (data) => {
        setIsFavourite(data.status === "added");
      },
      onError: (err) => {
        setIsFavourite((prev) => !prev);
        console.error("Error toggling favourite:", err.message);
      },
    }),
  );

  const handleToggle = () => {
    setIsFavourite((prev) => !prev);
  };

  const handleClick = () => {
    mutation.mutate({businessId});
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        <IoMdHeart
          onClick={handleToggle}
          className={`text-2xl ${isFavourite ? "text-red-600" : "text-gray-500"}`}
        />
      </button>
    </div>
  );
}

export default Favourite;
