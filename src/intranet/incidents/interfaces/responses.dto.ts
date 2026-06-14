import type { Pagination } from "@/shared/interfaces/api-response";
import type { Incident, IncidentInvolved } from "./incident";
import type { IncidentQuotation, InvolvedObject } from "./incident-quotation";

export type GetIncidentResponse = Incident;
export type GetIncidentsResponse = Pagination<Incident[]>;
export type GetIncidentObjectsResponse = InvolvedObject[];
export type GetIncidentInvolvedResponse = IncidentInvolved[];
export type GetIncidentQuotationsResponse = IncidentQuotation[];
