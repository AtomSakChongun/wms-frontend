import type { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/table/StatusBadge";
import type { QcItemReview } from "./types";

export const qcItemColumns: ColumnDef<QcItemReview>[] = [
  {
    accessorKey: "lineNo",
    header: "Line",
    cell: ({ row }) => (
      <div className="w-12 font-medium">{row.getValue("lineNo")}</div>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div className="font-medium">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.getValue("productName")}</div>
    ),
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => (
      <div className="text-xs font-mono">{row.getValue("barcode")}</div>
    ),
  },
  {
    accessorKey: "receivedQty",
    header: "Qty",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.getValue("receivedQty")} {row.original.unit}
      </div>
    ),
  },
  {
    accessorKey: "manufacturerLotNo",
    header: "Mfr Lot No",
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue("manufacturerLotNo") || "-"}</div>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry",
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue("expiryDate") || "-"}</div>
    ),
  },
  {
    accessorKey: "qcStatus",
    header: "QC Status",
    cell: ({ row }) => {
      const status = row.getValue("qcStatus") as string;
      const statusMap: Record<string, { label: string; color: string }> = {
        Pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
        Passed: { label: "Passed", color: "bg-green-100 text-green-800" },
        Failed: { label: "Failed", color: "bg-red-100 text-red-800" },
        Quarantine: {
          label: "Quarantine",
          color: "bg-orange-100 text-orange-800",
        },
      };
      const config = statusMap[status] || statusMap.Pending;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "qcNote",
    header: "Note",
    cell: ({ row }) => (
      <div className="text-xs max-w-xs truncate">
        {row.getValue("qcNote") || "-"}
      </div>
    ),
  },
];

export const qcLotListColumns: ColumnDef<any>[] = [
  {
    accessorKey: "lotId",
    header: "Lot ID",
    cell: ({ row }) => (
      <div className="font-bold text-indigo-600">{row.getValue("lotId")}</div>
    ),
  },
  {
    accessorKey: "poNumber",
    header: "PO Number",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("poNumber") || "-"}</div>
    ),
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("supplier")}</div>
    ),
  },
  {
    accessorKey: "warehouseRef",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("warehouseRef")}</div>
    ),
  },
  {
    accessorKey: "receivedDate",
    header: "Received Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("receivedDate") as string);
      return (
        <div className="text-sm">
          {date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("status") as string} />
    ),
  },
  {
    accessorKey: "itemsCount",
    header: "Items",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-center">
        {row.getValue("itemsCount")}
      </div>
    ),
  },
  {
    id: "pendingItems",
    header: "Pending",
    cell: ({ row }) => {
      const pendingCount = row.original.items.filter(
        (item: any) => item.qcStatus === "Pending",
      ).length;
      return (
        <div
          className={`text-sm font-medium text-center px-2 py-1 rounded ${
            pendingCount > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {pendingCount}
        </div>
      );
    },
  },
];
