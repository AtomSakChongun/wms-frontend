import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./columns";
import { useProducts } from "./hooks/useProducts";
import ProductFilters, { type AppliedFilters } from "./ProductFilters";
import { StatCard } from "@/components/ui/StatCard";
import { Download, Upload, Plus, Loader2 } from "lucide-react";

const EMPTY_FILTERS: AppliedFilters = {
  searchQuery: "",
  categories: [],
  statuses: [],
  stockFilters: [],
};

export default function ProductPage() {
  const navigate = useNavigate();

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(EMPTY_FILTERS);

  // Fetch products from API with query params — refetches whenever filters change
  const { data: products = [], isLoading, isError, error } = useProducts(appliedFilters);

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.status === "In Stock").length;
  const lowOutOfStock = products.filter(
    (p) => p.status === "Low Stock" || p.status === "Out of Stock"
  ).length;
  const discontinuedProducts = products.filter((p) => p.status === "Discontinued").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Master product catalog · {totalProducts} items
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border hover:bg-muted text-foreground font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Download size={15} />
            Export
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border hover:bg-muted text-foreground font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Upload size={15} />
            Import
          </button>
          <button
            type="button"
            onClick={() => navigate("/products/new")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={totalProducts} label="Total Products" variant="default" />
        <StatCard value={inStockProducts} label="In Stock" variant="success" />
        <StatCard value={lowOutOfStock} label="Low / Out Stock" variant="warning" />
        <StatCard value={discontinuedProducts} label="Discontinued" variant="muted" />
      </div>

      {/* Filters */}
      <ProductFilters
        appliedFilters={appliedFilters}
        onApplyFilters={setAppliedFilters}
        filteredCount={totalProducts}
        totalCount={totalProducts}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-sm">Loading products...</span>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load products: {(error as Error)?.message ?? "Unknown error"}
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <DataTable columns={columns} data={products} />
      )}
    </div>
  );
}
