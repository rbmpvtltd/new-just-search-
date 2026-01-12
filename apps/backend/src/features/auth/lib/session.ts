import crypto from "node:crypto";
import { encodeBase32 } from "@oslojs/encoding";
import type { UserRole } from "@repo/db";
import { redis } from "@/lib/redis";
import { getUserById } from "../auth.service";

interface Session {
  token: string;
  id: string;
  role: UserRole;
  secretHash: Uint8Array;
  createdAt: Date;
  userId: number;
}

export interface SessionWithToken extends Session {
  token: string;
}

function generateSecureRandomString(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32(tokenBytes).toLowerCase();
  return token;
}

async function createSession(userId: number): Promise<SessionWithToken | null> {
  const now = new Date();
  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);

  const token = `${id}.${secret}`;
  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  const session: SessionWithToken = {
    id,
    secretHash,
    createdAt: now,
    token,
    userId: user.id,
    role: user.role,
  };

  const sessionData = {
    id: session.id,
    secretHash: Buffer.from(session.secretHash).toString("base64"),
    createdAt: session.createdAt.toISOString(),
    token: session.token,
    userId: user.id,
    role: user.role,
  };

  // Save in Redis with TTL (optional, e.g., 1 day = 86400 seconds)
  await redis.set(
    `session:${id}`,
    JSON.stringify(sessionData),
    "EX",
    60 * 60 * 24,
  );

  // TODO: remembering to delete all sessions when deleting user form admin
  await redis.set(
    `usersessionid:${userId}`,
    `session:${id}`,
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
  const sessionId = tokenParts[0] as string;
  const sessionSecret = tokenParts[1] as string;

  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  const tokenSecretHash = await hashSecret(sessionSecret);

  if (!validSecret(tokenSecretHash, session.secretHash)) {
    return null;
  }

  return session;
}

async function getSession(sessionId: string): Promise<Session | null> {
  const data = await redis.get(`session:${sessionId}`);
  if (!data) {
    return null;
  }
  const jsonParseData = JSON.parse(data);

  const base64 = jsonParseData.secretHash;
  const uint8 = Uint8Array.from(Buffer.from(base64, "base64"));

  return {
    token: jsonParseData.token,
    id: jsonParseData.id,
    userId: jsonParseData.userId,
    role: jsonParseData.role,
    secretHash: uint8,
    createdAt: jsonParseData.createdAt,
  };
}

async function changeRoleInSession(sessionId: string, role: UserRole) {
  const data = await redis.get(`session:${sessionId}`);
  if (!data) {
    return null;
  }

  const jsonParseData = JSON.parse(data);

  const sessionData = {
    id: jsonParseData.id,
    secretHash: jsonParseData.secretHash,
    createdAt: jsonParseData.createdAt,
    token: jsonParseData.token,
    userId: jsonParseData.userId,
    role: role,
  };

  // Save in Redis with TTL (optional, e.g., 1 day = 86400 seconds)
  await redis.set(
    `session:${sessionId}`,
    JSON.stringify(sessionData),
    "EX",
    60 * 60 * 24,
  );

  return true;
}

async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}

function validSecret(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export {
  changeRoleInSession,
  createSession,
  getSession,
  deleteSession,
  validateSessionToken,
};
