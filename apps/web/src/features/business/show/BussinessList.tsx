"use client";
import { getPagination } from "@/utils/getPagination";
import { BussinessListingCard } from "./component/BussinessListingCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BussinessList({ business, page, totalPages, id }: any) {
  const pagination = getPagination(page, totalPages);

  return (
    <div>
      <div>
        {business?.map((item: any) => (
          <BussinessListingCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={{
                    pathname: `/subcategory/${id}`,
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
                      pathname: `/subcategory/${id}`,
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
                    pathname: `/subcategory/${id}`,
                    query: { page: page + 1 },
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
