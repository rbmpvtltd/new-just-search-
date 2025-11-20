"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/trpc/query-client";

export default function UserDataComponent() {
  const queryClient = getQueryClient();

  // Fake API function
  const fetchUserData = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return random data to show changes on refetch
    return {
      id: Math.floor(Math.random() * 1000),
      name: `User ${Math.floor(Math.random() * 100)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
  };

  // useQuery with cache key
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data!</div>;

  return (
    <div>
      <h2>User Data:</h2>
      <p>
        <strong>ID:</strong> {data?.id}
      </p>
      <p>
        <strong>Name:</strong> {data?.name}
      </p>
      <p>
        <strong>Time:</strong> {data?.timestamp}
      </p>

      <Button type="button" onClick={() => refetch()}>
        Refetch Data
      </Button>

      <Button type="button" onClick={() => queryClient.invalidateQueries()}>
        Invalidate Cache
      </Button>
    </div>
  );
}
