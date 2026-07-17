import { useState, useEffect } from "react";
import { Search, RotateCcw, X, SlidersHorizontal } from "lucide-react";
import { FormInput, FormAutocompleteMultiSelect } from "@/components/form";

export interface AppliedFilters {
  searchQuery: string;
  categories: string[];
  statuses: string[];
  stockFilters: string[];
}

interface ProductFiltersProps {
  appliedFilters: AppliedFilters;
  onApplyFilters: (filters: AppliedFilters) => void;
  categoriesList: string[];
  statusesList: string[];
  filteredCount: number;
  totalCount: number;
}

const stockOptions = [
  { id: "in-stock", label: "In Stock" },
  { id: "low-stock", label: "Low Stock (<= 20)" },
  { id: "out-of-stock", label: "Out of Stock" },
];

export default function ProductFilters({
  appliedFilters,
  onApplyFilters,
  categoriesList,
  statusesList,
  filteredCount,
  totalCount,
}: ProductFiltersProps) {
  const [tempSearchQuery, setTempSearchQuery] = useState(
    appliedFilters.searchQuery,
  );
  const [tempSelectedCategories, setTempSelectedCategories] = useState<
    string[]
  >(appliedFilters.categories);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<string[]>(
    appliedFilters.statuses,
  );
  const [tempStockFilters, setTempStockFilters] = useState<string[]>(
    appliedFilters.stockFilters,
  );

  useEffect(() => {
    setTempSearchQuery(appliedFilters.searchQuery);
    setTempSelectedCategories(appliedFilters.categories);
    setTempSelectedStatuses(appliedFilters.statuses);
    setTempStockFilters(appliedFilters.stockFilters);
  }, [appliedFilters]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onApplyFilters({
      searchQuery: tempSearchQuery,
      categories: tempSelectedCategories,
      statuses: tempSelectedStatuses,
      stockFilters: tempStockFilters,
    });
  };

  const handleClearSearch = () => {
    setTempSearchQuery("");
    onApplyFilters({
      searchQuery: "",
      categories: tempSelectedCategories,
      statuses: tempSelectedStatuses,
      stockFilters: tempStockFilters,
    });
  };

  const handleResetAll = () => {
    setTempSearchQuery("");
    setTempSelectedCategories([]);
    setTempSelectedStatuses([]);
    setTempStockFilters([]);
    onApplyFilters({
      searchQuery: "",
      categories: [],
      statuses: [],
      stockFilters: [],
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Filter Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Search and filter master products · {filteredCount} / {totalCount}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={18} />
            </span>
            <FormInput
              label="Search"
              placeholder="SKU, Name, Barcode..."
              value={tempSearchQuery}
              onChange={(event) => setTempSearchQuery(event.target.value)}
              className="pl-11 pr-11"
            />
            {tempSearchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-10 text-slate-400 hover:text-slate-600"
                aria-label="Clear search input"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>

          <FormAutocompleteMultiSelect
            label="Category"
            placeholder="Search categories"
            options={categoriesList.map((item) => ({
              label: item,
              value: item,
            }))}
            value={tempSelectedCategories}
            onChange={setTempSelectedCategories}
          />

          <FormAutocompleteMultiSelect
            label="Status"
            placeholder="Search statuses"
            options={statusesList.map((item) => ({ label: item, value: item }))}
            value={tempSelectedStatuses}
            onChange={setTempSelectedStatuses}
          />

          <FormAutocompleteMultiSelect
            label="Stock Level"
            placeholder="Search stock levels"
            options={stockOptions.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            value={tempStockFilters}
            onChange={setTempStockFilters}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset All
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl text-xs shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <Search size={14} />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
