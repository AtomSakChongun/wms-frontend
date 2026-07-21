import { useState } from "react";
import { Search, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { FormInput, FormAutocompleteMultiSelect } from "@/components/form";
import type { InboundFiltersProps } from "./types";

export default function InboundFilters({
  appliedFilters,
  onApplyFilters,
  suppliersList,
  statusesList,
  locationsList,
}: InboundFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(appliedFilters.searchQuery);
  const [suppliers, setSuppliers] = useState(appliedFilters.suppliers);
  const [statuses, setStatuses] = useState(appliedFilters.statuses);
  const [locations, setLocations] = useState(appliedFilters.locations);
  const apply = (event?: React.FormEvent) => {
    event?.preventDefault();
    onApplyFilters({ searchQuery, suppliers, statuses, locations });
  };
  const reset = () => {
    setSearchQuery("");
    setSuppliers([]);
    setStatuses([]);
    setLocations([]);
    onApplyFilters({
      searchQuery: "",
      suppliers: [],
      statuses: [],
      locations: [],
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-2 pb-1">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <SlidersHorizontal size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Filter Inbound Lots
          </h2>
          <p className="text-xs text-slate-500">
            Search and filter receiving lots awaiting QC
          </p>
        </div>
      </div>
      <form onSubmit={apply} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="relative">
            <FormInput
              label="Search"
              placeholder="Lot ID, PO, SKU..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  onApplyFilters({
                    searchQuery: "",
                    suppliers,
                    statuses,
                    locations,
                  });
                }}
                className="absolute right-3 top-10 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
          <FormAutocompleteMultiSelect
            label="Supplier"
            placeholder="Select Suppliers"
            options={suppliersList.map((item) => ({
              label: item,
              value: item,
            }))}
            value={suppliers}
            onChange={setSuppliers}
          />
          <FormAutocompleteMultiSelect
            label="QC Status"
            placeholder="Select Statuses"
            options={statusesList.map((item) => ({ label: item, value: item }))}
            value={statuses}
            onChange={setStatuses}
          />
          <FormAutocompleteMultiSelect
            label="Receiving Location"
            placeholder="Select Locations"
            options={locationsList.map((item) => ({
              label: item,
              value: item,
            }))}
            value={locations}
            onChange={setLocations}
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={reset}
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
