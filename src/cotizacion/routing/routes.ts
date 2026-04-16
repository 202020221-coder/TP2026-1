import type { IRoute } from "@/shared/interfaces/route";
import { ListQuotationPage } from "../pages/ViewQuotationClienPage";
import QuotationDetailPage from "../pages/QuotationDetailPage";
import CreateQuotationPage from "../pages/CreateQuotationPage";
import { RolesRecord } from "@/profile/enum/roles.enum";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListQuotationPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.client],
  },
  {
    path: "/detalle",
    Component: QuotationDetailPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.client],
  },
  {
    path: "/crear",
    Component: CreateQuotationPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin],
  },
];
