import type { IPrivateRoute } from "@/shared/interfaces/route";
import ListOrdersPage from "../pages/ListOrdersPage";
import { InsertRequestPage } from "../pages/create-request/InsertRequestPage";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IPrivateRoute[] = [
  {
    path: "/",
    Component: ListOrdersPage,
  },
    {
    path: "/create-request",
    Component: InsertRequestPage,
  },
];