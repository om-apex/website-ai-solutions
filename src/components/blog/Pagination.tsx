import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function pageHref(basePath: string, page: number): string {
  if (page === 1) return basePath;
  return `${basePath}/page/${page}`;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
        >
          Previous
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-300">
          Previous
        </span>
      )}

      {/* Full page numbers on desktop */}
      <div className="hidden sm:flex items-center gap-1">
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400">
              ...
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              className="px-3 py-1 text-sm font-bold text-white bg-brand-primary rounded-md"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={pageHref(basePath, page)}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-brand-primary hover:bg-gray-100 rounded-md transition-colors"
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Compact on mobile */}
      <span className="sm:hidden text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
        >
          Next
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-300">
          Next
        </span>
      )}
    </nav>
  );
}
