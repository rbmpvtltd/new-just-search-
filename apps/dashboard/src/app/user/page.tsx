import { trpc } from "@/utils/trpc";

export default async function user() {
  const userId = await trpc.auth.logout.query();

  if (userId) {
    return <div>user id {userId}</div>;
  }

  return <div>not login</div>;
}
