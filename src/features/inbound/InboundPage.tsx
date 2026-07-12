import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { inboundLots } from "./inboundMockData";
import type { InboundLot } from "./types";
import { LotStatusBadge } from "./LotStatusBadge";

// ─── Column definitions ────────────────────────────────────────────────────────

function ActionCell({ lotId }: { lotId: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/inbound/${lotId}`)}
      className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
    >
      <Eye size={14} />
    </button>
  );
}

const lotColumns: ColumnDef<InboundLot>[] = [
  {
    accessorKey: "lotId",
    header: "LOT ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-slate-800">
        {row.original.lotId}
      </span>
    ),
  },
  {
    accessorKey: "poNumber",
    header: "PO NUMBER",
    cell: ({ row }) => row.original.poNumber ?? <span className="text-slate-400">—</span>,
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: "supplier",
    header: "SUPPLIER",
  },
  {
    accessorKey: "receivedDate",
    header: "RECEIVED DATE",
    cell: ({ row }) =>
      new Date(row.original.receivedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: "warehouseRef",
    header: "DOCK",
    meta: { hideOnMobile: true },
  },
  {
    id: "itemCount",
    header: "ITEMS",
    cell: ({ row }) => `${row.original.items.length} SKU`,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <LotStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionCell lotId={row.original.lotId} />,
  },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function InboundPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inboundLots;
    return inboundLots.filter(
      (lot) =>
        lot.lotId.toLowerCase().includes(q) ||
        lot.supplier.toLowerCase().includes(q) ||
        (lot.poNumber?.toLowerCase().includes(q) ?? false)
    );
  }, [search]);

  // Stat counts
  const total = inboundLots.length;
  const pending = inboundLots.filter((l) => l.status === "Pending QC").length;
  const passed = inboundLots.filter((l) => l.status === "QC Passed" || l.status === "Putaway").length;
  const failed = inboundLots.filter((l) => l.status === "QC Failed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inbound Receiving</h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming stock lots · {inboundLots.length} lots
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
            onClick={() => navigate("/inbound/new")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={15} />
            New Lot
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={total} label="Total Lots" variant="default" />
        <StatCard value={pending} label="Pending QC" variant="warning" />
        <StatCard value={passed} label="Passed / Putaway" variant="success" />
        <StatCard value={failed} label="QC Failed" variant="muted" />
      </div>

      {/* Quick search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search Lot ID, Supplier, PO Number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Table */}
      <DataTable columns={lotColumns} data={filtered} defaultPageSize={10} />
    </div>
  );
}
