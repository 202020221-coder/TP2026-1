import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { getQuotation } from "../api/quotation.api";
import { QuotationDetailHeader } from "../components/QuotationDetailHeader";
import { QuotationDetailState } from "../components/QuotationDetailState";
import { QuotationDetailFormCard } from "../components/QuotationDetailFormCard";
import { QuotationMessagesStatesRecord } from "../enum/quotation-message-state.record";
import { QuotationStatesRecord } from "../enum/quotation-state.record";

import type { QuotationDetailForm } from "../schemas/quotation-detail-form";

const toDisplayDate = (value: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function QuotationDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quotationId = Number(searchParams.get("quotationId"));
  const hasValidId = Number.isInteger(quotationId) && quotationId > 0;

const form = useForm<QuotationDetailForm>({
  defaultValues: {
    nombre: "",
    version: "",
    idSolicitud: "",
    dniOrRuc: "",
    fechaInicio: "",
    precioTotal: "",
    estado: QuotationStatesRecord.pending,
    mensajes: QuotationMessagesStatesRecord.not_started,
    comentarioCliente: "",
  },
});

  const { reset } = form;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["quotation-detail", quotationId],
    queryFn: () => getQuotation(quotationId),
    enabled: hasValidId,
  });

useEffect(() => {
  if (!data) return;
  reset({
    nombre: data.nombre,
    version: String(data.version),
    idSolicitud: String(data.id_solicitud),
    dniOrRuc: data.DNI_O_RUC,
    fechaInicio: toDisplayDate(data.fecha_inicio),
    precioTotal: data.precio_total,
    estado: data.estado,
    mensajes: data.mensajes,
    comentarioCliente: data.comentario_cliente ?? "",
  });
}, [data, reset]);

  if (!hasValidId) {
    return (
      <QuotationDetailState
        message="No se especifico un quotationId valido en la URL."
        onBack={() => navigate("/intranet/cotizaciones")}
      />
    );
  }

  if (isError) {
    return (
      <QuotationDetailState
        message={error.message}
        onBack={() => navigate("/intranet/cotizaciones")}
      />
    );
  }

  return (
    <div className="p-8 space-y-6">
      <QuotationDetailHeader onBack={() => navigate("/intranet/cotizaciones")} />
      <QuotationDetailFormCard form={form} isPending={isPending} />
    </div>
  );
}