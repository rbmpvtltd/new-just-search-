import { trpc } from "@/utils/trpc";

(async () => {
  // const hi = await trpc.hi.query();
  const token = await trpc.auth.login.query({
    email: "otherritik000@gmail.com",
    password: "12345678",
  });

  console.log(token);
})();
