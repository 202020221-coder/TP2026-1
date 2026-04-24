import type { IRoute } from "@/shared/interfaces/route";
import DashboardClientPage from "../pages/DashboardClientPage";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: DashboardClientPage,
    isPrivate: true,
  },
];
