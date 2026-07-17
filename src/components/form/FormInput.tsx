import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  error?: string;
}

export default function FormInput({
  label,
  required,
  register,
  error,
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        {...register}
        {...props}
        className="
        h-10
        w-full
        rounded-xl
        border
        border-slate-300
        bg-slate-50
        px-4
        text-sm
        outline-none
        transition
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-200
        "
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
