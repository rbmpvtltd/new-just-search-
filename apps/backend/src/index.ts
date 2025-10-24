// import { logger } from "@repo/helper";

import fs from "node:fs";
import { db, schemas } from "@repo/db";
import { UserRole } from "@repo/db/src/schema/auth.schema";
import { logger } from "@repo/helper";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import axios from "axios";
import bodyParser from "body-parser";
// import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cookieParser from "cookie-parser";
import cors from "cors";
import { eq } from "drizzle-orm";
import express from "express";
import jwt from "jsonwebtoken";
// import * as ws from "ws";
// import { cloudinarySignature } from "./lib/cloudinary";
// import { ORPChandler } from "./lib/orpc";
import { appRouter } from "./route";
import { createContext } from "./utils/context";

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    middleware: cors({ origin: "*" }),
    onError: (opts) => {
      logger.error(opts.error.code);
    },
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/auth/apple/callback", async (req, res) => {
  const code = req.body.code as string;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const privateKey = fs.readFileSync(
      "/home/meekail/Desktop/justsearch/application/new-just-search-/apps/backend/keys/AuthKey_LSC5HAHRF8.p8",
    );

    const clientSecret = jwt.sign(
      {
        iss: process.env.APPLE_TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
        aud: "https://appleid.apple.com",
        sub: process.env.APPLE_CLIENT_ID!,
      },
      privateKey,
      {
        algorithm: "ES256",
        header: { alg: "ES256", kid: process.env.APPLE_KEY_ID },
      },
    );

    const tokenRes = await axios.post(
      "https://appleid.apple.com/auth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri:
          "https://esthetical-cletus-pessimistically.ngrok-free.dev/auth/apple/callback",
        client_id: process.env.APPLE_CLIENT_ID!,
        client_secret: clientSecret,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const decoded: any = jwt.decode(tokenRes.data.id_token);
    const email = decoded.email;
    const appleId = decoded.sub;
    const name =
      decoded?.name?.firstName || decoded?.name?.lastName || "Apple User";

    const existingUsers = await db
      .select()
      .from(schemas.auth.users)
      .where(eq(schemas.auth.users.email, email));

    let user = existingUsers[0];

    if (!user) {
      const inserted = await db
        .insert(schemas.auth.users)
        .values({
          displayName: name,
          email,
          role: UserRole.guest,
          googleId: appleId,
          createdAt: new Date(),
        })
        .returning();

      user = inserted[0];
    }

    return res.redirect(`http://localhost:3000?email=${user?.email}`);
  } catch (err) {
    console.error("Apple login error:", err);
    res.status(500).json({ error: "Apple login failed" });
  }
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        redirect_uri: "http://localhost:4000/auth/google/callback",
        grant_type: "authorization_code",
      }),
    });

    const tokens = await response.json();

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );
    const profile = await profileRes.json();

    const email = profile.email;

    const existingUsers = await db
      .select()
      .from(schemas.auth.users)
      .where(eq(schemas.auth.users.email, email));

    let user = existingUsers[0];

    if (!user) {
      const inserted = await db
        .insert(schemas.auth.users)
        .values({
          displayName: profile?.name || profile?.given_name,
          email,
          role: UserRole.guest,
          googleId: profile.id,
          createdAt: new Date(),
        })
        .returning();

      user = inserted[0];
    }

    // You can store a session or JWT here before redirecting to frontend
    res.redirect(`http://localhost:3000?email=${user?.email}`);
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed" });
  }
});
// console.log("rerun");

// app.use(cors({ origin: "*" }));
// app.use(cookieParser());

// adding trpc

// adding websocket in trpc
// const wsServer = new ws.WebSocketServer({ port: 5500 });
// const handler = applyWSSHandler({
//   wss: wsServer,
//   router: appRouter,
//   createContext: createWSContext,
//   keepAlive: {
//     enabled: true,
//     pingMs: 30000,
//     pongWaitMs: 5000,
//   },
// });
//
// wsServer.on("connection", (ws) => {
//   console.log(`connection created`, ws);
//   ws.once("close", () => {
//     console.log(`Connection (${wsServer.clients.size})`);
//   });
// });

// process.on("SIGTERM", () => {
//   handler.broadcastReconnectNotification();
//   wsServer.close();
// });
//
// adding Orpc

// get data on localhost:4000/api
// app.use(async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   const result = await ORPChandler.handle(req, res, {
//    context: {
//       token,
//     },
//   });

//   if (!result.matched) {
//     return next();
//   }
// });

// get data on localhost:4000/spec
// app.get("/spec", (_, res) => {
//   const result = ORPCspec;

//   res.send(result);
// });
app.listen(4000);

// exporting ---
export type { AppRouter } from "./route";
export { appRouter };
