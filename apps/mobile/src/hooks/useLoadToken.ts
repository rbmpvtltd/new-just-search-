import { useEffect, useState } from "react";
import { deleteToken, getToken } from "../utils/secureStore";
import { useAuthStore } from "../store/authStore";
import { fetchVerifyAuth } from "@/query/auth";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

export function useLoadToken() {
  const setToken = useAuthStore((state) => state.setToken);
  const clearToken = useAuthStore((state) => state.clearToken);
  const token = (async ()=>{
    return await getToken()
  })()
  const [loading, setLoading] = useState(true);
  const {data , isLoading , error , isError} = useQuery(trpc.auth.verifyauth.queryOptions())

  if(isError){
    console.log("deleting token");
    (async()=>{
      await deleteToken()
      clearToken()
    })()
  }
  

  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      console.log("store token is in load token" , token)
      // const user = await fetchVerifyAuth(token);
      console.log("errro in useLoadToken file line 19",error)

      console.log("data in useLoadToken file line 19",data)


      if (data?.success) {
        setToken(token, "business");
      } 
    };
    initAuth();
  }, [data,isLoading]);

  return { isLoading };
}

// import { useEffect, useState } from "react";
// import { getToken, deleteToken } from "../utils/secureStore";
// import { useAuthStore } from "../store/authStore";
// import { useQuery } from "@tanstack/react-query";
// import { trpc } from "@/lib/trpc";

// export function useLoadToken() {
//   const setToken = useAuthStore((state) => state.setToken);
//   const clearToken = useAuthStore((state) => state.clearToken);

//   // Step 1: Load token from secure storage
//   const [token, setTokenFromStorage] = useState<string | null>(null);
//   const [loadingToken, setLoadingToken] = useState(true);

//   useEffect(() => {
//     const loadToken = async () => {
//       const storedToken = await getToken();
//       setTokenFromStorage(storedToken);
//       setLoadingToken(false);
//     };
//     loadToken();
//   }, []);

//   // Step 2: Only verify if token exists
//   const { data, error, isLoading: isVerifying } = useQuery({
//     ...trpc.auth.verifyauth.queryOptions(),
//     enabled: !!token, // ⚠️ Only run when token is available
//   });

//   // Step 3: React to verification result
//   useEffect(() => {
//     if (!loadingToken && token) {
//       if (error) {
//         // Token invalid or request failed
//         console.log("Token verification failed — clearing auth");
//         deleteToken();
//         clearToken();
//       } else if (data) {
//         // Success! Set auth state
//         console.log("Verified auth data:", data);
//         setToken(data.session, data.role); // adjust based on your API response
//       }
//     }
//   }, [data, error, loadingToken, token, setToken, clearToken]);

//   return {
//     isLoading: loadingToken || (token ? isVerifying : false),
//   };
// }
