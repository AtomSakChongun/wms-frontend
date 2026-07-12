import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, ClipboardCheck, ClipboardX } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { inboundLots } from "@/features/inbound/inboundMockData";
import { LotStatusBadge } from "@/features/inbound/LotStatusBadge";
import { ItemQcStatusBadge } from "@/features/inbound/ItemQcStatusBadge";
import type { LotItem } from "@/features/inbound/types";

// ─── Field display helper ─────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800">{value ?? "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
      {children}
    </div>
  );
}

// ─── Lot items table columns ──────────────────────────────────────────────────

const itemColumns: ColumnDef<LotItem>[] = [
  {
    accessorKey: "lineNo",
    header: "#",
    cell: ({ row }) => (
      <span className="text-slate-400 text-xs">#{row.original.lineNo}</span>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-slate-700">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "productName",
    header: "PRODUCT NAME",
  },
  {
    accessorKey: "barcode",
    header: "BARCODE",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.barcode || "—"}</span>
    ),
    meta: { hideOnMobile: true },
  },
  {
    id: "qty",
    header: "EXP / RCV",
    cell: ({ row }) => {
      const { expectedQty, receivedQty, unit } = row.original;
      const match = expectedQty === receivedQty;
      return (
        <span
          className={
            match
              ? "text-emerald-600 font-semibold text-xs"
              : "text-orange-500 font-semibold text-xs"
          }
        >
          {expectedQty} / {receivedQty} {unit}
        </span>
      );
    },
  },
  {
    accessorKey: "unitCost",
    header: "UNIT COST",
    cell: ({ row }) => `$${row.original.unitCost.toFixed(2)}`,
    meta: { hideOnMobile: true },
  },
  {
    id: "lineTotal",
    header: "LINE TOTAL",
    cell: ({ row }) =>
      `$${(row.original.unitCost * row.original.receivedQty).toFixed(2)}`,
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: "expiryDate",
    header: "EXPIRY",
    cell: ({ row }) =>
      row.original.expiryDate ? (
        new Date(row.original.expiryDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      ) : (
        <span className="text-slate-400">—</span>
      ),
    meta: { hideOnMobile: true },
  },
  // ── QC Status per item ──────────────────────────────────────────────────────
  {
    accessorKey: "qcStatus",
    header: "QC STATUS",
    cell: ({ row }) => <ItemQcStatusBadge status={row.original.qcStatus} />,
  },
  {
    accessorKey: "qcNote",
    header: "QC NOTE",
    cell: ({ row }) =>
      row.original.qcNote ? (
        <span className="text-xs text-slate-600">{row.original.qcNote}</span>
      ) : (
        <span className="text-slate-300 text-xs">—</span>
      ),
    meta: { hideOnMobile: true },
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function InboundDetailPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const navigate = useNavigate();

  const lot = inboundLots.find((l) => l.lotId === lotId);

  if (!lot) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-500">
        <p className="text-lg font-semibold">Lot not found</p>
        <button
          type="button"
          onClick={() => navigate("/inbound")}
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Inbound
        </button>
      </div>
    );
  }

  const totalExpected = lot.items.reduce((s, i) => s + i.expectedQty, 0);
  const totalReceived = lot.items.reduce((s, i) => s + i.receivedQty, 0);
  const totalValue = lot.items.reduce(
    (s, i) => s + i.unitCost * i.receivedQty,
    0
  );

  // QC summary counts per item status
  const qcCounts = {
    pending: lot.items.filter((i) => i.qcStatus === "Pending").length,
    passed: lot.items.filter((i) => i.qcStatus === "Passed").length,
    failed: lot.items.filter((i) => i.qcStatus === "Failed").length,
    quarantine: lot.items.filter((i) => i.qcStatus === "Quarantine").length,
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/inbound")}
            className="mb-1 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={12} />
            Inbound
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Lot Details</h1>
          <p className="text-sm text-slate-500">
            {lot.lotId}
            {lot.poNumber && ` · ${lot.poNumber}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {lot.status === "Pending QC" && (
            <>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition-colors hover:bg-green-100 cursor-pointer"
              >
                <ClipboardCheck size={14} />
                Approve QC
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-100 cursor-pointer"
              >
                <ClipboardX size={14} />
                Reject QC
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => navigate(`/inbound/${lotId}/edit`)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>
      </div>

      {/* ── Lot summary card ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {/* Lot status + creator */}
        <div className="flex items-center justify-between">
          <LotStatusBadge status={lot.status} />
          <span className="text-xs text-slate-400">Created by {lot.createdBy}</span>
        </div>

        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <Field label="Lot ID" value={<span className="font-mono">{lot.lotId}</span>} />
            <Field label="PO Number" value={lot.poNumber} />
            <Field label="Supplier" value={lot.supplier} />
            <Field label="Dock / Location" value={lot.warehouseRef} />
            <Field label="Expected Date" value={formatDate(lot.expectedDate)} />
            <Field label="Received Date" value={formatDate(lot.receivedDate)} />
          </div>
        </Section>

        {lot.qcNote && (
          <Section title="QC Note (Lot Level)">
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
              {lot.qcNote}
            </p>
          </Section>
        )}

        <Section title="Receiving Summary">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
            <Field label="Total SKUs" value={`${lot.items.length} items`} />
            <Field label="Total Expected" value={`${totalExpected} units`} />
            <Field
              label="Total Received"
              value={
                <span className={totalReceived === totalExpected ? "text-emerald-600" : "text-orange-500"}>
                  {totalReceived} units
                </span>
              }
            />
            <Field label="Total Value" value={`$${totalValue.toFixed(2)}`} />
          </div>
        </Section>

        {/* ── QC Summary per item ── */}
        <Section title="QC Status Summary (Per Item)">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Pending */}
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 flex items-center gap-3">
              <span className="text-yellow-500 text-xl">⏳</span>
              <div>
                <p className="text-xl font-bold text-yellow-700">{qcCounts.pending}</p>
                <p className="text-xs font-semibold text-yellow-600">Pending</p>
              </div>
            </div>
            {/* Passed */}
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="text-xl font-bold text-green-700">{qcCounts.passed}</p>
                <p className="text-xs font-semibold text-green-600">Passed</p>
              </div>
            </div>
            {/* Failed */}
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-3">
              <span className="text-red-500 text-xl">✕</span>
              <div>
                <p className="text-xl font-bold text-red-700">{qcCounts.failed}</p>
                <p className="text-xs font-semibold text-red-600">Failed</p>
              </div>
            </div>
            {/* Quarantine */}
            <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 flex items-center gap-3">
              <span className="text-purple-500 text-xl">⚠</span>
              <div>
                <p className="text-xl font-bold text-purple-700">{qcCounts.quarantine}</p>
                <p className="text-xs font-semibold text-purple-600">Quarantine</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ── Pending QC banner ── */}
      {lot.status === "Pending QC" && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 flex items-start gap-3">
          <span className="mt-0.5 text-yellow-500 text-lg">⏳</span>
          <div>
            <p className="text-sm font-semibold text-yellow-800">Awaiting QC Inspection</p>
            <p className="mt-0.5 text-xs text-yellow-700">
              This lot is pending quality control. Inspect each item below and update
              its QC status, then use "Approve QC" or "Reject QC" to finalize the lot.
            </p>
          </div>
        </div>
      )}

      {/* ── Items table ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-400">
            Items in this Lot
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">{lot.items.length} line(s)</span>
        </div>
        <DataTable columns={itemColumns} data={lot.items} defaultPageSize={20} />
      </div>
    </div>
  );
}
