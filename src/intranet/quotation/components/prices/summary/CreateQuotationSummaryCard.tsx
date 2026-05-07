import type { FC } from "react";
import { SummaryCard } from "./SummaryCard";
import { getExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";
export const CreateQuotationSummaryCard: FC = () => (
  <SummaryCard getExchangeRateFn={getExchangeRate} />
);
