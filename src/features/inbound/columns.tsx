import type { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/table/StatusBadge";

export interface Product {
  sku: string;
  name: string;
  category: string;
  barcode: string;
  cost: number;
  stock: number;
  status: string;
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
  }
];