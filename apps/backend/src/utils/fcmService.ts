import {
  Expo,
  type ExpoPushMessage,
  type ExpoPushTicket,
  type ExpoPushReceipt,
} from "expo-server-sdk";

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true, // Use FCM V1 API (recommended)
});

export interface SendNotificationParams {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: "default" | null;
  badge?: number;
  channelId?: string;
  priority?: "default" | "normal" | "high";
}

export const sendPushNotifications = async ({
  tokens,
  title,
  body,
  data = {},
  sound = "default",
  badge,
  channelId,
  priority = "high",
}: SendNotificationParams) => {
  if (tokens.length === 0) {
    console.log("No tokens to send notifications to");
    return { success: 0, failure: 0, invalidTokens: [] };
  }

  console.log(`Sending notifications to ${tokens.length} Expo push tokens...`);

  try {
    const messages: ExpoPushMessage[] = [];
    const invalidTokens: string[] = [];

    for (const pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        invalidTokens.push(pushToken);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: sound,
        title: title,
        body: body,
        data: data,
        ...(badge !== undefined && { badge }),
        ...(channelId && { channelId }),
        priority: priority,
      });
    }

    console.log(
      `Prepared ${messages.length} valid messages (${invalidTokens.length} invalid tokens filtered)`,
    );

    if (messages.length === 0) {
      return {
        success: 0,
        failure: tokens.length,
        invalidTokens,
      };
    }

    const chunks = expo.chunkPushNotifications(messages);
    console.log(`Split into ${chunks.length} chunks for sending`);

    let totalSuccess = 0;
    let totalFailure = 0;
    const tickets: ExpoPushTicket[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(
        `Sending chunk ${i + 1}/${chunks.length} with ${chunk?.length} messages...`,
      );

      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk ?? []);
        tickets.push(...ticketChunk);

        ticketChunk.forEach((ticket, idx) => {
          if (ticket.status === "ok") {
            totalSuccess++;
          } else if (ticket.status === "error") {
            totalFailure++;
            console.error(`Error sending notification:`, ticket.message);

            if (
              ticket.details?.error === "DeviceNotRegistered" ||
              ticket.message?.includes("not registered") ||
              ticket.message?.includes("InvalidCredentials")
            ) {
              const failedToken = chunk?.[idx]?.to;
              if (failedToken && typeof failedToken === "string") {
                invalidTokens.push(failedToken);
              }
            }
          }
        });

        console.log(
          `Chunk ${i + 1} results: ${ticketChunk.filter((t) => t.status === "ok").length} success, ${ticketChunk.filter((t) => t.status === "error").length} failure`,
        );
      } catch (error) {
        console.error(`Error sending chunk ${i + 1}:`, error);
        totalFailure += chunk?.length ?? 0;
      }

      if (i < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    setTimeout(async () => {
      await checkPushReceipts(tickets, invalidTokens);
    }, 15000); // Check after 15 seconds

    console.log(
      `Total results: ${totalSuccess} success, ${totalFailure} failure, ${invalidTokens.length} invalid tokens`,
    );

    return {
      success: totalSuccess,
      failure: totalFailure,
      invalidTokens: [...new Set(invalidTokens)], // Remove duplicates
    };
  } catch (error) {
    console.error("Error sending push notifications:", error);
    throw error;
  }
};

// Helper function to check receipts and identify more invalid tokens
async function checkPushReceipts(
  tickets: ExpoPushTicket[],
  invalidTokensCollector: string[],
): Promise<void> {
  try {
    // Extract ticket IDs
    const receiptIds: string[] = [];
    for (const ticket of tickets) {
      if (ticket.status === "ok" && ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    if (receiptIds.length === 0) {
      console.log("No receipt IDs to check");
      return;
    }

    console.log(`Checking ${receiptIds.length} push notification receipts...`);

    // Split receipt IDs into chunks of 100
    const receiptIdChunks = [];
    for (let i = 0; i < receiptIds.length; i += 100) {
      receiptIdChunks.push(receiptIds.slice(i, i + 100));
    }

    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        // Check each receipt for errors
        for (const receiptId in receipts) {
          const receipt = receipts[receiptId] as ExpoPushReceipt;

          if (receipt.status === "error") {
            console.error(`Receipt error for ${receiptId}:`, receipt.message);

            // Identify invalid tokens from receipts
            if (
              receipt.details?.error === "DeviceNotRegistered" ||
              receipt.message?.includes("not registered")
            ) {
              // Note: We can't easily map receipt back to token here
              // This is better handled at the ticket level above
              console.log(`Device not registered for receipt ${receiptId}`);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    }
  } catch (error) {
    console.error("Error checking push receipts:", error);
  }
}

export { expo };
