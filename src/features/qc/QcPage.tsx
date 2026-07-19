import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/table/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { qcLotsToReview } from "./qcMockData";
import QcFilters, { type AppliedFilters } from "./qcFilters";
import { createQcLotListColumns } from "./columns";

export default function QcPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    searchQuery: "",
    suppliers: [],
    statuses: [],
    locations: [],
  });

  const suppliersList = useMemo(
    () => Array.from(new Set(qcLotsToReview.map((lot) => lot.supplier))).sort(),
    [],
  );

  const statusesList = useMemo(
    () => Array.from(new Set(qcLotsToReview.map((lot) => lot.status))).sort(),
    [],
  );

  const locationsList = useMemo(
    () =>
      Array.from(new Set(qcLotsToReview.map((lot) => lot.warehouseRef))).sort(),
    [],
  );

  const filteredLots = useMemo(() => {
    const query = appliedFilters.searchQuery.trim().toLowerCase();
    return qcLotsToReview
      .filter((lot) => {
        const fields = [
          lot.lotId,
          lot.poNumber,
          lot.supplier,
          lot.status,
          ...lot.items.flatMap((item) => [
            item.sku,
            item.productName,
            item.barcode,
          ]),
        ];
        const matchesSearch =
          !query ||
          fields.some((value) => value?.toLowerCase().includes(query));
        return (
          matchesSearch &&
          (!appliedFilters.suppliers.length ||
            appliedFilters.suppliers.includes(lot.supplier)) &&
          (!appliedFilters.statuses.length ||
            appliedFilters.statuses.includes(lot.status)) &&
          (!appliedFilters.locations.length ||
            appliedFilters.locations.includes(lot.warehouseRef))
        );
      })
      .map((lot) => ({
        ...lot,
        itemsCount: lot.items.length,
      }));
  }, [appliedFilters]);

  const pendingLots = qcLotsToReview.filter(
    (lot) => lot.status === "Pending QC",
  ).length;

  const itemsAwaitingQc = qcLotsToReview.reduce(
    (sum, lot) =>
      sum + lot.items.filter((item) => item.qcStatus === "Pending").length,
    0,
  );

  const lotsPartiallyReviewed = qcLotsToReview.filter((lot) =>
    lot.items.some(
      (item) =>
        item.qcStatus === "Passed" ||
        item.qcStatus === "Failed" ||
        item.qcStatus === "Quarantine",
    ),
  ).length;

  const columns = useMemo(
    () => createQcLotListColumns((lotId) => navigate(`/qc/${lotId}`)),
    [navigate],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">QC Inspection</h1>
          <p className="text-sm text-muted-foreground">
            ตรวจสอบคุณภาพสินค้าในแต่ละล็อต · {qcLotsToReview.length} lots
            awaiting review
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          value={pendingLots}
          label="Pending Review"
          variant="warning"
        />
        <StatCard
          value={itemsAwaitingQc}
          label="Items to Check"
        />
        <StatCard
          value={lotsPartiallyReviewed}
          label="Partially Reviewed"
        />
      </div>

      <QcFilters
        suppliers={suppliersList}
        statuses={statusesList}
        locations={locationsList}
        appliedFilters={appliedFilters}
        onApplyFilters={setAppliedFilters}
      />

      <DataTable
        columns={columns}
        data={filteredLots}
      />
    </div>
  );
}
