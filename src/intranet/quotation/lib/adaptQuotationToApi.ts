import { serializeEtapas } from "@/intranet/services/api/service.api";
import type { CreateQuotationBody } from "../interfaces/responses.dto";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";

type UpsertQuotationData = Omit<DesiredQuotationData, "status" | "client">;

/** Convierte el estado del front al body que espera POST/PUT /cotizaciones. */
export const toQuotationApiBody = (
  data: UpsertQuotationData,
): Omit<CreateQuotationBody, "id_solicitud" | "DNI_O_RUC"> => {
  const body: Omit<CreateQuotationBody, "id_solicitud" | "DNI_O_RUC"> = {
    nombre: data.name || "cotización",
    condiciones: {
      condiciones: data.quotationConditions.conditions,
      fechaEmision: data.quotationConditions.emissionDate,
      fechaVigencia: data.quotationConditions.expirationDate,
      observaciones: data.quotationConditions.observations,
    },
    costoRecojo: {
      costo: data.pickupService.pickupCost,
      direccionRecojo: data.pickupService.pickupAddress,
      fechaRecojo: data.pickupService.pickupDate,
    },
    id_camion: data.trucks[0]?.plate ?? "",
    productos: data.inventory.map(({ nombre: _nombre, ...rest }) => rest),
    servicios: data.services.map((service) => ({
      id: service.id,
      startDate: service.startDate,
      dueDate: service.dueDate,
      schedule: service.schedule,
      unitPrice: service.unitPrice,
      fecha_inicio: service.startDate,
      fecha_finalizacion: service.dueDate,
      jornada: service.schedule,
      precio_comercial: service.unitPrice,
      ...(service.name ? { nombre: service.name } : {}),
      ...(service.isPrincipal !== undefined
        ? { isPrincipal: service.isPrincipal }
        : {}),
      ...(service.faseOrden != null ? { faseOrden: service.faseOrden } : {}),
      ...(service.pagoPorDia !== undefined
        ? { pago_por_dia: service.pagoPorDia }
        : {}),
    })),
    tasaCambio: {
      tasaCompra: data.quotationRate.buyingRate,
      tasaVenta: data.quotationRate.sellingRate,
    },
  };

  if (data.phases.items.length > 0) {
    body.etapas = serializeEtapas(data.phases.items);
  }

  if (data.projectStartDate) {
    body.fecha_inicio_proyecto = data.projectStartDate;
  }

  if (data.trucks.length > 0) {
    body.camiones = data.trucks.map((truck) => ({
      placa: truck.plate,
      modelo: truck.model,
      color: truck.color,
      caracteristicas: truck.description,
      fechaProximaRevision: truck.maintenanceDate,
      ...(truck.uso ? { uso: truck.uso } : {}),
      ...(truck.fecha_hora_entrada
        ? { fecha_hora_entrada: truck.fecha_hora_entrada }
        : {}),
      ...(truck.fecha_hora_salida
        ? { fecha_hora_salida: truck.fecha_hora_salida }
        : {}),
    }));
  }

  return body;
};
