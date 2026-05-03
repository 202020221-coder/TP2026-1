import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { getQuotation } from "../api/quotation.api";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { QuotationDetailHeader } from "../components/list/QuotationDetailHeader";
import { QuotationDetailState } from "../components/list/QuotationDetailState";
import { QuotationDetailFormCard } from "../components/list/QuotationDetailFormCard";
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

const getQuotationDni = (value: any) =>
  String(value?.DNI_O_RUC ?? value?.dni_o_ruc ?? value?.dniOrRuc ?? "").trim();

const sameDni = (left: any, right: string | undefined) => {
  const normalizedLeft = getQuotationDni(left);
  const normalizedRight = String(right ?? "").trim();

  return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
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

  const user = useSession((state) => state.loggedUser);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["quotation-detail", quotationId],
    queryFn: () => getQuotation(quotationId, { dni: user?.dni_perfil }),
    enabled: hasValidId,
  });

useEffect(() => {
  if (!data) return;
  // Backend may return consolidated object with `commercial` key
  const source = (data as any).commercial ? (data as any).commercial : data;

  reset({
    nombre: source.nombre ?? "",
    version: String(source.version ?? ""),
    idSolicitud: String(source.id_solicitud ?? source.ID_solicitud ?? ""),
    dniOrRuc: getQuotationDni(source),
    fechaInicio: toDisplayDate(source.fecha_emision ?? source.fecha_inicio ?? ""),
    precioTotal: String(source.precio_total ?? ""),
    estado: source.estado ?? "",
    mensajes: source.mensajes ?? source.observacion ?? "",
    comentarioCliente: source.comentario_cliente ?? "",
  });
}, [data, reset, user]);

  const sourceForAuth = data ? ((data as any).commercial ? (data as any).commercial : data) : null;
  if (sourceForAuth && user?.dni_perfil && !sameDni(sourceForAuth, user.dni_perfil)) {
    // Debug helper: keep the mismatch visible, but do not block the view.
    // The backend permission check already controls access and this guard was
    // comparing a profile DNI against a company RUC, which is a false mismatch.
    // eslint-disable-next-line no-console
    console.warn("QuotationDetailPage DNI/RUC mismatch", {
      quotationId,
      sessionDni: user.dni_perfil,
      quotationDni: getQuotationDni(sourceForAuth),
      rawQuotation: sourceForAuth,
    });
  }

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