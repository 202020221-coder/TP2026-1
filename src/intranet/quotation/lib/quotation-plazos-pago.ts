import type { QuotationPaymentInstallment } from "../interfaces/quotation-payment-terms";

export type QuotationPlazoPagoForm = Pick<
  QuotationPaymentInstallment,
  "porcentaje" | "plazo_de_pago" | "orden"
>;

export type QuotationPlazoPagoWithId = QuotationPlazoPagoForm & {
  id?: number;
};

export type QuotationPlazosPagoPair = [
  QuotationPlazoPagoWithId,
  QuotationPlazoPagoWithId,
];

export const DEFAULT_PLAZOS_PAGO: QuotationPlazosPagoPair = [
  { porcentaje: 30, plazo_de_pago: 0, orden: 1 },
  { porcentaje: 70, plazo_de_pago: 30, orden: 2 },
];

const clampPercentage = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

const clampDays = (value: number) => Math.max(0, Math.round(value));

export const hasSecondInstallment = (plazos: QuotationPlazosPagoPair): boolean =>
  plazos[0].porcentaje < 100;

export const syncSecondInstallmentPercentage = (
  plazos: QuotationPlazosPagoPair,
  firstPercentage: number,
): QuotationPlazosPagoPair => {
  const porcentaje = clampPercentage(firstPercentage);
  return [
    { ...plazos[0], porcentaje },
    { ...plazos[1], porcentaje: clampPercentage(100 - porcentaje) },
  ];
};

export const updatePlazoPagoAtOrden = (
  plazos: QuotationPlazosPagoPair,
  orden: 1 | 2,
  patch: Partial<Pick<QuotationPlazoPagoForm, "porcentaje" | "plazo_de_pago">>,
): QuotationPlazosPagoPair => {
  if (orden === 1) {
    const nextFirst = {
      ...plazos[0],
      ...(patch.plazo_de_pago != null
        ? { plazo_de_pago: clampDays(patch.plazo_de_pago) }
        : {}),
      ...(patch.porcentaje != null
        ? { porcentaje: clampPercentage(patch.porcentaje) }
        : {}),
    };
    return syncSecondInstallmentPercentage(
      [nextFirst, plazos[1]],
      nextFirst.porcentaje,
    );
  }

  return [
    plazos[0],
    {
      ...plazos[1],
      ...(patch.plazo_de_pago != null
        ? { plazo_de_pago: clampDays(patch.plazo_de_pago) }
        : {}),
    },
  ];
};

export const plazosPagoFromInstallments = (
  installments: QuotationPaymentInstallment[] | null | undefined,
): QuotationPlazosPagoPair => {
  const sorted = [...(installments ?? [])].sort((a, b) => a.orden - b.orden);
  if (sorted.length === 0) {
    return DEFAULT_PLAZOS_PAGO;
  }

  const first = sorted.find((item) => item.orden === 1) ?? sorted[0];
  const second = sorted.find((item) => item.orden === 2);

  const firstPercentage = first?.porcentaje ?? DEFAULT_PLAZOS_PAGO[0].porcentaje;

  return [
    {
      id: first?.id,
      porcentaje: firstPercentage,
      plazo_de_pago: first?.plazo_de_pago ?? DEFAULT_PLAZOS_PAGO[0].plazo_de_pago,
      orden: 1,
    },
    {
      id: second?.id,
      porcentaje:
        second?.porcentaje ?? clampPercentage(100 - firstPercentage),
      plazo_de_pago:
        second?.plazo_de_pago ?? DEFAULT_PLAZOS_PAGO[1].plazo_de_pago,
      orden: 2,
    },
  ];
};

export const plazosPagoToApiBody = (
  plazos: QuotationPlazosPagoPair,
): QuotationPaymentInstallment[] => {
  const activePlazos = hasSecondInstallment(plazos) ? plazos : [plazos[0]];

  return activePlazos.map((plazo) => ({
    ...(plazo.id != null ? { id: plazo.id } : {}),
    porcentaje: plazo.porcentaje,
    plazo_de_pago: plazo.plazo_de_pago,
    orden: plazo.orden,
  }));
};
