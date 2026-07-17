import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import StatusBadge from "@/components/table/StatusBadge";
import { inboundLots } from "../inbound/inboundMockData";
import type { LotItem } from "../inbound/types";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800">
        {value ?? "—"}
      </span>
    </div>
  );
}
function FormSelect({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
      <span className="font-mono text-xs font-semibold">
        {row.original.sku}
      </span>
    ),
  },
  { accessorKey: "productName", header: "PRODUCT NAME" },
  {
    id: "quantity",
    header: "EXP / RCV",
    cell: ({ row }) => (
      <span
        className={
          row.original.expectedQty === row.original.receivedQty
            ? "text-emerald-600 text-xs font-semibold"
            : "text-orange-500 text-xs font-semibold"
        }
      >
        {row.original.expectedQty} / {row.original.receivedQty}{" "}
        {row.original.unit}
      </span>
    ),
  },
  {
    accessorKey: "unitCost",
    header: "UNIT COST",
    cell: ({ row }) => `฿${row.original.unitCost.toLocaleString()}`,
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: "qcStatus",
    header: "QC STATUS",
    cell: ({ row }) => (
      <StatusBadge
        status={
          row.original.qcStatus === "Passed"
            ? "QC Passed"
            : row.original.qcStatus === "Failed"
              ? "QC Failed"
              : row.original.qcStatus === "Pending"
                ? "Pending QC"
                : "Quarantine"
        }
      />
    ),
  },
];

export default function InboundDetailPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const navigate = useNavigate();
  const lot = inboundLots.find((value) => value.lotId === lotId);
  if (!lot)
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-500">
        <p className="text-lg font-semibold">Inbound lot not found</p>
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
  const totalExpected = lot.items.reduce(
    (sum, item) => sum + item.expectedQty,
    0,
  );
  const totalReceived = lot.items.reduce(
    (sum, item) => sum + item.receivedQty,
    0,
  );
  const totalValue = lot.items.reduce(
    (sum, item) => sum + item.unitCost * item.receivedQty,
    0,
  );
  const date = (value: string) =>
    new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/inbound")}
            className="mb-1 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600"
          >
            <ArrowLeft size={12} />
            Inbound
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Inbound Lot Details
          </h1>
          <p className="text-sm text-slate-500">
            {lot.lotId} · {lot.supplier}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(`/inbound/${lot.lotId}/edit`)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Pencil size={14} />
            Edit Lot
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-600">
            IN
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{lot.lotId}</h2>
            <p className="mt-0.5 text-sm text-slate-400">
              {lot.poNumber ?? "No purchase order"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={lot.status} />
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {lot.items.length} SKUs
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-8">
        <FormSelect title="Receiving Information">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <Field
              label="Lot ID"
              value={<span className="font-mono">{lot.lotId}</span>}
            />
            <Field label="PO Number" value={lot.poNumber} />
            <Field label="Supplier" value={lot.supplier} />
            <Field label="Dock / Location" value={lot.warehouseRef} />
            <Field label="Expected Date" value={date(lot.expectedDate)} />
            <Field label="Received Date" value={date(lot.receivedDate)} />
          </div>
        </FormSelect>
        <FormSelect title="Receiving Summary">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
            <Field label="Total SKUs" value={`${lot.items.length} items`} />
            <Field label="Expected Quantity" value={`${totalExpected} units`} />
            <Field
              label="Received Quantity"
              value={
                <span
                  className={
                    totalExpected === totalReceived
                      ? "text-emerald-600"
                      : "text-orange-500"
                  }
                >
                  {totalReceived} units
                </span>
              }
            />
            <Field
              label="Receiving Value"
              value={`฿${totalValue.toLocaleString()}`}
            />
          </div>
        </FormSelect>
        {lot.qcNote && (
          <FormSelect title="QC Note">
            <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
              {lot.qcNote}
            </p>
          </FormSelect>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-400">
            Items in this Lot
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <DataTable
          columns={itemColumns}
          data={lot.items}
          defaultPageSize={20}
        />
      </div>
    </div>
  );
}
