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
  label?: string;
  name?: string;
  options: Option[];
  required?: boolean;
  error?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export default function FormSelect({
  label,
  name,
  options,
  required,
  error,
  placeholder = "Select...",
  value,
  onValueChange,
  className,
}: Props) {
  const formContext = useFormContext();
  const control = name ? formContext?.control : undefined;

  const renderSelect = (
    selectedValue: string | undefined,
    handleChange: (value: string) => void,
  ) => (
    <Select value={selectedValue ?? ""} onValueChange={handleChange}>
      <SelectTrigger
        className={`h-10 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 data-[size=default]:h-10 ${className ?? ""}`}
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
  );

  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      ) : null}

      {control && name ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const handleChange = (value: string) => {
              field.onChange(value);
              if (onValueChange) onValueChange(value);
            };

            return renderSelect(field.value, handleChange);
          }}
        />
      ) : (
        renderSelect(value, onValueChange ?? (() => {}))
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
