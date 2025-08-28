// import { valkey } from "./valkey";
// import {RedisStore} from "connect-redis"
// import session from "express-session";
// // session.ts

// const redisStore = new RedisStore({
//     client: valkey,
//     prefix: "justsearch:",
// })

// export const sessionMiddleware = session({
//   store: redisStore,
//   secret: "rbm00just-search", // use env variable
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: false,
//     secure: false,
//     maxAge: 1000 * 60 * 60 * 1, // 1 hour
//   },
// });

import crypto from "node:crypto";
import { Redis } from "ioredis";
const redis = new Redis();

interface Session {
  id: string;
  secretHash: Uint8Array; // Uint8Array is a byte array
  createdAt: Date;
}

interface SessionWithToken extends Session {
  token: string;
}

function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    // >> 3 "removes" the right-most 3 bits of the byte
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

async function createSession(): Promise<SessionWithToken> {
  const now = new Date();

  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);

  const token = id + "." + secret;

  const session: SessionWithToken = {
    id,
    secretHash,
    createdAt: now,
    token,
  };

  const sessionData = {
    id: session.id,
    secretHash: Buffer.from(session.secretHash).toString("base64"),
    createdAt: session.createdAt.toISOString(),
    token: session.token,
  };

  // Save in Redis with TTL (optional, e.g., 1 day = 86400 seconds)
  await redis.set(
    `session:${id}`,
    JSON.stringify(sessionData),
    "EX",
    60 * 60 * 24,
  );

  return session;
}

async function validateSessionToken(token: string): Promise<Session | null> {
	const tokenParts = token.split(".");
	if (tokenParts.length !== 2) {
		return null;
	}
	const sessionId = tokenParts[0];
	const sessionSecret = tokenParts[1];

	const session = await getSession(sessionId);
	if (!session) {
		return null;
	}

	const tokenSecretHash = await hashSecret(sessionSecret);
	const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
	if (!validSecret) {
		return null;
	}

	return session;
}

async function getSession(sessionId: string): Promise<Session | null> {

  const data = await redis.get(`session:${sessionId}`);
  if (!data) {
    return null; // not found or expired
  }


  return JSON.parse(data) as Session;
}

async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}


function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}


export {createSession,getSession,deleteSession}