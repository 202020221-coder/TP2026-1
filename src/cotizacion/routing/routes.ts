import type { IRoute } from "@/shared/interfaces/route";
import ViewQuotationPage from "../pages/ViewQuotationPage";


// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/create",
    Component: ViewQuotationPage,
    isPrivate: true,
    roles: ["ADMIN"]
  },
];

