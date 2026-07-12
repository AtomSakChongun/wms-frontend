import type { ItemQcStatus } from "./types";

interface Props {
  status: ItemQcStatus;
}

const styles: Record<ItemQcStatus, string> = {
  Pending:    "bg-yellow-100 text-yellow-700",
  Passed:     "bg-green-100 text-green-700",
  Failed:     "bg-red-100 text-red-700",
  Quarantine: "bg-purple-100 text-purple-700",
};

const icons: Record<ItemQcStatus, string> = {
  Pending:    "⏳",
  Passed:     "✓",
  Failed:     "✕",
  Quarantine: "⚠",
};

export function ItemQcStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span>{icons[status]}</span>
      {status}
    </span>
  );
}
