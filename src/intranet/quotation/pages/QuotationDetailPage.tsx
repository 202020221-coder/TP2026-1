import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { QuotationDetailsClientPage } from "./ClientQuotationDetailsPage";

export function QuotationDetailsPage() {
  const user = useSession((s) => s.loggedUser);
  if (user?.rol === RolesRecord.client) {
    return <QuotationDetailsClientPage />;
  } else if (user?.rol === RolesRecord.projectAdmin) {
    return <p>PEpe</p>;
  } else {
    throw new Error(`Content not defined for user:  ${user?.rol}`);
  }
}
