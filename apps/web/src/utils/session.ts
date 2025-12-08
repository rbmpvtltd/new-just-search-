// "use server";

// import { cookies } from "next/headers";

// export async function setToken(token: string) {
//   // TODO: fixing persist in production
//   const persist = process.env.NODE_ENV === "production";
//   const week = 7 * 24 * 60 * 60 * 1000;
//   const expiresAt = new Date(Date.now() + week);
//   const cookieStore = await cookies();
//   if (persist) {
//     (await cookies()).set("token", token, {
//       httpOnly: true,
//       secure: true,
//       path: "/",
//     });
//   } else {
//     cookieStore.set("token", token);
//   }

//   return true;
// }

// export async function getToken() {
//   const cookieStore = await cookies();
//   return cookieStore.get("token");
// }

// export async function setRole(role: string, persist: boolean = false) {
//   const tempTime = 5 * 1000;
//   const expiresAt = new Date(Date.now() + tempTime);
//   const cookieStore = await cookies();
//   if (persist) {
//     cookieStore.set("role", role, {
//       httpOnly: true,
//       secure: true,
//       expires: expiresAt,
//       sameSite: "lax",
//       path: "/",
//     });
//   } else {
//     cookieStore.set("role", role);
//   }
//   return true;
// }

// export async function getRole() {
//   const cookieStore = await cookies();
//   return cookieStore.get("role");
// }

"use server";

import { cookies } from "next/headers";

/**
 * Store auth token in cookie (Server Action)
 */
export async function setToken(token: string) {
  const cookieStore = await cookies();
  const persist = process.env.NODE_ENV === "production";

  if (persist) {
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  } else {
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  }

  return true;
}

/**
 * Read auth token from cookie (Server-only)
 */
export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token");
}

/**
 * Store user role in cookie (Server Action)
 */
export async function setRole(role: string, persist = false) {
  const cookieStore = await cookies();

  if (persist) {
    cookieStore.set("role", role, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 5 * 1000), // 5 seconds
    });
  } else {
    cookieStore.set("role", role, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  }

  return true;
}

/**
 * Read role from cookie (Server-only)
 */
export async function getRole() {
  const cookieStore = await cookies();
  return cookieStore.get("role");
}
