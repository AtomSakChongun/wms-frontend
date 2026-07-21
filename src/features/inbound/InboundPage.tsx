import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";
import { Download, Plus, Upload, Loader2 } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { useInbound } from "./hooks/useInbound";
import InboundFilters from "./inboundFilters";
import type { AppliedFilters } from "./types";
import { lotColumns } from "./lotColumns";

const EMPTY_FILTERS: AppliedFilters = {
  searchQuery: "",
  suppliers: [],
  statuses: [],
  locations: [],
};

const DEFAULT_PAGE_SIZE = 10;

export default function InboundPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(EMPTY_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // Fetch inbound lots from API — refetches whenever filters or the page/limit change
  const { data, isLoading, isError, error } = useInbound(appliedFilters, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const lots = data?.data ?? [];
  const totalLots = data?.total ?? 0;

  const handleApplyFilters = (filters: AppliedFilters) => {
    setAppliedFilters(filters);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const suppliersList = useMemo(
    () => Array.from(new Set(lots.map((lot) => lot.supplier))).sort(),
    [lots],
  );
  const statusesList = useMemo(
    () => Array.from(new Set(lots.map((lot) => lot.status))).sort(),
    [lots],
  );
  const locationsList = useMemo(
    () => Array.from(new Set(lots.map((lot) => lot.receivingLocation))).sort(),
    [lots],
  );

  const pending = lots.filter(
    (lot) => lot.status === "Pending QC" || lot.status === "Quarantine",
  ).length;
  const passed = lots.filter(
    (lot) => lot.status === "QC Passed" || lot.status === "Putaway",
  ).length;
  const failed = lots.filter((lot) => lot.status === "QC Failed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inbound Receiving</h1>
          <p className="text-sm text-muted-foreground">
            รับสินค้าเป็นล็อตและส่งต่อให้ QC ตรวจสอบ · {totalLots} lots
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border hover:bg-muted text-foreground font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Download size={15} />
            Export
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border hover:bg-muted text-foreground font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Upload size={15} />
            Import
          </button>
          <button
            type="button"
            onClick={() => navigate("/inbound/new")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={15} />
            New Lot
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard value={totalLots} label="Total Lots" variant="default" />
        <StatCard value={pending} label="Waiting for QC" variant="warning" />
        <StatCard value={passed} label="Passed / Putaway" variant="success" />
        <StatCard value={failed} label="QC Failed" variant="muted" />
      </div>
      <InboundFilters
        appliedFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        suppliersList={suppliersList}
        statusesList={statusesList}
        locationsList={locationsList}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-sm">Loading inbound lots...</span>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load inbound lots: {(error as Error)?.message ?? "Unknown error"}
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={lotColumns}
          data={lots}
          manualPagination
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={data?.totalPages ?? 0}
          rowCount={totalLots}
        />
      )}
    </div>
  );
}
