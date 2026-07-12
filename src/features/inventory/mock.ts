import type { Product } from "./columns";

export const products: Product[] = [
  {
    sku: "ISH-001",
    name: "Industrial Safety Helmet Type II",
    category: "PPE",
    barcode: "8901234567890",
    cost: 18.5,
    stock: 248,
    status: "Active",
  },
  {
    sku: "PVC-020",
    name: "PVC Conduit 20mm x 3m",
    category: "Electrical",
    barcode: "8901234567893",
    cost: 3.8,
    stock: 12,
    status: "Low Stock",
  },
  {
    sku: "WGL-001",
    name: "Work Gloves",
    category: "PPE",
    barcode: "8901234567894",
    cost: 6.9,
    stock: 0,
    status: "Out of Stock",
  },
];