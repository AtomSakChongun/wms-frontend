import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Plus, Upload } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { inboundLots } from "./inboundMockData";
import InboundFilters, { type AppliedFilters } from "./inboundFilters";
import { lotColumns } from "./lotColumns";

export default function InboundPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    searchQuery: "",
    suppliers: [],
    statuses: [],
    locations: [],
  });
  const suppliersList = useMemo(
    () => Array.from(new Set(inboundLots.map((lot) => lot.supplier))).sort(),
    [],
  );
  const statusesList = useMemo(
    () => Array.from(new Set(inboundLots.map((lot) => lot.status))).sort(),
    [],
  );
  const locationsList = useMemo(
    () =>
      Array.from(new Set(inboundLots.map((lot) => lot.warehouseRef))).sort(),
    [],
  );
  const filteredLots = useMemo(() => {
    const query = appliedFilters.searchQuery.trim().toLowerCase();
    return inboundLots.filter((lot) => {
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
        !query || fields.some((value) => value?.toLowerCase().includes(query));
      return (
        matchesSearch &&
        (!appliedFilters.suppliers.length ||
          appliedFilters.suppliers.includes(lot.supplier)) &&
        (!appliedFilters.statuses.length ||
          appliedFilters.statuses.includes(lot.status)) &&
        (!appliedFilters.locations.length ||
          appliedFilters.locations.includes(lot.warehouseRef))
      );
    });
  }, [appliedFilters]);

  const pending = inboundLots.filter(
    (lot) => lot.status === "Pending QC" || lot.status === "Quarantine",
  ).length;
  const passed = inboundLots.filter(
    (lot) => lot.status === "QC Passed" || lot.status === "Putaway",
  ).length;
  const failed = inboundLots.filter((lot) => lot.status === "QC Failed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inbound Receiving</h1>
          <p className="text-sm text-muted-foreground">
            รับสินค้าเป็นล็อตและส่งต่อให้ QC ตรวจสอบ · {inboundLots.length} lots
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
        <StatCard
          value={inboundLots.length}
          label="Total Lots"
          variant="default"
        />
        <StatCard value={pending} label="Waiting for QC" variant="warning" />
        <StatCard value={passed} label="Passed / Putaway" variant="success" />
        <StatCard value={failed} label="QC Failed" variant="muted" />
      </div>
      <InboundFilters
        appliedFilters={appliedFilters}
        onApplyFilters={setAppliedFilters}
        suppliersList={suppliersList}
        statusesList={statusesList}
        locationsList={locationsList}
      />
      <DataTable
        columns={lotColumns}
        data={filteredLots}
        defaultPageSize={10}
      />
    </div>
  );
}
