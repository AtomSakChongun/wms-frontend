import type { TextareaHTMLAttributes } from "react";
import  type { UseFormRegisterReturn } from "react-hook-form";

interface Props
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  register: UseFormRegisterReturn;
  required?: boolean;
}

export default function FormTextarea({
  label,
  register,
  required,
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold">

        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}

      </label>

      <textarea
        {...register}
        {...props}
        className="
        min-h-36
        w-full
        rounded-xl
        border
        border-slate-300
        p-4
        "
      />

    </div>
  );
}