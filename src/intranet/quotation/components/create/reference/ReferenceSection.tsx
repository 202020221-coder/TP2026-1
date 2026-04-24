import { getOrder } from "@/intranet/orders/api/order.api";
import { ClientCard } from "./ClientCard";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { ClientCardSkeleton } from "./ClientCardSkeleton";
import type { Order } from "@/intranet/orders/interfaces/order";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
/*============================TIPOS===========================*/
export const ReferenceSection: FC<{ orderId: Order["ID"] }> = ({ orderId }) => {
  const user = useSession((state) => state.loggedUser);

  const { isPending, error, data } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(orderId),
  });
  // if loading show placeholders, otherwise show the full data UI (design unchanged)
  if (isPending)
    return (
      <section className="flex flex-col">
        <ClientCardSkeleton />
      </section>
    );

  if (error) {
    console.log(error);
    return (
      <p className="text-destructive">
        Error al traer informacion de la solicitud
      </p>
    );
  }

  return (
    <section className="flex flex-col">
      {user?.rol === RolesRecord.projectAdmin && (
        /**Recordar que solo el admin accede al id del cliente a traves de la solicitud */
        <ClientCard clientId={data.Id_Cliente ?? ""} />
      )}
    </section>
  );
};
