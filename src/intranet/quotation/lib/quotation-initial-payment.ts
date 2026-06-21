import type { QuotationPaymentTerms } from "../interfaces/quotation-payment-terms";

export const getInitialPaymentPercentage = (
  terms: QuotationPaymentTerms | undefined,
): number | null => {
  if (!terms) {
    return null;
  }

  if (terms.pago_inicial) {
    return terms.pago_inicial.porcentaje;
  }

  const upfrontInstallment = terms.plazos_pago.find(
    (installment) => installment.plazo_de_pago === 0,
  );

  return upfrontInstallment?.porcentaje ?? null;
};

export const getInitialPaymentAmount = (
  total: string | number,
  terms: QuotationPaymentTerms | undefined,
): number | null => {
  const percentage = getInitialPaymentPercentage(terms);
  if (percentage == null) {
    return null;
  }

  const totalAmount = typeof total === "string" ? Number(total) : total;
  if (!Number.isFinite(totalAmount)) {
    return null;
  }

  return (totalAmount * percentage) / 100;
};
