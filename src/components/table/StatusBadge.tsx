interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  const colors = {
    Active:
      "bg-green-100 text-green-700",

    "Low Stock":
      "bg-yellow-100 text-yellow-700",

    "Out of Stock":
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        colors[status as keyof typeof colors]
      }`}
    >
      {status}
    </span>
  );
}