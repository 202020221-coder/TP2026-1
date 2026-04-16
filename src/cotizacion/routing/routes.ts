import type { IRoute } from "@/shared/interfaces/route";
import { ListQuotationPage } from "../pages/ViewQuotationClienPage";
import QuotationDetailPage from "../pages/QuotationDetailPage";
import ViewQuotationPage from "../pages/ViewQuotationPage";
import ViewQuotationClientPage from "../pages/ViewQuotationClientPage";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListQuotationPage,
    isPrivate: true,
    roles: ["ADMIN"],
  },
  {
    path: "/detalle",
    Component: QuotationDetailPage,
    isPrivate: true,
  },
  {
    path: "/crear",
    Component: ViewQuotationPage,
    isPrivate: true,
    roles: ["ADMIN"],
  },
];
