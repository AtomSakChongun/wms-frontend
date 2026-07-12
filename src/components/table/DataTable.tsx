import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/utils/cn";
import {
  Inbox,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Props<T> {
  columns: ColumnDef<T>[];
  data: T[];
  defaultPageSize?: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function getPageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export function DataTable<T>({
  columns,
  data,
  defaultPageSize = 10,
}: Props<T>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const currentPage = pagination.pageIndex + 1;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500",
                    header.column.columnDef.meta?.hideOnMobile && "hidden md:table-cell"
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-slate-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-5 py-4",
                      cell.column.columnDef.meta?.hideOnMobile && "hidden md:table-cell"
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-16 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <Inbox
                    className="text-slate-300"
                    size={44}
                    strokeWidth={1}
                  />
                  <p className="font-medium text-slate-900">No Data</p>
                  <p className="text-sm text-slate-500">
                    No products match your active filters.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {data.length > 0 && (
        <div className="flex flex-col gap-3 border-t bg-slate-50 px-5 py-3 md:flex-row md:items-center md:justify-between">

          {/* Rows per page */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Rows per page</span>

            <select
              value={pagination.pageSize}
              onChange={(e) =>
                table.setPageSize(Number(e.target.value))
              }
              className="rounded-lg border border-slate-200 px-2 py-1"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page Info */}
          <div className="text-sm text-slate-500">
            Page{" "}
            <span className="font-semibold">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {pageCount}
            </span>{" "}
            • {data.length} rows
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1">

            {/* First */}
            <button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg p-2 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Previous */}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg p-2 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 px-2">
              {getPageNumbers(currentPage, pageCount).map((page, index) =>
                page === "..." ? (
                  <span
                    key={index}
                    className="px-2 text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() =>
                      table.setPageIndex((page as number) - 1)
                    }
                    className={`h-8 min-w-[32px] rounded-lg text-sm transition ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next */}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg p-2 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>

            {/* Last */}
            <button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg p-2 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronsRight size={16} />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}