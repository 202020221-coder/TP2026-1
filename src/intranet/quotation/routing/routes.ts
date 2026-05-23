import type { IRoute } from "@/shared/interfaces/route";
import { ListQuotationsPage } from "../pages/ListQuotationsPage";
import { QuotationDetailsPage } from "../pages/QuotationDetailPage";
import CreateQuotationPage from "../pages/CreateQuotationPage";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export const routes: IRoute[] = [
  {
    path: "/",
    Component: ListQuotationsPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.client, RolesRecord.manager],
  },
  {
    path: "/detalles/:quotationId",
    Component: QuotationDetailsPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin, RolesRecord.client, RolesRecord.manager],
  },
  {
    path: "/crear",
    Component: CreateQuotationPage,
    isPrivate: true,
    roles: [RolesRecord.projectAdmin ,RolesRecord.manager],
  },

];
