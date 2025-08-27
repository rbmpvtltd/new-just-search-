import { trpc } from "utils/trpc";

trpc.auth.checkUserPassword
  .query({
    email: "hackritik000@gmail.com",
    password: "12345678",
    name:'hit'
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
