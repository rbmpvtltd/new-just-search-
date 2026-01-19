"use client"
import { useRouter } from "next/navigation";
import { SearchBox, useSearchBox } from "react-instantsearch";

export function SearchBoxComponent() {
  const { query } = useSearchBox();
  const router = useRouter();
  return (
    <SearchBox
      placeholder="Search Businesses"
      onSubmit={() => {
        console.log("query value is ===>", query);
        router.push(`/searchedListings?query=${query}`);
      }}
      classNames={{
        root: "w-full mb-4",
        form: "flex items-center justify-between border border-black px-2 rounded",
        input: "flex-1 outline-none py-2 ",
        submit: "ml-2",
        reset: "ml-2",
      }}
    />
  );
}