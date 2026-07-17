import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardPlus, Plus, Save, Trash2 } from "lucide-react";
import {
  FormInput,
  FormNumberInput,
  FormSelect,
  FormTextarea,
  SectionTitle,
} from "@/components/form";
import { inboundLots } from "../inbound/inboundMockData";
import { products } from "@/features/products/mock";
import {
  createLotSchema,
  type CreateLotForm,
} from "../inbound/schema/inbound.schema";

const statusOptions = [
  { label: "รอส่ง QC", value: "รอส่ง QC" },
  { label: "Pending QC", value: "Pending QC" },
  { label: "QC Passed", value: "QC Passed" },
  { label: "QC Failed", value: "QC Failed" },
  { label: "Quarantine", value: "Quarantine" },
  { label: "Putaway", value: "Putaway" },
];

const itemOptions = products.map((item) => ({
  label: item.name,
  value: item.sku,
}));

export default function InboundFormPage() {
  const { lotId } = useParams<{ lotId: string }>();
  const navigate = useNavigate();
  const lot = inboundLots.find((value) => value.lotId === lotId);
  const isEdit = Boolean(lotId && lot);

  const defaultValues: CreateLotForm = {
    poNumber: lot?.poNumber ?? "",
    supplier: lot?.supplier ?? "",
    warehouseRef: lot?.warehouseRef ?? "",
    expectedDate:
      lot?.expectedDate.slice(0, 16) ?? new Date().toISOString().slice(0, 16),
    receivedDate:
      lot?.receivedDate.slice(0, 16) ?? new Date().toISOString().slice(0, 16),
    status: lot?.status ?? "รอส่ง QC",
    qcNote: lot?.qcNote ?? "",
    items:
      lot?.items.map((item) => ({
        ...item,
        expectedQty: Number(item.expectedQty),
        receivedQty: Number(item.receivedQty),
        unitCost: Number(item.unitCost),
      })) ?? [],
  };

  const methods = useForm<CreateLotForm>({
    resolver: zodResolver(createLotSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const addItem = () =>
    append({
      lineNo: fields.length + 1,
      sku: "",
      productName: "",
      barcode: "",
      expectedQty: 1,
      receivedQty: 0,
      unit: "PCS",
      unitCost: 0,
      qcStatus: "Pending",
      manufacturerLotNo: "",
      expiryDate: "",
      qcNote: "",
    });

  const selectProduct = (index: number, sku: string) => {
    const product = products.find((item) => item.sku === sku);
    setValue(`items.${index}.sku`, sku, {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (product) {
      setValue(`items.${index}.productName`, product.name, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(`items.${index}.barcode`, product.barcode, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(`items.${index}.unit`, product.unit ?? "PCS", {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(`items.${index}.unitCost`, product.cost, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      setValue(`items.${index}.productName`, "", {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(`items.${index}.barcode`, "", {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(`items.${index}.unit`, "PCS", {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(`items.${index}.unitCost`, 0, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const onSubmit = async (data: CreateLotForm) => {
    try {
      console.log("Inbound lot saved:", data);
      navigate("/inbound");
    } catch (error) {
      console.error(error);
    }
  };

  if (isEdit && !lot)
    return (
      <div className="py-24 text-center text-slate-500">
        Inbound lot not found
      </div>
    );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/inbound/${lotId}` : "/inbound")}
            className="mb-3 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600"
          >
            <ArrowLeft size={12} />
            {isEdit ? "Inbound Lot Details" : "Inbound"}
          </button>
          <div className="flex items-center gap-3">
            <ClipboardPlus className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold md:text-2xl">
                {isEdit ? "Edit Inbound Lot" : "Create Inbound Lot"}
              </h1>
              <p className="text-sm text-slate-500">
                Receive products into a lot before sending it to QC.
              </p>
            </div>
          </div>
        </div>

        <SectionTitle title="Receiving Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="PO Number"
              register={register("poNumber")}
              placeholder="PO-2026-0001"
            />
            <FormInput
              label="Supplier"
              required
              register={register("supplier")}
              placeholder="Supplier name"
            />
            <FormInput
              label="Dock / Location"
              required
              register={register("warehouseRef")}
              placeholder="DOCK-A / QC-HOLD-01"
            />
            <FormSelect label="Status" name="status" options={statusOptions} />
            <FormInput
              label="Expected Date"
              required
              type="datetime-local"
              register={register("expectedDate")}
            />
            <FormInput
              label="Received Date"
              required
              type="datetime-local"
              register={register("receivedDate")}
            />
          </div>
          <FormTextarea
            label="QC Note"
            register={register("qcNote")}
            placeholder="Add QC or receiving note..."
          />
        </SectionTitle>

        <SectionTitle title="Items in this Lot">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Add one or more products received in this lot.
                </h3>
                <p className="text-sm text-slate-500">
                  Use the product selector to autofill barcode, unit, and cost.
                </p>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus size={15} />
                Add Product
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                No items added. Select <strong>Add Product</strong> to add
                products into this lot.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="border-b bg-slate-50 text-left text-xs text-slate-500">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">PRODUCT</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">EXPECTED</th>
                      <th className="p-3">RECEIVED</th>
                      <th className="p-3">UNIT COST</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-b">
                        <td className="p-3 text-slate-400">{field.lineNo}</td>
                        <td className="p-3">
                          <FormSelect
                            name={`items.${index}.sku`}
                            onValueChange={(value) =>
                              selectProduct(index, value)
                            }
                            options={itemOptions}
                            placeholder="Select product (optional)"
                            className="h-9 w-56"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            required
                            className="h-9 w-28 rounded-lg border border-slate-200 px-2 font-mono text-xs"
                            {...register(`items.${index}.sku` as const)}
                            placeholder="SKU required"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            required
                            min={1}
                            type="number"
                            className="h-9 w-20 rounded-lg border border-slate-200 px-2"
                            {...register(`items.${index}.expectedQty`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            required
                            min={0}
                            type="number"
                            className="h-9 w-20 rounded-lg border border-slate-200 px-2"
                            {...register(`items.${index}.receivedQty`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            required
                            min={0}
                            type="number"
                            className="h-9 w-24 rounded-lg border border-slate-200 px-2"
                            {...register(`items.${index}.unitCost`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SectionTitle>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 rounded-2xl border bg-white p-5 shadow-lg md:flex-row md:justify-end">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/inbound/${lotId}` : "/inbound")}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={fields.length === 0 || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={15} />
            {isEdit ? "Save Changes" : "Create Inbound Lot"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
