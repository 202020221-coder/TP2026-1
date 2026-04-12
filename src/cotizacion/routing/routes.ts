import type { IRoute } from "@/shared/interfaces/route";
import { ListQuotationPage } from "../pages/ViewQuotationClienPage";



// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListQuotationPage,
    isPrivate: true,
    // roles: ["CLIENT"]
  },
];

