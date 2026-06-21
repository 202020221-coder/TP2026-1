import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/intranet/orders/api/order.api";
import { getExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";
import { enrichOrderQuotationData } from "../lib/adaptOrderToQuotation";
import type { GetOrderResponseDTO } from "@/intranet/orders/interfaces";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";
import { addDays, format } from "date-fns";
import { DEFAULT_PLAZOS_PAGO } from "../lib/quotation-plazos-pago";
const STALE_TIME = 0;

export const useCreateQuotationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const enabled = !!orderId;

  const quotationInitialData = useQuery({
    queryKey: ["order", "details", orderId],
    queryFn: async () => {
      const order = await getOrder(Number(orderId))
      return await adaptDTO(order)
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
    enabled,
  });

  

  return {
    orderId,
    initialData: quotationInitialData.data ?? null,
    isPending: quotationInitialData.isPending || quotationInitialData.isPending,
    isError: quotationInitialData.isError || quotationInitialData.isError,
  };
};

const adaptDTO = async (
  getOrderResponseDTO: GetOrderResponseDTO,
): Promise<DesiredQuotationData> => {
  const [quotationRate, enriched] = await Promise.all([
    getExchangeRate(),
    enrichOrderQuotationData(getOrderResponseDTO),
  ]);

  return {
    name: enriched.name,
    client: {
      comercialName: getOrderResponseDTO.Cliente_Nombre,
      companyName: getOrderResponseDTO.Razon_Social,
      DNIorRUC: getOrderResponseDTO.Id_Cliente,
    },
    inventory: enriched.inventory,
    pickupService: {
      pickupAddress: getOrderResponseDTO.ubicacion,
      pickupCost: 0.0,
      pickupDate: format(new Date(), "yyyy-MM-dd"),
    },
    quotationConditions: {
      conditions: "",
      observations: getOrderResponseDTO.ObsGenerales ?? "",
      emissionDate: format(new Date(), "yyyy-MM-dd"),
      expirationDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      plazosPago: DEFAULT_PLAZOS_PAGO
    },
    status: "pendiente",
    trucks: [],
    services: enriched.services,
    quotationRate,
    phases: enriched.phases,
    projectStartDate: enriched.projectStartDate,
  };
};
