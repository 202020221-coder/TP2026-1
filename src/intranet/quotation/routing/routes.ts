import type { IRoute } from "@/shared/interfaces/route";
import { ListQuotationsPage } from "../pages/ListQuotationsPage";
import { QuotationDetailsPage } from "../pages/QuotationDetailPage";
import CreateQuotationPage from "../pages/CreateQuotationPage";
import { RolesRecord } from "@/security/session/enum/roles.enum";

// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListQuotationsPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.client],
  },
  {
    path: "/detalles/:quotationId",
    Component: QuotationDetailsPage,
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
