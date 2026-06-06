import type { FC } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { OrdersTablePlaceholder } from "./OrdersTablePlaceholder";
import { OrdersTableControls } from "./OrdersTableControls";
import { useOrders } from "../hooks/useOrders";
import { OrdersTableHeader } from "./OrdersTableHeader";
import { OrderTableRow } from "./OrdersTableRow";
import { Link } from "react-router";
import { PackageOpen } from "lucide-react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
export const OrdersTable: FC = () => {
  const { result, queryParams } = useOrders();
  const { isPending, isFetching, isError, error, data } = result;
  const user = useSession((s) => s.loggedUser);
  return (
    <OrdersTableControls>
      <Table containerClassname="flex-1 overflow-auto flex-col">
        <OrdersTableHeader />
        <TableBody>
          {isPending || isFetching ? (
            <OrdersTablePlaceholder rows={queryParams.limit ?? 10} />
          ) : isError ? (
            <TableRow className="">
              <TableCell colSpan={5}>{error.message}</TableCell>
            </TableRow>
          ) : (
            <>
              {data.data.length > 0 ? (
                <>
                  {data.data.map((o) => (
                    <OrderTableRow order={o} key={o.ID} />
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-16">
                    <div className="flex flex-col justify-center items-center text-center">
                      <PackageOpen
                        strokeWidth={1}
                        size={80}
                        className="text-gray-300 mb-4"
                      />
                      {user?.rol === RolesRecord.client && (
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-700">
                            No hay solicitudes aún
                          </p>
                          <p className="text-gray-500">
                            Puedes crear tu primera solicitud{" "}
                            <Link
                              to={"/intranet/solicitudes/crear"}
                              className="text-primary font-medium hover:underline"
                            >
                              aquí
                            </Link>
                          </p>
                        </div>
                      )}
                      {user?.rol === RolesRecord.projectAdmin && (
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-700">
                            No hay solicitudes
                          </p>
                          <p className="text-gray-500">
                            No se encontraron resultados para los filtros
                            seleccionados.
                          </p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </OrdersTableControls>
  );
};
