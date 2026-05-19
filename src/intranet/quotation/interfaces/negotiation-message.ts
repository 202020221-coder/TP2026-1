import { RolesRecord } from "@/security/session/enum/roles.enum";

export type NegotiationAuthorRole =
  | typeof RolesRecord.client
  | typeof RolesRecord.projectAdmin;

export interface NegotiationMessage {
  id: string;
  quotationId: number;
  authorRole: NegotiationAuthorRole;
  authorName: string;
  content: string;
  createdAt: string;
}
