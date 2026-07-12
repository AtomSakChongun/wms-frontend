import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./columns";
import { products } from "./mock";
import InventoryFilters, { type AppliedFilters } from "./inventoryFilters";
import { StatCard } from "@/components/ui/StatCard";
import { Download, Upload, Plus } from "lucide-react";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    searchQuery: "",
    categories: [],
    statuses: [],
    stockFilters: [],
  });

  // Dynamically extract categories from mock data
  const categoriesList = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, []);

  // Dynamically extract statuses from mock data
  const statusesList = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.status))).sort();
  }, []);

  // Filter products based on active criteria
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = appliedFilters.searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.barcode.toLowerCase().includes(query);

      const matchesCategory =
        appliedFilters.categories.length === 0 ||
        appliedFilters.categories.includes(product.category);

      const matchesStatus =
        appliedFilters.statuses.length === 0 ||
        appliedFilters.statuses.includes(product.status);

      let matchesStock = true;
      if (appliedFilters.stockFilters.length > 0) {
        matchesStock = appliedFilters.stockFilters.some((filter) => {
          if (filter === "in-stock") {
            return product.stock > 0;
          } else if (filter === "low-stock") {
            return product.stock > 0 && product.stock <= 20;
          } else if (filter === "out-of-stock") {
            return product.stock === 0;
          }
          return false;
        });
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });
  }, [appliedFilters]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const lowOutOfStock = products.filter(
    (p) => p.status === "Low Stock" || p.status === "Out of Stock"
  ).length;
  const inactiveProducts = products.filter((p) => p.status === "Inactive").length;

  const handleApplyFilters = (newFilters: AppliedFilters) => {
    setAppliedFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Master product catalog · {products.length} items
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
        <StatCard value={activeProducts} label="Active" variant="success" />
        <StatCard value={lowOutOfStock} label="Low / Out Stock" variant="warning" />
        <StatCard value={inactiveProducts} label="Inactive" variant="muted" />
      </div>

      <InventoryFilters
        appliedFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        categoriesList={categoriesList}
        statusesList={statusesList}
        filteredCount={filteredProducts.length}
        totalCount={products.length}
      />

      <DataTable
        columns={columns}
        data={filteredProducts}
      />
    </div>
  );
}