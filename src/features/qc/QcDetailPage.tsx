import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { qcLotsToReview } from "./qcMockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { ItemQcStatus } from "../inbound/types";

interface EditingItem {
  lineNo: number;
  qcStatus: ItemQcStatus;
  qcNote: string;
}

const QC_STATUS_STYLES: Record<
  ItemQcStatus,
  { label: string; color: string }
> = {
  Pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  Passed: { label: "Passed", color: "bg-green-100 text-green-800" },
  Failed: { label: "Failed", color: "bg-red-100 text-red-800" },
  Quarantine: { label: "Quarantine", color: "bg-orange-100 text-orange-800" },
};

export default function QcDetailPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const navigate = useNavigate();

  const [editingItems, setEditingItems] = useState<Map<number, EditingItem>>(
    new Map(),
  );
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<
    "QC Passed" | "QC Failed"
  >("QC Passed");

  const lot = qcLotsToReview.find((l) => l.lotId === lotId);

  if (!lot) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold">Lot not found</h2>
          <p className="text-muted-foreground mt-2">Lot ID: {lotId}</p>
          <button
            onClick={() => navigate("/qc")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm"
          >
            <ChevronLeft size={15} />
            Back to QC List
          </button>
        </div>
      </div>
    );
  }

  // Merge original item status with any local edits
  const getItemStatus = (lineNo: number): ItemQcStatus => {
    const edited = editingItems.get(lineNo);
    if (edited) return edited.qcStatus;
    return lot.items.find((i) => i.lineNo === lineNo)?.qcStatus ?? "Pending";
  };

  const getItemNote = (lineNo: number): string => {
    const edited = editingItems.get(lineNo);
    if (edited) return edited.qcNote;
    return lot.items.find((i) => i.lineNo === lineNo)?.qcNote ?? "";
  };

  const pendingCount = lot.items.filter(
    (item) => getItemStatus(item.lineNo) === "Pending",
  ).length;

  const allItemsReviewed = pendingCount === 0;

  const handleItemStatusChange = (lineNo: number, newStatus: ItemQcStatus) => {
    setEditingItems((prev) => {
      const next = new Map(prev);
      const current = next.get(lineNo) ?? {
        lineNo,
        qcStatus: getItemStatus(lineNo),
        qcNote: getItemNote(lineNo),
      };
      next.set(lineNo, { ...current, qcStatus: newStatus });
      return next;
    });
  };

  const handleItemNoteChange = (lineNo: number, note: string) => {
    setEditingItems((prev) => {
      const next = new Map(prev);
      const current = next.get(lineNo) ?? {
        lineNo,
        qcStatus: getItemStatus(lineNo),
        qcNote: getItemNote(lineNo),
      };
      next.set(lineNo, { ...current, qcNote: note });
      return next;
    });
  };

  const openApprovalDialog = (status: "QC Passed" | "QC Failed") => {
    if (!allItemsReviewed) {
      toast.error(
        `ยังมีสินค้าที่ยังไม่ตรวจสอบ ${pendingCount} รายการ กรุณาตรวจสอบให้ครบก่อน`,
      );
      return;
    }
    setApprovalStatus(status);
    setApprovalNote("");
    setShowApprovalDialog(true);
  };

  const handleConfirmApproval = () => {
    if (!approvalNote.trim()) {
      toast.error("กรุณากรอก QC Note ก่อนยืนยัน");
      return;
    }

    const updatedItems = lot.items.map((item) => {
      const edited = editingItems.get(item.lineNo);
      return edited
        ? { ...item, qcStatus: edited.qcStatus, qcNote: edited.qcNote }
        : item;
    });

    console.log("QC Approval Result:", {
      lotId: lot.lotId,
      finalStatus: approvalStatus,
      approvedBy: "Current User",
      approvalDate: new Date().toISOString(),
      qcNote: approvalNote,
      items: updatedItems,
    });

    toast.success(
      approvalStatus === "QC Passed"
        ? `Lot ${lot.lotId} ผ่าน QC แล้ว`
        : `Lot ${lot.lotId} ถูก Reject แล้ว`,
    );

    setShowApprovalDialog(false);
    setTimeout(() => navigate("/qc"), 1500);
  };

  const displayItems = lot.items.map((item) => ({
    ...item,
    qcStatus: getItemStatus(item.lineNo),
    qcNote: getItemNote(item.lineNo),
  }));

  const progressPct =
    ((lot.items.length - pendingCount) / lot.items.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/qc")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{lot.lotId}</h1>
            <p className="text-sm text-muted-foreground">
              {lot.supplier} · {lot.items.length} items
            </p>
          </div>
        </div>

        {/* Action buttons — visible at top on desktop */}
        <div className="hidden sm:flex gap-3">
          <button
            onClick={() => openApprovalDialog("QC Failed")}
            disabled={!allItemsReviewed}
            className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm transition-colors ${
              !allItemsReviewed
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            }`}
          >
            <XCircle size={15} />
            Reject Lot
          </button>
          <button
            onClick={() => openApprovalDialog("QC Passed")}
            disabled={!allItemsReviewed}
            className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm transition-colors ${
              !allItemsReviewed
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            }`}
          >
            <CheckCircle2 size={15} />
            Approve Lot
          </button>
        </div>
      </div>

      {/* Lot Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "PO Number", value: lot.poNumber || "-" },
          { label: "Supplier", value: lot.supplier },
          { label: "Location", value: lot.warehouseRef },
          { label: "Received By", value: lot.createdBy },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-border rounded-lg p-4"
          >
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-sm font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">QC Progress</h3>
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full ${
              allItemsReviewed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {lot.items.length - pendingCount} / {lot.items.length} items
            reviewed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {!allItemsReviewed && (
          <p className="text-xs text-yellow-700 font-medium">
            ยังเหลือ {pendingCount} รายการที่ยังไม่ได้ตรวจสอบ
            —&nbsp;กรุณาตรวจสอบให้ครบก่อน Approve / Reject
          </p>
        )}
        {allItemsReviewed && (
          <p className="text-xs text-green-700 font-medium">
            ✓ ตรวจสอบสินค้าครบทุกรายการแล้ว สามารถ Approve หรือ Reject ได้
          </p>
        )}
      </div>

      {/* Existing QC Note (from mock data) */}
      {lot.qcNote && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 font-medium">หมายเหตุ QC เดิม</p>
          <p className="text-sm text-blue-900 mt-1">{lot.qcNote}</p>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg">Items for QC Inspection</h3>
          <span className="text-xs text-muted-foreground">
            {lot.items.length} รายการ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Line
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Mfr Lot No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Expiry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  QC Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item) => {
                const statusStyle =
                  QC_STATUS_STYLES[item.qcStatus] ?? QC_STATUS_STYLES.Pending;
                return (
                  <tr
                    key={item.lineNo}
                    className={`border-b transition-colors ${
                      item.qcStatus === "Pending"
                        ? "bg-yellow-50/40 hover:bg-yellow-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium w-12">
                      {item.lineNo}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">
                      {item.sku}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.barcode}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {item.receivedQty} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {item.manufacturerLotNo || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {item.expiryDate || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={item.qcStatus}
                        onValueChange={(value) =>
                          handleItemStatusChange(
                            item.lineNo,
                            value as ItemQcStatus,
                          )
                        }
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.color}`}
                            >
                              {statusStyle.label}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Passed">Passed</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                          <SelectItem value="Quarantine">Quarantine</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Add note..."
                        className="h-8 w-full min-w-[140px] px-2 rounded border border-slate-300 bg-slate-50 text-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        value={item.qcNote}
                        onChange={(e) =>
                          handleItemNoteChange(item.lineNo, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Buttons (mobile + secondary desktop) */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => navigate("/qc")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border hover:bg-muted text-foreground font-medium rounded-lg text-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => openApprovalDialog("QC Failed")}
          disabled={!allItemsReviewed}
          className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm transition-colors ${
            !allItemsReviewed
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          }`}
        >
          <XCircle size={15} />
          Reject Lot
        </button>
        <button
          onClick={() => openApprovalDialog("QC Passed")}
          disabled={!allItemsReviewed}
          className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm transition-colors ${
            !allItemsReviewed
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          }`}
        >
          <CheckCircle2 size={15} />
          Approve Lot
        </button>
      </div>

      {/* Approval Confirmation Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalStatus === "QC Passed"
                ? "Approve Lot — ผ่าน QC"
                : "Reject Lot — ไม่ผ่าน QC"}
            </DialogTitle>
            <DialogDescription>
              {approvalStatus === "QC Passed"
                ? `Lot ${lot.lotId} ผ่านการตรวจสอบคุณภาพ พร้อมนำเข้า Putaway`
                : `Lot ${lot.lotId} ไม่ผ่าน QC จะถูก Quarantine เพื่อรอการตรวจสอบเพิ่มเติม`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Lot ID
                </p>
                <p className="text-sm font-bold">{lot.lotId}</p>
              </div>
              <div className="ml-auto">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    approvalStatus === "QC Passed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {approvalStatus}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="approvalNote"
                className="text-sm font-semibold text-slate-700 block mb-2"
              >
                QC Note <span className="text-red-500">*</span>
              </label>
              <textarea
                id="approvalNote"
                placeholder="กรอกสรุปผลการตรวจสอบ QC..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                rows={4}
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
              />
              {!approvalNote.trim() && (
                <p className="text-xs text-slate-400 mt-1">
                  จำเป็นต้องกรอก QC Note ก่อนยืนยัน
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setShowApprovalDialog(false);
                  setApprovalNote("");
                }}
                className="flex-1 px-4 py-2 bg-white border border-border hover:bg-muted text-foreground font-medium rounded-lg text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                disabled={!approvalNote.trim()}
                className={`flex-1 px-4 py-2 font-medium rounded-lg text-sm transition-colors text-white ${
                  !approvalNote.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : approvalStatus === "QC Passed"
                      ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                }`}
              >
                Confirm {approvalStatus === "QC Passed" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
