// import { api, methods } from '@/lib/api';
// import { apiUrl } from '@/constants/Variable';
// import { useSuspenseQuery } from '@tanstack/react-query';
// import { getAuthHeader } from '@/constants/authHeader';

// export const useProfileDetail = () => {
//     return useSuspenseQuery({
//         queryKey: ['profileDetail'],
//         queryFn: async (): Promise<any> => {
//             const headers = getAuthHeader()
//             console.log(headers)
//             const response = await api(
//                 methods.get,
//                 `${apiUrl}/api/profileDetails`,
//                 {},
//                 {
//                     headers: getAuthHeader(),
//                 }
//             )
//             return response
//         }
//     })
// }
import { api, methods } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";

export const useProfileDetail = () => {
  return useQuery({
    queryKey: ["myProfile"],

    queryFn: async (): Promise<any> => {
      const headers = getAuthHeader();
      const response = await api(
        methods.get,
        `${apiUrl}/api/profileDetails`,
        {},
        {
          headers,
        },
      );
      return response;
    },
  });
};
