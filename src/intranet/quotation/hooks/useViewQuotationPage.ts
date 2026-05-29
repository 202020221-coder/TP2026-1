import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getQuotationForAdmin } from "../api/quotation.api";
import type { QuotationAdminDetailData } from "../interfaces/quotation-admin-detail.dto";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";
import { format } from "date-fns";

export const useViewQuotationPage = () => {
  const { quotationId } = useParams<{ quotationId: string }>();
  const enabled = !!quotationId;

  const query = useQuery({
    queryKey: ["quotation", "admin", quotationId],
    queryFn: async () => {
      try {
        const dto = await getQuotationForAdmin(Number(quotationId));
        return adaptDTO(dto);
      } catch (error) {
        console.log(error);
        throw new Error("ERROR CURRIOs");
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled,
  });

  return {
    quotationId,
    data: query.data ?? null,
    isPending: query.isPending,
    isError: query.isError,
  };
};

const adaptDTO = (dto: QuotationAdminDetailData): DesiredQuotationData => {
  return {
    name: dto.nombre,
    client: {
      comercialName: dto.cliente.nombreComercial,
      companyName: dto.cliente.razonSocial,
      DNIorRUC: dto.cliente.documentoIdentidad,
    },
    pickupService: {
      pickupAddress: dto.costoRecojo?.direccionRecojo ?? "",
      pickupCost: dto.costoRecojo?.costo ?? 0.0,
      pickupDate:
        dto.costoRecojo?.fechaRecojo ?? format(new Date(), "yyyy-MM-dd"),
    },
    quotationConditions: {
      conditions: dto.condiciones.condiciones ?? "",
      observations: dto.condiciones.observaciones ?? "",
      emissionDate: dto.condiciones.fechaEmision,
      expirationDate: dto.condiciones.fechaVigencia,
    },
    status: dto.estado as DesiredQuotationData["status"],
    inventory: dto.productos.map(
      (p) =>
        ({
          ...p,
          precio_unitario: p.precioUnitario,
        }) as DesiredQuotationData["inventory"][number],
    ),
    quotationRate: {
      buyingRate: dto.tipoCambio.tasaCompra,
      sellingRate: dto.tipoCambio.tasaVenta,
    },
    services: dto.servicios.map((s) => {
      return {
        id: s.idServicio.toString(),
        dueDate: s.fecha_finalizacion.split("T")[0],
        startDate: s.fecha_inicio.split("T")[0],
        schedule: s.jornada,
        unitPrice: Number(s.precio_comercial),
        name: s.nombre,
      };
    }),
    trucks: dto.camiones.map((t) => {
      return {
        plate: t.placa,
        color: t.color,
        description: t.caracteristicas,
        maintenanceDate: t.fechaProximaRevision,
        model: t.modelo,
      };
    }),
    phases: {
      quantity: dto.etapas ?? 1,
      duration: dto.duracion_etapas ?? 1,
    },
  };
};
