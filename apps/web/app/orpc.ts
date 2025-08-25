import { trpc } from "utils/trpc";

trpc.authRouter.checkUserPassword
  .query({
    email: "hackritik000@gmail.com",
    password: "12345678",
  })
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error("something worng", error);
  })
  .finally(() => {
    console.log("atleast finally work");
  });
