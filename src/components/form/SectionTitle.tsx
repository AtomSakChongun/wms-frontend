import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function SectionTitle({
  title,
  children,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-8 flex items-center gap-4">

        <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </h2>

        <div className="h-px flex-1 bg-slate-200" />

      </div>

      {children}

    </section>
  );
}