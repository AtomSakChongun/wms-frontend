import apiClient from "@/api/axios";
import type { InboundLot } from "@/features/inbound/types";
import type { CreateLotForm } from "@/features/inbound/schema/inbound.schema";
import type { PageParams, PaginatedResponse } from "@/types/pagination";

export interface InboundQueryParams extends PageParams {
  search?: string;
  supplier?: string;
  status?: string;
  location?: string;
}

export async function getInbound(
  params?: InboundQueryParams,
): Promise<PaginatedResponse<InboundLot>> {
  const response = await apiClient.get<PaginatedResponse<InboundLot>>("/inbound", { params });
  return response.data;
}

export async function getInboundById(id: string): Promise<InboundLot> {
  const response = await apiClient.get<InboundLot>(`/inbound/${id}`);
  return response.data;
}

// Backend's CreateInboundDto/InboundItemDto only accept this subset — strip
// the client-only fields (barcode, unit, manufacturerLotNo, expiryDate, per-item
// qcStatus/qcNote, lot-level status) before sending.
function toInboundPayload(dto: Partial<CreateLotForm>) {
  return {
    poNumber: dto.poNumber || undefined,
    supplier: dto.supplier,
    receivingLocation: dto.receivingLocation,
    expectedDate: dto.expectedDate,
    receivedDate: dto.receivedDate,
    qcNote: dto.qcNote || undefined,
    items: dto.items?.map((item) => ({
      productId: item.productId || undefined,
      sku: item.sku || undefined,
      name: item.name || undefined,
      expectedQty: item.expectedQty,
      receivedQty: item.receivedQty,
      unitCost: item.unitCost,
    })),
  };
}

export async function createInbound(dto: CreateLotForm): Promise<InboundLot> {
  const response = await apiClient.post<InboundLot>("/inbound", toInboundPayload(dto));
  return response.data;
}

export async function updateInbound(
  id: string,
  dto: Partial<CreateLotForm>,
): Promise<InboundLot> {
  const response = await apiClient.patch<InboundLot>(
    `/inbound/${id}`,
    toInboundPayload(dto),
  );
  return response.data;
}

export async function deleteInbound(id: string): Promise<void> {
  await apiClient.delete(`/inbound/${id}`);
}
