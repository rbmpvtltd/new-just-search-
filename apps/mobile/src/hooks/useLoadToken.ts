// import { useEffect, useState } from "react";
// import { deleteToken, getToken } from "../utils/secureStore";
// import { useAuthStore } from "../store/authStore";
// import { fetchVerifyAuth } from "@/query/auth";
// import { useQuery } from "@tanstack/react-query";
// import { trpc } from "@/lib/trpc";

// export function useLoadToken() {
//   const setToken = useAuthStore((state) => state.setToken);
//   const clearToken = useAuthStore((state) => state.clearToken);
//   const [loading, setLoading] = useState(true);
//   const { data, isLoading, isError } = useQuery(
//   trpc.auth.verifyauth.queryOptions()
// );

// const success = data?.success;
// const role = data?.role;

//   if(success){
//     const token = (async ()=>{
//       const token = await getToken()
//       return await token

//     })()
//     return {token,role}
//   }

//   return {token : null,role :null}
// }

// import { useEffect, useState } from "react";
// import { deleteToken, getToken } from "../utils/secureStore";
// import { useAuthStore } from "../store/authStore";
// import { useQuery } from "@tanstack/react-query";
// import { trpc } from "@/lib/trpc";
// import { UserRole } from "@repo/db/src/schema/auth.schema";

// export function useLoadToken() {
//   const setToken = useAuthStore((state) => state.setToken);
//   const clearToken = useAuthStore((state) => state.clearToken);
//   const [token, setLocalToken] = useState<string | null>(null);
//   const [role, setRole] = useState<string | null>(null);

//   const { data, isLoading, isError ,error} = useQuery(
//     trpc.auth.verifyauth.queryOptions()
//   );
//   console.log("data value is ==============>",data)
//   console.log("error in load token value is ==============>",error)



//   useEffect(() => {
//     const fetchToken = async () => {
//       if (data?.success) {
//         const storedToken = await getToken();
//         setLocalToken(storedToken);
//         setRole(data?.role || UserRole.visiter);
//         setToken(storedToken, data?.role || UserRole.visiter); // update global auth store
//       } else {
//         await deleteToken();
//         clearToken();
//         setLocalToken(null);
//         setRole(null);
//       }
//     };

//     fetchToken();
//   }, [data, setToken, clearToken]);

//   return { token, role, isLoading, isError };
// }


import { useEffect, useState } from "react";
import { deleteToken, getToken } from "../utils/secureStore";
import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { UserRole } from "@repo/db/src/schema/auth.schema";

export function useLoadToken() {
  const [token, setToken] = useState<string | null>(null);
  const AuthStore = useAuthStore();
  const [role, setRole] = useState<string | null>(null);
  const { data, isLoading, isError, error } = useQuery(
    trpc.auth.verifyauth.queryOptions()
  );

  useEffect(() => {
    const fetchToken = async () => {
      if (data?.success) {
        const storedToken = await getToken();
        setToken(storedToken);
        setRole(data.role);
      } else {
        await deleteToken();
        setToken(null);
        setRole(null);
      }
    };
    fetchToken();
  }, [data]);

  return { token, role, isLoading, isError };
}
