import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { InboundLot } from "./types";
import { useDeleteInbound } from "./hooks/useInbound";
import StatusBadge from "@/components/table/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function ActionCell({ id, lotId }: { id: string; lotId: string }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteInboundLot, isPending } = useDeleteInbound();

  const handleDelete = async () => {
    try {
      await deleteInboundLot(id);
      toast.success(`Lot "${lotId}" deleted successfully`);
      setOpen(false);
    } catch {
      toast.error(`Failed to delete "${lotId}"`);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          to={`/inbound/${id}`}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="View"
        >
          <Eye size={15} />
        </Link>
        <Link
          to={`/inbound/${id}/edit`}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Edit"
        >
          <SquarePen size={15} />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Inbound Lot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">"{lotId}"</span>?
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

export const lotColumns: ColumnDef<InboundLot>[] = [
  { accessorKey: "lotId", header: "LOT ID", cell: ({ row }) => <span className="font-bold text-indigo-600">{row.original.lotId}</span> },
  { accessorKey: "poNumber", header: "PO NUMBER", cell: ({ row }) => row.original.poNumber ?? <span className="text-slate-400">—</span>, meta: { hideOnMobile: true } },
  { accessorKey: "supplier", header: "SUPPLIER" },
  { accessorKey: "receivedDate", header: "RECEIVED", cell: ({ row }) => new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.original.receivedDate)), meta: { hideOnMobile: true } },
  { accessorKey: "receivingLocation", header: "LOCATION", meta: { hideOnMobile: true } },
  { id: "itemCount", header: "ITEMS", cell: ({ row }) => `${row.original.items.length} SKU` },
  { accessorKey: "qcStatus", header: "STATUS", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { id: "actions", header: "ACTIONS", cell: ({ row }) => <ActionCell id={row.original._id} lotId={row.original.lotId} /> },
];
