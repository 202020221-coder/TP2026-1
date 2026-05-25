import type { FC } from "react";
import { useEffect } from "react";
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
import { useNavigate } from "react-router";
export const OrdersTable: FC = () => {
  const { result, queryParams } = useOrders();
  const { isPending, isFetching, isError, error, data } = result;
  const user = useSession((s) => s.loggedUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user?.rol === RolesRecord.client &&
      !isPending &&
      !isFetching &&
      !isError &&
      (data?.data?.length ?? 0) === 0
    ) {
      navigate("/intranet/solicitudes/crear", { replace: true });
    }
  }, [data?.data?.length, isError, isFetching, isPending, navigate, user?.rol]);

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
              {
                (() => {
                  const all = data.data ?? [];
                  const filtered = queryParams.order_name
                    ? all.filter((o) =>
                      (o.Cliente_Nombre ?? o.descripcion ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(queryParams.order_name!.toString().toLowerCase()),
                    )
                    : all;

                  if (filtered.length > 0) {
                    return filtered.map((o) => (
                      <OrderTableRow order={o} key={o.ID} />
                    ));
                  }

                  return (
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

                          {(user?.rol === RolesRecord.projectAdmin || user?.rol === RolesRecord.manager) && (
                            <p>Sin resultados.</p>
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })()
              }
            </>
          )}
        </TableBody>
      </Table>
    </OrdersTableControls>
  );
};
