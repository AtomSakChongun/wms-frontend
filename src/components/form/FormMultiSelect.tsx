interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function FormMultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "No options available",
  className,
  error,
}: Props) {
  const toggleOption = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((option) => option !== selectedValue));
      return;
    }

    onChange([...value, selectedValue]);
  };

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <label className="text-sm font-semibold text-slate-700">{label}</label>

      <div className="rounded-xl border border-slate-300 bg-white p-3">
        {options.length === 0 ? (
          <p className="text-sm text-slate-500">{placeholder}</p>
        ) : (
          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
