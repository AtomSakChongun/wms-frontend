import { Autocomplete, Checkbox, Chip, TextField } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

export default function FormAutocompleteMultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  error,
}: Props) {
  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <Autocomplete
        multiple
        disableCloseOnSelect
        filterSelectedOptions
        options={options}
        value={selectedOptions}
        isOptionEqualToValue={(option, selectedValue) =>
          option.value === selectedValue.value
        }
        getOptionLabel={(option) => option.label}
        onChange={(_, newValue) =>
          onChange(newValue.map((option) => option.value))
        }
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              key={option.value}
              label={option.label}
              {...getTagProps({ index })}
              size="small"
              sx={{
                bgcolor: "rgba(148, 163, 184, 0.16)",
                color: "#0f172a",
                fontWeight: 500,
                borderRadius: "9999px",
                marginRight: 0.5,
                marginTop: 0.5,
                height: 28,
              }}
            />
          ))
        }
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key || option.value} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
                sx={{
                  mr: 1,
                  color: "#cbd5e1",
                  "&.Mui-checked": { color: "#4f46e5" },
                }}
              />
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            size="small"
            error={Boolean(error)}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              sx: {
                borderRadius: "1rem",
                backgroundColor: "#f8fafc",
                fontSize: "0.875rem",
                paddingRight: 1,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                fontSize: "0.875rem",
                "& fieldset": {
                  borderColor: "#e2e8f0",
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4f46e5",
                },
              },
            }}
          />
        )}
        className="w-full"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
