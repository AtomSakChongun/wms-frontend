import apiClient from "@/api/axios";
import type { Product } from "@/features/products/columns";

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<Product[]>("/products");
  return response.data;
}

export async function getProductBySku(sku: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${sku}`);
  return response.data;
}
