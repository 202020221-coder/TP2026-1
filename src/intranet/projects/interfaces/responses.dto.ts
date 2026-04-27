import type { Pagination } from "@/shared/interfaces/api-response";
import type { Project } from "./project";

export type GetProjectResponse = Project;
export type GetProjectsResponse = Pagination<Project[]>;
