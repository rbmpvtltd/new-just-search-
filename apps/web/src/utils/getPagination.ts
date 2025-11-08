function getPagination(
  currentPage: number | undefined,
  totalPages: number | undefined,
  maxButtons = 7,
) {
  const pages = [];

  if (totalPages && totalPages <= maxButtons) {
    // agar total pages chhote hai
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage && totalPages) {
      let start = Math.max(2, currentPage - Math.floor(maxButtons / 2));
      let end = Math.min(totalPages - 1, start + maxButtons - 3);

      // adjust start agar end zyada ho gaya
      start = Math.max(2, end - maxButtons + 3);

      pages.push(1); // first page
      if (start > 2) pages.push("..."); // gap

      for (let i = start; i <= end; i++) pages.push(i);

      if (!pages.includes("...") && end < totalPages - 1) {
        pages.push("..."); // gap
      }

      pages.push(totalPages); // last page
    }
  }

  return pages;
}

export { getPagination };
