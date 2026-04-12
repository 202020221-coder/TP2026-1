import type { IRoute } from "@/shared/interfaces/route";
import ListOrdersPage from "../pages/ListOrdersPage";
import { CreateRequestPage } from "../pages/create-request/CreateRequestPage";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListOrdersPage,
    isPrivate: true,
  },
  // Ingreso de cliente por primera vez
  {
    path: "/create-request",
    Component: CreateRequestPage,
    isPrivate: true,
  },
];