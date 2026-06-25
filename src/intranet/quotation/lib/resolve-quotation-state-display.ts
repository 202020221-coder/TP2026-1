import type { UserRole } from "@/security/session/interfaces/roles";
import {
  QuotationStatesRecord,
  type QuotationState,
} from "../enum/quotation-state.record";
import type { Quotation } from "../interfaces/quotation";
import { getClientFacingStateLabel } from "./client-quotation-state";

/** Normaliza el `estado` que devuelve el API (variantes de texto / mayúsculas). */
export function normalizeQuotationEstado(raw: unknown): QuotationState {
  if (typeof raw !== "string" || !raw.trim()) {
    return QuotationStatesRecord.notApproved;
  }

  const value = raw.trim().toLowerCase().replace(/\s+/g, "_");
  const byKey: Record<string, QuotationState> = {
    rechazado: QuotationStatesRecord.rejected,
    aprobado: QuotationStatesRecord.approved,
    pendiente: QuotationStatesRecord.pending,
    no_aprobado: QuotationStatesRecord.notApproved,
    incidencia_pagada: QuotationStatesRecord.incidentPaid,
  };

  if (byKey[value]) return byKey[value];
  if (value.includes("rechaz")) return QuotationStatesRecord.rejected;
  if (value.includes("no") && value.includes("aprob")) {
    return QuotationStatesRecord.notApproved;
  }
  if (value.includes("pendiente")) return QuotationStatesRecord.pending;
  if (value.includes("incidencia") && value.includes("pag")) {
    return QuotationStatesRecord.incidentPaid;
  }
  if (value.includes("aprob")) return QuotationStatesRecord.approved;

  return QuotationStatesRecord.notApproved;
}

export function normalizeQuotationFromApi<T extends Quotation>(raw: T): T {
  return {
    ...raw,
    estado_bd: raw.estado_bd ?? raw.estado,
    estado: normalizeQuotationEstado(raw.estado),
  };
}

export function getQuotationStateLabel(
  quotation: Pick<Quotation, "estado" | "esCotizacionIncidencia">,
  role?: UserRole | null,
): string {
  return getClientFacingStateLabel(quotation, role);
}

export function getQuotationStateBadgeClass(
  estado: QuotationState,
  _role?: UserRole | null,
): string {
  void _role;

  const styles = new Map<QuotationState, string>([
    [
      QuotationStatesRecord.approved,
      "bg-green-200 text-green-600 border-green-400",
    ],
    [QuotationStatesRecord.rejected, "bg-red-200 text-red-600 border-red-400"],
    [
      QuotationStatesRecord.pending,
      "bg-yellow-200 text-yellow-600 border-yellow-400",
    ],
    [
      QuotationStatesRecord.notApproved,
      "bg-yellow-200 text-yellow-600 border-yellow-400",
    ],
    [
      QuotationStatesRecord.incidentPaid,
      "bg-violet-200 text-violet-700 border-violet-400",
    ],
  ]);

  return styles.get(estado) ?? "bg-gray-100 text-gray-600 border-gray-300";
}
