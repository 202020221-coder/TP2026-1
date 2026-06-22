import type { FC } from "react";
import { SummaryCard } from "./SummaryCard";

type CreateQuotationSummaryCardProps = {
  showUpdateRatesButton?: boolean;
};

export const CreateQuotationSummaryCard: FC<CreateQuotationSummaryCardProps> = ({
  showUpdateRatesButton = false,
}) => <SummaryCard showUpdateRatesButton={showUpdateRatesButton} />;
