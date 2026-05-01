import type { FC } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { useQuotation } from "../../hooks/useQuotations";
import type { Quotation } from "../../interfaces/quotation";
import { QuotationTableControls } from "./QuotationTableControls";
import { QuotationTableHeader } from "./QuotationTableHeader";
import { QuotationPlaceHolder } from "./QuotationTablePlaceHolder";
import { QuotationTableRow } from "./QuotationTableRow";
export const QuotationTable: FC = () => {
  const { result, queryParams } = useQuotation();
  const { isPending, isFetching, isError, error, data } = result;
  const items: Quotation[] = Array.isArray(data)
    ? (data as Quotation[])
    : ((data as any)?.data as Quotation[]) ?? [];
  const seen = new Set<string>();
  const uniqueItems: Quotation[] = items.filter((v: Quotation) => {
    const key = v && (v.ID ?? (v as any).id ?? JSON.stringify(v));
    const keyStr = String(key ?? Math.random());
    if (seen.has(keyStr)) return false;
    seen.add(keyStr);
    return true;
  });
  if (!items.length && data) {
    console.debug("QuotationTable: received data shape:", data);
  }
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
              {uniqueItems.length > 0 ? (
                uniqueItems.map((q, i) => (
                  <QuotationTableRow quotation={q} key={`${q.ID}-${i}`} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No hay cotizaciones para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </QuotationTableControls>
  );
};