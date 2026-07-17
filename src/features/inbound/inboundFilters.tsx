import { useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface AppliedFilters { searchQuery: string; suppliers: string[]; statuses: string[]; locations: string[]; }
interface InboundFiltersProps { appliedFilters: AppliedFilters; onApplyFilters: (filters: AppliedFilters) => void; suppliersList: string[]; statusesList: string[]; locationsList: string[]; }

const textFieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#f8fafc", fontSize: "0.875rem", "& fieldset": { borderColor: "#e2e8f0" }, "&:hover fieldset": { borderColor: "#cbd5e1" }, "&.Mui-focused fieldset": { borderColor: "#4f46e5" } }, "& .MuiInputLabel-root": { color: "#64748b", fontSize: "0.875rem", "&.Mui-focused": { color: "#4f46e5" } } };

function MultiSelect({ id, label, placeholder, options, value, onChange }: { id: string; label: string; placeholder: string; options: string[]; value: string[]; onChange: (value: string[]) => void }) {
  return <Autocomplete multiple id={id} options={options} disableCloseOnSelect getOptionLabel={(option) => option} value={value} onChange={(_, newValue) => onChange(newValue)} renderOption={(props, option, { selected }) => { const { key, ...optionProps } = props; return <li key={key || option} {...optionProps}><Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} sx={{ mr: 1, color: "#cbd5e1", "&.Mui-checked": { color: "#4f46e5" } }} />{option}</li>; }} renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} size="small" sx={textFieldSx} />} />;
}

export default function InboundFilters({ appliedFilters, onApplyFilters, suppliersList, statusesList, locationsList }: InboundFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(appliedFilters.searchQuery);
  const [suppliers, setSuppliers] = useState(appliedFilters.suppliers);
  const [statuses, setStatuses] = useState(appliedFilters.statuses);
  const [locations, setLocations] = useState(appliedFilters.locations);
  const apply = (event?: React.FormEvent) => { event?.preventDefault(); onApplyFilters({ searchQuery, suppliers, statuses, locations }); };
  const reset = () => { setSearchQuery(""); setSuppliers([]); setStatuses([]); setLocations([]); onApplyFilters({ searchQuery: "", suppliers: [], statuses: [], locations: [] }); };

  return <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 transition-all duration-200 hover:shadow-md">
    <div className="flex items-center gap-2 pb-1"><div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><SlidersHorizontal size={18} /></div><div><h2 className="text-sm font-semibold text-slate-900">Filter Inbound Lots</h2><p className="text-xs text-slate-500">Search and filter receiving lots awaiting QC</p></div></div>
    <form onSubmit={apply} className="space-y-5"><div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
      <TextField label="Search" placeholder="Lot ID, PO, SKU..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} size="small" sx={textFieldSx} fullWidth slotProps={{ input: { startAdornment: <Search size={18} className="text-slate-400 mr-2 shrink-0" />, endAdornment: searchQuery && <button type="button" onClick={() => { setSearchQuery(""); onApplyFilters({ searchQuery: "", suppliers, statuses, locations }); }} className="text-slate-400 hover:text-slate-600" aria-label="Clear search"><X size={18} /></button> } }} />
      <MultiSelect id="inbound-supplier" label="Supplier" placeholder="Select Suppliers" options={suppliersList} value={suppliers} onChange={setSuppliers} />
      <MultiSelect id="inbound-status" label="QC Status" placeholder="Select Statuses" options={statusesList} value={statuses} onChange={setStatuses} />
      <MultiSelect id="inbound-location" label="Receiving Location" placeholder="Select Locations" options={locationsList} value={locations} onChange={setLocations} />
    </div><div className="flex items-center justify-end gap-3 pt-1"><button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"><RotateCcw size={14} />Reset All</button><button type="submit" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl text-xs shadow-sm hover:shadow transition-all duration-200 cursor-pointer"><Search size={14} />Search</button></div></form>
  </div>;
}
