"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

interface WalletPaginationProps {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function WalletPagination({
  page,
  limit,
  total,
  pages,
  hasNext,
  hasPrev,
}: WalletPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(newPage));
    router.push(`/wallet?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("limit", newLimit);
    params.set("page", "1");
    router.push(`/wallet?${params.toString()}`);
  };

  const startRow = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRow = Math.min(page * limit, total);

  // Generate page numbers to display
  const pageNumbers: number[] = [];
  const maxButtons = 5;
  let startP = Math.max(1, page - 2);
  let endP = Math.min(pages || 1, startP + maxButtons - 1);
  if (endP - startP < maxButtons - 1) {
    startP = Math.max(1, endP - maxButtons + 1);
  }
  for (let i = startP; i <= endP; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="px-6 py-4 flex items-center justify-between rounded-30 bg-white gap-4 flex-wrap">
      <Field orientation="horizontal" className="w-fit text-black/50 items-center gap-2">
        <FieldLabel htmlFor="select-rows-per-page" className="max-sm:hidden text-sm">
          Rows per page:
        </FieldLabel>
        <Select defaultValue={String(limit)} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-18 h-9 rounded-lg" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <div className="text-sm text-default/50 font-medium max-md:hidden">
        <span>{startRow}</span> - <span>{endRow}</span> of <span>{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePageChange(p)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                p === page
                  ? "bg-default text-white"
                  : "text-default/70 hover:bg-default-secondary/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button
            type="button"
            disabled={!hasPrev || page <= 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Previous page"
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-default-default text-default disabled:opacity-40 disabled:cursor-not-allowed hover:bg-default-secondary/10 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            disabled={!hasNext || page >= pages}
            onClick={() => handlePageChange(page + 1)}
            aria-label="Next page"
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-default-default text-default disabled:opacity-40 disabled:cursor-not-allowed hover:bg-default-secondary/10 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
