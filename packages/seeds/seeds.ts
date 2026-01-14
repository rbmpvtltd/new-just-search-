import { logger } from "@repo/logger";
// import dotenv from "dotenv";
import { seedRequestAccounts } from "./account_delete_request.seed";
import { algoliaSeed } from "./algolia.seed";
// import { algoliaSeed } from "./algolia.seed";
import { businessSeed } from "./business.seed";
import { fakeSeed } from "./fake.seed";
import { feedbackseed } from "./feedback.seed";
import { hireSeed } from "./hires.seeds";
import { notRelated } from "./notrelated.seed";
import { offerSeed } from "./offer.seed";
import { planSeed } from "./plan.seed";
import { productSeed } from "./product.seed";
// import { seedRequestAccounts } from "./requestacount.seed";
import { userSeed } from "./user.seed";

export const cloudinaryUploadOnline = true;
export const dummyImageUrl = "dummyImageUrl";
export const customName = `banner/cbycmehjeetyxbuxc6ie`;

// dotenv.config();

(async () => {
  try {
    console.log(process.env);
    // Postgres seeding
    // await notRelated();
    // logger.info("Complete", {
    //   message: "notRelated",
    // });
    // await userSeed();
    // logger.info("Complete", {
    //   message: "userseed",
    // });
    // await fakeSeed();
    // logger.info("Complete", {
    //   message: "fakeSeed",
    // });
    // await businessSeed();
    // logger.info("Complete", {
    //   message: "business",
    // });
    // process.exit();
    await productSeed();
    logger.info("Complete", {
      message: "productSeed",
    });
    // await offerSeed();
    // logger.info("Complete", {
    //   message: "offerseed",
    // });
    // await hireSeed();
    // logger.info("Complete", {
    //   message: "hireseed",
    // });
    // await feedbackseed();
    // logger.info("Complete", {
    //   message: "feedbackseed",
    // });
    // await seedRequestAccounts();
    // logger.info("Complete", {
    //   message: "seedRequestAccounts",
    // });
    // await planSeed();
    // await algoliaSeed();
    console.log("✅ All seeds inserted successfully");
    // Bun.$`notify-send -u normal "Seed Complete" "Please check your complete"`;
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
  // TODO: uncommit this on live server
  // Bun.serve({
  //   port: 4001,
  //   fetch() {
  //     return new Response("Hello from Bun!");
  //   },
  // });

  // Bun.$`notify-send -u normal "Seed Complete" "Please check your complete"`;
  // console.log("Server running on http://localhost:4001");
      process.exit(0);

})();
