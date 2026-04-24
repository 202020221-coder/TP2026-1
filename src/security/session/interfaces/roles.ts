import type { RolesRecord } from "../enum/roles.enum";

export type UserRole =
  (typeof RolesRecord)[keyof typeof RolesRecord];