import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import type { Quotation } from "../interfaces/quotation";
import { QuotationStatesRecord } from "../enum/quotation-state.record";

const COMMERCIAL_EDITOR_ROLES: UserRole[] = [
  RolesRecord.projectAdmin,
  RolesRecord.manager,
  RolesRecord.workshopWorker,
];

export const canEditCommercialQuotation = (
  role: UserRole | null | undefined,
  quotation: Pick<Quotation, "estado" | "esCotizacionIncidencia">,
): boolean =>
  Boolean(
    role &&
      COMMERCIAL_EDITOR_ROLES.includes(role) &&
      !quotation.esCotizacionIncidencia &&
      quotation.estado === QuotationStatesRecord.pending,
  );

export const canEditIncidentQuotation = (
  role: UserRole | null | undefined,
  quotation: Pick<Quotation, "estado" | "esCotizacionIncidencia">,
): boolean =>
  Boolean(
    role === RolesRecord.lawyer &&
      quotation.esCotizacionIncidencia === true &&
      quotation.estado !== QuotationStatesRecord.approved,
  );
