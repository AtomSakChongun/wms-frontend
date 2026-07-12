import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn;
  suffix?: string;
  prefix?: string;
}

export default function FormNumberInput({
  label,
  register,
  prefix,
  suffix,
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold">
        {label}
      </label>

      <div className="relative">

        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            {prefix}
          </span>
        )}

        <input
          type="number"
          {...register}
          {...props}
          className={`
            h-10
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            ${prefix ? "pl-10" : "pl-4"}
            ${suffix ? "pr-10" : "pr-4"}
          `}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}