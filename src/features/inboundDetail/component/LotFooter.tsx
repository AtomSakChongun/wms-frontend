interface Props {
  loading?: boolean;
  onCancel?: () => void;
}

export default function LotFooter({ loading, onCancel }: Props) {
  return (
    <div className="sticky bottom-0 flex flex-col-reverse gap-3 md:flex-row md:justify-end rounded-2xl border bg-white p-5 shadow-lg">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] w-full md:w-auto border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
      >
        {loading ? "Saving…" : "✓ Create Lot (Pending QC)"}
      </button>
    </div>
  );
}
