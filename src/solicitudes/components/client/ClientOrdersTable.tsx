import type { FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/shared/components/ui/table";
import { OrdersTableControls } from "../OrdersTableControls";
import { useOrders } from "../../hooks/useOrders";
import { ClientOrdersTableHeader } from "./ClientOrdersTableHeader";
import { ClientOrdersTablePlaceholder } from "./ClientOrdersTablePlaceholder";
import { ClientOrderTableRow } from "./ClientOrderTableRow";

export const ClientOrdersTable: FC = () => {
    const { result, queryParams } = useOrders();
    const { isPending, isFetching, isError, error, data } = result;

    return (
        <OrdersTableControls>
            <Table>
                <ClientOrdersTableHeader />
                <TableBody>
                    {isPending || isFetching ? (
                        <ClientOrdersTablePlaceholder rows={queryParams.limit ?? 10} />
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={7}>{error.message}</TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {(data?.data ?? []).map((order) => (
                                <ClientOrderTableRow order={order} key={order.ID} />
                            ))}
                        </>
                    )}
                </TableBody>
            </Table>
        </OrdersTableControls>
    );
};