import { trpc } from "utils/trpc";

(async () => {
  const hello = await trpc.authRouter.test;
  console.log(hello);
})();
// .then((data) => {
//   console.log(data);
// })
// .catch((error) => {
//   console.error("something worng", error);
// })
// .finally(() => {
//   console.log("atleast finally work");
// });
