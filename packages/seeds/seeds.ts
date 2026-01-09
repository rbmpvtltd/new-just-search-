import { logger } from "@repo/logger";
import { seedRequestAccounts } from "./account_delete_request.seed";
import { algoliaSeed } from "./algolia.seed";
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

export const clouadinaryFake = false;
export const dummyImageUrl = "dummyImageUrl";
export const customName = `Banner/cbycmehjeetyxbuxc6ie`;

(async () => {
  try {
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
    await productSeed();
    logger.info("Complete", {
      message: "productSeed",
    });
    await offerSeed();
    logger.info("Complete", {
      message: "offerseed",
    });
    await hireSeed();
    logger.info("Complete", {
      message: "hireseed",
    });
    await feedbackseed();
    logger.info("Complete", {
      message: "feedbackseed",
    });
    await seedRequestAccounts();
    logger.info("Complete", {
      message: "seedRequestAccounts",
    });
    await planSeed();
    // await algoliaSeed();

    console.log("✅ All seeds inserted successfully");

    await Bun.$`notify-send -u normal "Seeding Complete" "Please check your seeds"`;
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    await Bun.$`notify-send -u critical "Seeding Failed" "Please check your seeds"`;
    process.exit(1);
  } finally {
  }
})();
