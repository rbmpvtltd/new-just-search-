import fs from "node:fs";
import { db, schemas } from "@repo/db";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { logger } from "@repo/logger";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import { eq } from "drizzle-orm";
import express from "express";
import jwt from "jsonwebtoken";
import { appRouter, openRouter } from "./route";
import { createContext } from "./utils/context";
import { limiter } from "./utils/limiter";
import { createSession } from "./features/auth/lib/session";

const app = express();

app.use(limiter);

app.get("/", (_, res) => {
  return res.send("hello");
});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext, // TODO: add rate limiter
    middleware: cors({ origin: "*" }),
    onError: (opts) => {
      logger.error(opts.error.code);
    },
  }),
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", openRouter);

app.post("/auth/apple/callback", async (req, res) => {
  const code = req.body.code as string;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const privateKey = fs.readFileSync(
      "/home/meekail/Desktop/justsearch/application/new-justsearch/apps/backend/keys/AuthKey_LSC5HAHRF8.p8",
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
          appleId: appleId,
          createdAt: new Date(),
        })
        .returning();

      user = inserted[0];
    }
    const session = await createSession(Number(user?.id));

    // Set HTTP-only cookie with the session token

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Success</title>
        </head>
        <body>
          <script>
            window.opener.postMessage(
              {
                type: 'GOOGLE_AUTH_SUCCESS',
                session: '${session?.token}',
                role: '${session?.role}'
              },
              '${process.env.FRONTEND_URL || "http://localhost:9000"}'
            );
            window.close();
          </script>
          <p>Login successful! This window will close automatically...</p>
        </body>
      </html>
    `);
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
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
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
    const session = await createSession(Number(user?.id));
    // You can store a session or JWT here before redirecting to frontend
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Success</title>
        </head>
        <body>
          <script>
            window.opener.postMessage(
              {
                type: 'GOOGLE_AUTH_SUCCESS',
                session: '${session?.token}',
                role: '${session?.role}'
              },
              '${process.env.FRONTEND_URL || "http://localhost:9000"}'
            );
            window.close();
          </script>
          <p>Login successful! This window will close automatically...</p>
        </body>
      </html>
    `);
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
