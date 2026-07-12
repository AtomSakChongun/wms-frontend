import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { products } from "./mock";
import StatusBadge from "@/components/table/StatusBadge";

// ─── Field display helpers ───────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800">{value ?? "—"}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.sku === sku);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-500">
        <p className="text-lg font-semibold">Product not found</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Products
        </button>
      </div>
    );
  }

  // Avatar initials from product name
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const dimensionsText =
    product.length && product.width && product.height
      ? `${product.length} × ${product.width} × ${product.height} cm`
      : "—";

  const shelfLifeText =
    !product.shelfLife || product.shelfLife === 0
      ? "Unlimited"
      : `${product.shelfLife} days`;

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mb-1 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={12} />
            Products
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Product Details</h1>
          <p className="text-sm text-slate-500">
            {product.sku} · {product.category}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/products/${sku}/edit`)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Pencil size={14} />
            Edit Product
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {/* ── Identity card ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          {/* Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-600">
            {initials}
          </div>

          {/* Name / SKU / badges */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {product.name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">{product.sku}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={product.status} />
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {product.category}
              </span>
              {product.unit && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {product.unit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Description
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>

      {/* ── Product Identity ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <Section title="Product Identity">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <Field label="SKU" value={product.sku} />
            <Field label="Status" value={<StatusBadge status={product.status} />} />
            <Field label="Category" value={product.category} />
            <Field label="Unit of Measure" value={product.unit} />
          </div>
        </Section>

        {/* ── Barcode ── */}
        {(product.barcode || product.barcodeType) && (
          <Section title="Barcode & Identification">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Barcode" value={product.barcode} />
              <Field label="Barcode Type" value={product.barcodeType} />
            </div>
          </Section>
        )}

        {/* ── Pricing ── */}
        <Section title="Pricing">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <Field
              label="Unit Cost"
              value={product.cost != null ? `$${product.cost.toFixed(2)}` : "—"}
            />
            <Field
              label="Selling Price"
              value={
                product.sellingPrice != null
                  ? `$${product.sellingPrice.toFixed(2)}`
                  : "—"
              }
            />
            <Field
              label="Tax Rate"
              value={product.taxRate != null ? `${product.taxRate}%` : "—"}
            />
          </div>
        </Section>

        {/* ── Physical ── */}
        {(product.weight != null || product.length != null) && (
          <Section title="Physical Specifications">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field
                label="Weight"
                value={product.weight != null ? `${product.weight} kg` : "—"}
              />
              <Field label="Dimensions" value={dimensionsText} />
            </div>
          </Section>
        )}

        {/* ── Inventory Rules ── */}
        <Section title="Inventory Rules">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <Field
              label="Min Stock"
              value={product.minStock != null ? `${product.minStock} ${product.unit ?? "PCS"}` : "—"}
            />
            <Field
              label="Max Stock"
              value={product.maxStock != null ? `${product.maxStock} ${product.unit ?? "PCS"}` : "—"}
            />
            <Field
              label="Reorder Point"
              value={product.reorderPoint != null ? `${product.reorderPoint} ${product.unit ?? "PCS"}` : "—"}
            />
            <Field
              label="Lead Time"
              value={product.leadTime != null ? `${product.leadTime} days` : "—"}
            />
            <Field label="Shelf Life" value={shelfLifeText} />
            <Field
              label="Current Stock"
              value={
                <span
                  className={
                    product.stock === 0
                      ? "text-red-600"
                      : product.stock <= (product.minStock ?? 0)
                      ? "text-orange-500"
                      : "text-emerald-600"
                  }
                >
                  {product.stock} {product.unit ?? "PCS"}
                </span>
              }
            />
          </div>
        </Section>

        {/* ── Supplier ── */}
        {(product.supplier || product.supplierSku) && (
          <Section title="Supplier Information">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Primary Supplier" value={product.supplier} />
              <Field label="Supplier SKU" value={product.supplierSku} />
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
