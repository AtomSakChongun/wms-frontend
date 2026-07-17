import { useState, useEffect } from "react";
import { Search, RotateCcw, X, SlidersHorizontal } from "lucide-react";
import { FormInput, FormMultiSelect } from "@/components/form";

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

export default function InventoryFilters({
  appliedFilters,
  onApplyFilters,
  categoriesList,
  statusesList,
}: ProductFiltersProps) {
  // Local temporary states
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

  // Sync local states when appliedFilters changes (e.g. from badge remove or reset)
  useEffect(() => {
    setTempSearchQuery(appliedFilters.searchQuery);
    setTempSelectedCategories(appliedFilters.categories);
    setTempSelectedStatuses(appliedFilters.statuses);
    setTempStockFilters(appliedFilters.stockFilters);
  }, [appliedFilters]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyFilters({
      searchQuery: tempSearchQuery,
      categories: tempSelectedCategories,
      statuses: tempSelectedStatuses,
      stockFilters: tempStockFilters,
    });
  };

  const handleRemoveCategory = (catToRemove: string) => {
    const updated = tempSelectedCategories.filter((c) => c !== catToRemove);
    setTempSelectedCategories(updated);
    onApplyFilters({
      searchQuery: tempSearchQuery,
      categories: updated,
      statuses: tempSelectedStatuses,
      stockFilters: tempStockFilters,
    });
  };

  const handleRemoveStatus = (statusToRemove: string) => {
    const updated = tempSelectedStatuses.filter((s) => s !== statusToRemove);
    setTempSelectedStatuses(updated);
    onApplyFilters({
      searchQuery: tempSearchQuery,
      categories: tempSelectedCategories,
      statuses: updated,
      stockFilters: tempStockFilters,
    });
  };

  const handleRemoveStockFilter = (filterToRemove: string) => {
    const updated = tempStockFilters.filter((f) => f !== filterToRemove);
    setTempStockFilters(updated);
    onApplyFilters({
      searchQuery: tempSearchQuery,
      categories: tempSelectedCategories,
      statuses: tempSelectedStatuses,
      stockFilters: updated,
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
    onApplyFilters({
      searchQuery: "",
      categories: [],
      statuses: [],
      stockFilters: [],
    });
  };

  const hasActiveFilters =
    appliedFilters.searchQuery !== "" ||
    appliedFilters.categories.length > 0 ||
    appliedFilters.statuses.length > 0 ||
    appliedFilters.stockFilters.length > 0;

  // Map stock filter ID to display label
  const getStockFilterLabel = (val: string) => {
    const option = stockOptions.find((opt) => opt.id === val);
    return option ? option.label : val;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 transition-all duration-200 hover:shadow-md">
      {/* Header section with Title and Counter */}
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
              Search and filter master products
            </p>
          </div>
        </div>
      </div>

      {/* Main Filter Form */}
      <form onSubmit={handleSearchSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {/* Search Query Input */}
          <div>
            <TextField
              label="Search"
              placeholder="SKU, Name, Barcode..."
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              size="small"
              sx={customTextFieldSx}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <Search
                      size={18}
                      className="text-slate-400 mr-2 shrink-0"
                    />
                  ),
                  endAdornment: tempSearchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      aria-label="Clear search input"
                    >
                      <X size={18} />
                    </button>
                  ),
                },
              }}
            />
          </div>

          {/* Category Selector (Multi-select Autocomplete) */}
          <div>
            <Autocomplete
              multiple
              id="category"
              options={categoriesList}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              value={tempSelectedCategories}
              onChange={(_, newValue) => setTempSelectedCategories(newValue)}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key || option} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                      sx={{
                        color: "#cbd5e1",
                        "&.Mui-checked": {
                          color: "#4f46e5",
                        },
                      }}
                    />
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="Select Categories"
                  size="small"
                  sx={customTextFieldSx}
                />
              )}
            />
          </div>

          {/* Status Selector (Multi-select Autocomplete) */}
          <div>
            <Autocomplete
              multiple
              id="status"
              options={statusesList}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              value={tempSelectedStatuses}
              onChange={(_, newValue) => setTempSelectedStatuses(newValue)}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key || option} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                      sx={{
                        color: "#cbd5e1",
                        "&.Mui-checked": {
                          color: "#4f46e5",
                        },
                      }}
                    />
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  placeholder="Select Statuses"
                  size="small"
                  sx={customTextFieldSx}
                />
              )}
            />
          </div>

          {/* Stock Level Selector (Multi-select Autocomplete) */}
          <div>
            <Autocomplete
              multiple
              id="stock"
              options={stockOptions}
              disableCloseOnSelect
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={stockOptions.filter((opt) =>
                tempStockFilters.includes(opt.id),
              )}
              onChange={(_, newValue) =>
                setTempStockFilters(newValue.map((v) => v.id))
              }
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key || option.id} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                      sx={{
                        color: "#cbd5e1",
                        "&.Mui-checked": {
                          color: "#4f46e5",
                        },
                      }}
                    />
                    {option.label}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stock Level"
                  placeholder="Select Levels"
                  size="small"
                  sx={customTextFieldSx}
                />
              )}
            />
          </div>
        </div>

        {/* Action Buttons Row */}
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
