import type { LotStatus } from "./types";

interface Props {
  status: LotStatus;
}

const styles: Record<LotStatus, string> = {
  "Pending QC": "bg-yellow-100 text-yellow-700",
  "QC Passed": "bg-green-100 text-green-700",
  "QC Failed": "bg-red-100 text-red-700",
  "Putaway": "bg-indigo-100 text-indigo-700",
  "Cancelled": "bg-slate-100 text-slate-500",
};

export function LotStatusBadge({ status }: Props) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
