import { PackagePlus } from "lucide-react";

export default function ProductHeader() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <PackagePlus className="h-8 w-8 shrink-0 text-indigo-600" />

        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            Create Product
          </h1>

          <p className="text-sm text-slate-500">
            Create a new product in your warehouse.
          </p>
        </div>
      </div>
    </div>
  );
}