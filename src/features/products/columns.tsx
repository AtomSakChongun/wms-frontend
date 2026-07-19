import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import StatusBadge from "@/components/table/StatusBadge";

export interface Product {
  _id : string
  sku: string;
  name: string;
  category: string;
  barcode: string;
  barcodeType?: string;
  cost: number;
  sellingPrice?: number;
  taxRate?: number;
  stock: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  leadTime?: number;
  shelfLife?: number;
  status: string;
  unit?: string;
  description?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  supplier?: string;
  supplierSku?: string;
}

function ActionCell({ sku }: { sku: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => navigate(`/products/${sku}`)}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        title="View"
      >
        <Eye size={15} />
      </button>
      <button
        type="button"
        onClick={() => navigate(`/products/${sku}/edit`)}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Edit"
      >
        <SquarePen size={15} />
      </button>
      <button
        type="button"
        className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "PRODUCT NAME",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "barcode",
    header: "BARCODE",
  },
  {
    accessorKey: "cost",
    header: "UNIT COST",
    cell: ({ row }) =>
      `$${row.original.cost.toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "STOCK",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} />
    ),
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => <ActionCell sku={row.original._id} />,
  },
];