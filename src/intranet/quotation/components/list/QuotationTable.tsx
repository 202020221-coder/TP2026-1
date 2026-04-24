import type { FC } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { useQuotation } from "../../hooks/useQuotations";
import { QuotationTableControls } from "./QuotationTableControls";
import { QuotationTableHeader } from "./QuotationTableHeader";
import { QuotationPlaceHolder } from "./QuotationTablePlaceHolder";
import { QuotationTableRow } from "./QuotationTableRow";
// import { OrdersTablePlaceholder } from "./OrdersTablePlaceholder";
// import { OrdersTableControls } from "./OrdersTableControls";
// import { useOrders } from "../hooks/useOrders";
// import { OrdersTableHeader } from "./OrdersTableHeader";
// import { OrderTableRow } from "./OrdersTableRow";
export const QuotationTable: FC = () => {
  const { result, queryParams } = useQuotation();
  const { isPending, isFetching, isError, error, data } = result;
  return (
    <QuotationTableControls>
      <Table>
        <QuotationTableHeader/>
        <TableBody>
          {isPending || isFetching ? (
            <QuotationPlaceHolder
              rows={queryParams.per_page ?? 5}
            />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6}>{error.message}</TableCell>
            </TableRow>
          ) : (
            <>
              {data.map((q) => (
                <QuotationTableRow quotation={q} key={q.ID} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </QuotationTableControls>
  );
};