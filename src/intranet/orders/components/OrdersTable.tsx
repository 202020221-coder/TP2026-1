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
              {data.data.length > 0 &&
                data.data.map((o) => <OrderTableRow order={o} key={o.ID} />)}
              {data.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <span className="flex flex-col justify-center items-center">
                      <PackageOpen
                        strokeWidth={1}
                        size={200}
                        className="text-gray-300"
                      />
                      {user?.rol === RolesRecord.client && (
                        <p className="text-gray-400">
                          Sin resultados, no olvide que puede crear una
                          solicitud{" "}
                          <Link
                            to={"/intranet/solicitudes/crear"}
                            className="text-primary"
                          >
                            aquí
                          </Link>
                          .
                        </p>
                      )}

                      {user?.rol === RolesRecord.projectAdmin && (
                        <p>Sin resultados.</p>
                      )}
                    </span>
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
