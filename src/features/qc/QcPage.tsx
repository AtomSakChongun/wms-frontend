import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { useInbound } from "../inbound/hooks/useInbound";
import QcFilters, { type AppliedFilters } from "./qcFilters";
import { createQcLotListColumns } from "./columns";

const EMPTY_FILTERS: AppliedFilters = {
  searchQuery: "",
  suppliers: [],
  statuses: [],
  locations: [],
};

const QC_PENDING_STATUSES = ["รอส่ง QC", "Pending QC", "Quarantine"];

export default function QcPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(EMPTY_FILTERS);

  // Fetch inbound lots from the same API as the Inbound page — QC works off
  // the same lots, just filtered down to the ones awaiting review
  const { data, isLoading, isError, error } = useInbound(appliedFilters);
  const lots = data?.data ?? [];

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

  const pendingLots = lots.filter((lot) =>
    QC_PENDING_STATUSES.includes(lot.status),
  ).length;

  const totalItems = lots.reduce((sum, lot) => sum + lot.items.length, 0);

  const columns = useMemo(
    () => createQcLotListColumns((id) => navigate(`/qc/${id}`)),
    [navigate],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">QC Inspection</h1>
          <p className="text-sm text-muted-foreground">
            ตรวจสอบคุณภาพสินค้าในแต่ละล็อต · {lots.length} lots awaiting review
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          value={pendingLots}
          label="Pending Review"
          variant="warning"
        />
        <StatCard value={totalItems} label="Total Items" />
      </div>

      <QcFilters
        suppliers={suppliersList}
        statuses={statusesList}
        locations={locationsList}
        appliedFilters={appliedFilters}
        onApplyFilters={setAppliedFilters}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-sm">Loading lots...</span>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load lots: {(error as Error)?.message ?? "Unknown error"}
        </div>
      )}

      {!isLoading && !isError && <DataTable columns={columns} data={lots} />}
    </div>
  );
}
