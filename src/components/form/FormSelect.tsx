import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  name: string;
  options: Option[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export default function FormSelect({
  label,
  name,
  options,
  required,
  error,
  placeholder = "Select...",
}: Props) {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 data-[size=default]:h-10"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

    </div>
  );
}
