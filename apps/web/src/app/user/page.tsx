import { trpcServer } from "@/trpc/trpc-server";

export default async function user() {
  const userId = await trpcServer.auth.logout.query();

  if (userId) {
    return <div>user id {userId}</div>;
  }

  return <div>not login</div>;
}
