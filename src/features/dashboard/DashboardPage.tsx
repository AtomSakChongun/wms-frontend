import { StatCard } from "@/components/ui/StatCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-500">Welcome to Fruit WMS</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={120} label="Total Products" variant="default" />
        <StatCard value={98} label="Active" variant="success" />
        <StatCard value={15} label="Low / Out of Stock" variant="warning" />
        <StatCard value={7} label="Inactive" variant="muted" />
      </div>
    </div>
  );
}