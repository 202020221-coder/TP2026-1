import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/intranet/orders/api/order.api";
import { getExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";
import type { GetOrderResponseDTO } from "@/intranet/orders/interfaces";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";
import { addDays, format } from "date-fns";
const STALE_TIME = Infinity;

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
  const quotationRate = await getExchangeRate();
  return {
    name: "",
    client: {
      comercialName: getOrderResponseDTO.Cliente_Nombre,
      companyName: getOrderResponseDTO.Razon_Social,
      DNIorRUC: getOrderResponseDTO.Id_Cliente,
    },
    inventory: getOrderResponseDTO.inventario.map((item) => ({
      id: item.id.toString(),
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio_unitario: Number(item.precio_unitario),
      ...(item.intencion === "alquilar"
        ? {
            intencion: "alquilar" as const,
            dias_alquilados: item.dias_alquilados ?? 1,
          }
        : {
            intencion: "comprar" as const,
            dias_alquilados: null,
          }),
    })),
    pickupService: {
      pickupAddress: getOrderResponseDTO.ubicacion,
      pickupCost: 0.0,
      pickupDate: format(new Date(), "yyyy-MM-dd"),
    },
    quotationConditions: {
      conditions: "",
      observations: "",
      emissionDate: format(new Date(), "yyyy-MM-dd"),
      expirationDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    },
    status: "pendiente",
    trucks: [],
    services: getOrderResponseDTO.servicios.map((s) => {
      return {
        id: s.ID_Servicio.toString(),
        startDate: s.fecha_inicio_servicio.split("T")[0],
        dueDate: s.fecha_fin_servicio.split("T")[0],
        schedule: s.horario_servicio,
        unitPrice: 0.0,
        name: `Servicio #${s.ID_Servicio}`,
      };
    }),
    quotationRate,
    phases: {
      quantity: 1,
      duration: 1
    }
  };
};
