import type { ColumnDef } from "@tanstack/react-table";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { InboundLot } from "./types";
import StatusBadge from "@/components/table/StatusBadge";

export const lotColumns: ColumnDef<InboundLot>[] = [
  { accessorKey: "lotId", header: "LOT ID", cell: ({ row }) => <span className="font-mono text-sm font-semibold text-slate-800">{row.original.lotId}</span> },
  { accessorKey: "poNumber", header: "PO NUMBER", cell: ({ row }) => row.original.poNumber ?? <span className="text-slate-400">—</span>, meta: { hideOnMobile: true } },
  { accessorKey: "supplier", header: "SUPPLIER" },
  { accessorKey: "receivedDate", header: "RECEIVED", cell: ({ row }) => new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.original.receivedDate)), meta: { hideOnMobile: true } },
  { accessorKey: "warehouseRef", header: "LOCATION", meta: { hideOnMobile: true } },
  { id: "itemCount", header: "ITEMS", cell: ({ row }) => `${row.original.items.length} SKU` },
  { accessorKey: "status", header: "STATUS", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { id: "actions", header: "ACTIONS", cell: ({ row }) => <div className="flex items-center gap-2"><Link to={`/inbound/${row.original.lotId}`} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" title="View"><Eye size={15} /></Link><Link to={`/inbound/${row.original.lotId}/edit`} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" title="Edit"><SquarePen size={15} /></Link><button type="button" className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete"><Trash2 size={15} /></button></div> },
];
