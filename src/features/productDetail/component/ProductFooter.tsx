interface Props {
  loading?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function ProductFooter({ loading, onCancel, isEdit = false }: Props) {
  return (
    <div className="sticky bottom-0 flex flex-col-reverse gap-3 md:flex-row md:justify-end rounded-2xl border bg-white p-5 shadow-lg">

      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer w-full md:w-auto justify-center min-h-[44px]"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer w-full md:w-auto justify-center min-h-[44px]"
      >
        {loading ? "Saving..." : isEdit ? "✓ Save Changes" : "✓ Create Product"}
      </button>

    </div>
  );
}
