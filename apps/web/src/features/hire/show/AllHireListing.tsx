"use client";
// import { getPagination } from "@/utils/getPagination";
// import { HireListingCard } from "./component/HireListingCard";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// export default function AllHireList({ hire, page, totalPages, }: any) {
//   const pagination = getPagination(page, totalPages);

//   return (
//     <div>
//       <div>
//         {hire?.map((item: any) => {
//             return (
//           <HireListingCard key={item.id} item={item} />
//         )})}
//       </div>
//       <div className="mt-4 mb-5">
//         <Pagination>
//           <PaginationContent>
//             {page > 1 && (
//               <PaginationItem>
//                 <PaginationPrevious
//                   href={{
//                     pathname: `/hire`,
//                     query: { page: page - 1 },
//                   }}
//                 />
//               </PaginationItem>
//             )}
//             {pagination.map((item, index) => {
//               if (item === "...") {
//                 return (
//                   <PaginationItem key={index.toString()}>
//                     <PaginationEllipsis />
//                   </PaginationItem>
//                 );
//               }
//               return (
//                 <PaginationItem
//                   key={index.toString()}
//                   className={item === page ? "border-2 border-primary" : ""}
//                 >
//                   <PaginationLink
//                     href={{
//                       pathname: `/hire`,
//                       query: { page: item },
//                     }}
//                   >
//                     {item}
//                   </PaginationLink>
//                 </PaginationItem>
//               );
//             })}
//             {page < totalPages && (
//               <PaginationItem>
//                 <PaginationNext
//                   href={{
//                     pathname: `/hire`,
//                     query: { page: page + 1 },
//                   }}
//                 />
//               </PaginationItem>
//             )}
//           </PaginationContent>
//         </Pagination>
//       </div>
//     </div>
//   );
// }
import { getPagination } from "@/utils/getPagination";
import { HireListingCard } from "./component/HireListingCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AllHireList({ hire, }: any) {
  // const pagination = getPagination(page, totalPages);

  return (
    <div>
      <div>
        {hire?.map((item: any) => {
            return (
          <HireListingCard key={item.id} item={item} />
        )})}
      </div>
      <div className="mt-4 mb-5">
        {/* <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={{
                    pathname: `/hire`,
                    query: { page: page - 1 },
                  }}
                />
              </PaginationItem>
            )}
            {pagination.map((item, index) => {
              if (item === "...") {
                return (
                  <PaginationItem key={index.toString()}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem
                  key={index.toString()}
                  className={item === page ? "border-2 border-primary" : ""}
                >
                  <PaginationLink
                    href={{
                      pathname: `/hire`,
                      query: { page: item },
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={{
                    pathname: `/hire`,
                    query: { page: page + 1 },
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination> */}
      </div>
    </div>
  );
}
