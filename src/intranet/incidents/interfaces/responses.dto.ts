import type { Pagination } from "@/shared/interfaces/api-response";
import type { Incident, IncidentObject, IncidentInvolved } from "./incident";

export type GetIncidentResponse = Incident;
export type GetIncidentsResponse = Pagination<Incident[]>;
export type GetIncidentObjectsResponse = IncidentObject[];
export type GetIncidentInvolvedResponse = IncidentInvolved[];
