import { Button } from "@/shared/components/ui/button";
import PdfPreview from "./PdfPreview";
import { Send, Pencil } from "lucide-react";
import { useCreateQuotation } from "../../hooks/useCreateQuotation";
import { useUpdateQuotation } from "../../hooks/useUpdateQuotation";
import type { DesiredQuotationData } from "../../interfaces/upsert/desiredQuotationInitialData";

type BaseProps = {
  referenceData: DesiredQuotationData["client"];
};

type CreateModeProps = BaseProps & {
  mode: "create";
  orderId: string;
};

type UpdateModeProps = BaseProps & {
  mode: "update";
  quotationId: string;
  incidentQuotationId?: number | null;
};

type QuotationVisualizeSectionProps = CreateModeProps | UpdateModeProps;

export const QuotationVisualizeSection = (
  props: QuotationVisualizeSectionProps,
) => {
  const isCreate = props.mode === "create";
  const orderId = isCreate ? props.orderId : "";
  const quotationId = isCreate ? "" : props.quotationId;

  const { isSending: createSending, handleSubmit: createSubmit } =
    useCreateQuotation({ referenceData: props.referenceData, orderId });
  const { isSending: updateSending, handleSubmit: updateSubmit } =
    useUpdateQuotation({
      quotationId,
      incidentQuotationId:
        props.mode === "update" ? props.incidentQuotationId : null,
    });

  const isSending = createSending || updateSending;
  const handleSubmit = isCreate ? createSubmit : updateSubmit;

  return (
    <>
      <Button
        className="w-full mb-2 h-14"
        disabled={isSending}
        onClick={handleSubmit}
      >
        {isCreate ? (
          <Send className="mr-2 h-4 w-4" />
        ) : (
          <Pencil className="mr-2 h-4 w-4" />
        )}
        {isSending
          ? isCreate
            ? "Enviando..."
            : "Actualizando..."
          : isCreate
            ? "Crear Cotización y enviar al cliente"
            : "Actualizar Cotización"}
      </Button>
      <PdfPreview
        key={Date.now()}
        client={{
          RUC: props.referenceData.DNIorRUC,
          nombre_comercial: props.referenceData.comercialName,
          razon_social: props.referenceData.companyName,
        }}
      />
    </>
  );
};
