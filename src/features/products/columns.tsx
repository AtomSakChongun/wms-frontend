import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Eye, SquarePen, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/table/StatusBadge";
import { useDeleteProduct } from "./hooks/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface Product {
  _id: string;
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

function ActionCell({ id, name }: { id: string; name: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      toast.success(`"${name}" deleted successfully`);
      setOpen(false);
    } catch {
      toast.error(`Failed to delete "${name}"`);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(`/products/${id}`)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="View"
        >
          <Eye size={15} />
        </button>
        <button
          type="button"
          onClick={() => navigate(`/products/${id}/edit`)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Edit"
        >
          <SquarePen size={15} />
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Confirm delete dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">"{name}"</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
    cell: ({ row }) => `$${row.original.cost.toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "STOCK",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => (
      <ActionCell id={row.original._id} name={row.original.name} />
    ),
  },
];
