import { cn } from "@/utils/cn";

type StatCardVariant = "default" | "success" | "warning" | "muted";

interface StatCardProps {
  value: number | string;
  label: string;
  variant?: StatCardVariant;
  className?: string;
}

const variantStyles: Record<StatCardVariant, string> = {
  default: "text-foreground",
  success: "text-emerald-600",
  warning: "text-orange-500",
  muted: "text-muted-foreground",
};

export function StatCard({
  value,
  label,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-border bg-card px-5 py-4",
        className
      )}
    >
      <span className={cn("text-2xl font-bold", variantStyles[variant])}>
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
