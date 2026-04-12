import type { IRoute } from "@/shared/interfaces/route";
import ViewQuotationPage from "../pages/ViewQuotationPage";
import ViewQuotationClientPage from "../pages/ViewQuotationClientPage";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/crear",
    Component: ViewQuotationPage,
    isPrivate: true,
    roles: ["ADMIN"],
  },
  {
    path: "/mis-cotizaciones",
    Component: ViewQuotationClientPage,
    isPrivate: true,
    roles: ["ADMIN"],
  },
];
