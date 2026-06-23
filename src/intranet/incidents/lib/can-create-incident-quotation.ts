import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";

const CREATOR_ROLES: UserRole[] = [
  RolesRecord.lawyer,
  RolesRecord.manager,
  RolesRecord.projectAdmin,
];

export const canCreateIncidentQuotation = (
  role: UserRole | null | undefined,
): boolean => Boolean(role && CREATOR_ROLES.includes(role));
