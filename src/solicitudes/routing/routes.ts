import type { IRoute } from "@/shared/interfaces/route";
import ListOrdersPage from "../pages/ListOrdersPage";
import { InsertRequestPage } from "../pages/create-request/InsertRequestPage";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListOrdersPage,
    isPrivate: true,
  },
    {
    path: "/create-request",
    Component: InsertRequestPage,
  },
];