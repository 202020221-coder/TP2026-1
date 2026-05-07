import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { ClientQuotationDetailsPage } from "./ClientQuotationDetailsPage";
import { ProjectAssistantQuotationDetailsPage } from "./ProjAsistantQuotationDetailsPage";

export function QuotationDetailsPage() {
  const user = useSession((s) => s.loggedUser);
  if (user?.rol === RolesRecord.client) {
    return <ClientQuotationDetailsPage />;
  } else if (user?.rol === RolesRecord.projectAdmin) {
    return <ProjectAssistantQuotationDetailsPage/>;
  } else {
    throw new Error(`Content not defined for user:  ${user?.rol}`);
  }
}
