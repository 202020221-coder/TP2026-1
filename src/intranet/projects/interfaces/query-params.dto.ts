import type { ProjectState } from "../enum/project-state.record";

export interface GetProjectsQP {
  project_name?: string;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  status?: ProjectState;
}
