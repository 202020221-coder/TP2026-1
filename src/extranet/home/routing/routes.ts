import type { IRoute } from "@/shared/interfaces/route";
import { HomePage } from "../pages";
export const routes: IRoute[] = [
  {
    path: "/",
    Component: HomePage,
    isPrivate: false,
  },
];
