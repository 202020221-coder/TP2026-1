import type { IRoute } from "@/shared/interfaces/route";
import ListOrdersPage from "../pages/ListOrdersPage";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListOrdersPage,
    isPrivate: true,
  },
];