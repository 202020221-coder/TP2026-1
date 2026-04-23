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
export const OrdersTable: FC = () => {
  const { result, queryParams } = useOrders();
  const { isPending, isFetching, isError, error, data } = result;
  return (
    <OrdersTableControls>
      <Table containerClassname="flex-1 overflow-auto flex-col">
        <OrdersTableHeader />
        <TableBody>
          {isPending || isFetching ? (
            <OrdersTablePlaceholder rows={queryParams.limit ?? 10} />
          ) : isError ? (
            <TableRow className="">
              <TableCell colSpan={6}>{error.message}</TableCell>
            </TableRow>
          ) : (
            <>
              {data.data.map((o) => (
                <OrderTableRow order={o} key={o.ID} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </OrdersTableControls>
  );
};
