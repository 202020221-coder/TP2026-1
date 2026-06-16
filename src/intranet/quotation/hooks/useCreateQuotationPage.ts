import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/intranet/orders/api/order.api";
import { getExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";
import type { GetOrderResponseDTO } from "@/intranet/orders/interfaces";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";
import { getIncidentById } from "@/intranet/incidents/api/incident.api";
import { getClients } from "@/intranet/incidents/api/clients.api";
import { addDays, format } from "date-fns";

const STALE_TIME = Infinity;

export const useCreateQuotationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const incidenciaId = searchParams.get("incidenciaId");
  const enabled = !!orderId || !!incidenciaId;

  const quotationInitialData = useQuery({
    queryKey: ["order", "details", orderId ?? `incidencia-${incidenciaId}`],
    queryFn: async () => {
      if (incidenciaId) {
        return await adaptFromIncident(Number(incidenciaId));
      }
      const order = await getOrder(Number(orderId));
      return await adaptFromOrder(order);
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
    enabled,
  });

  return {
    orderId,
    incidenciaId,
    initialData: quotationInitialData.data ?? null,
    isPending: quotationInitialData.isPending,
    isError: quotationInitialData.isError,
  };
};

const adaptFromOrder = async (
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
    services: getOrderResponseDTO.servicios.map((s) => ({
      id: s.ID_Servicio.toString(),
      startDate: s.fecha_inicio_servicio.split("T")[0],
      dueDate: s.fecha_fin_servicio.split("T")[0],
      schedule: s.horario_servicio,
      unitPrice: 0.0,
      name: `Servicio #${s.ID_Servicio}`,
    })),
    quotationRate,
    phases: { items: [] },
    // Propagate optional solicitud-only fields so the cotización creation
    // flow can forward them to the backend (names match PostRequestDTO so
    // the backend can reuse the same field handlers).
    productoenvio: getOrderResponseDTO.ProductoEnvio,
    camionesenvio: getOrderResponseDTO.CamionesEnvio,
    obsgenerales: getOrderResponseDTO.ObsGenerales,
    obseleccion: getOrderResponseDTO.ObsEleccion,
    medios: getOrderResponseDTO.medios?.map((m) => ({
      cliente_email: m.cliente_email,
      cliente_telefono: m.cliente_telefono,
    })),
    fechaCreacionSolicitud: getOrderResponseDTO.FechaCreacion,
  };
};

const adaptFromIncident = async (
  incidenciaId: number,
): Promise<DesiredQuotationData> => {
  const [incident, allClients, quotationRate] = await Promise.all([
    getIncidentById(incidenciaId),
    getClients(),
    getExchangeRate(),
  ]);

  const client = allClients.find(
    (c) => c.DNI_O_RUC === incident.empresa_involucrada,
  );

  return {
    name: "",
    client: {
      comercialName: client?.nombre_comercial ?? "",
      companyName: client?.razon_social ?? incident.Cliente_Nombre,
      DNIorRUC: incident.empresa_involucrada,
    },
    inventory: [],
    pickupService: {
      pickupAddress: "",
      pickupCost: 0,
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
    services: [],
    quotationRate,
    phases: { items: [] },
  };
};
