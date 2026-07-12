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
    header: "ชื่อสินค้า",
  },
  {
    accessorKey: "category",
    header: "หมวดหมู่",
  },
  {
    accessorKey: "barcode",
    header: "BARCODE",
  },
  {
    accessorKey: "cost",
    header: "ราคาต่อหน่วย",
    cell: ({ row }) =>
      `$${row.original.cost.toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "จำนวน",
  },
  {
    accessorKey: "status",
    header: "สถาณะ",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} />
    ),
  }
];