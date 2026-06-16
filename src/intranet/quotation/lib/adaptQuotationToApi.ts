import type {
  QuotationApiBody,
  QuotationInventoryBody,
  QuotationServiceBody,
  QuotationTruckBody,
} from "../interfaces/responses.dto";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";

type UpsertQuotationData = Omit<DesiredQuotationData, "status" | "client">;

/** Convierte "yyyy-MM-dd" (o ISO) a DATETIME MySQL "yyyy-MM-dd HH:mm:ss". */
const toMysqlDateTime = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined;
  const datePart = value.split("T")[0].split(" ")[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return undefined;
  return `${datePart} 00:00:00`;
};

/**
 * Convierte el estado del front al body que esperan POST/PUT /cotizaciones.
 *
 * El vínculo camión → servicio se envía como `serviceIndex` (posición del
 * servicio en el array `services`). El backend, tras crear las filas
 * COTIZACION_SERVICIO en ese mismo orden, resuelve el PK correspondiente y lo
 * asigna como `uso` del camión. Así no necesitamos conocer el PK por adelantado
 * (que solo existe después de guardar).
 */
export const toQuotationApiBody = (
  data: UpsertQuotationData,
): QuotationApiBody => {
  const services: QuotationServiceBody[] = data.services.map((service) => {
    const base: QuotationServiceBody = {
      id: String(service.id),
      name: service.name ?? `Servicio #${service.id}`,
      startDate: service.startDate,
      dueDate: service.dueDate,
      jornada_comienzo: service.scheduleStart,
      jornada_final: service.scheduleEnd,
      unitPrice: service.unitPrice,
      Principal: Boolean(service.isPrincipal),
    };

    if (!service.isPrincipal && service.faseOrden != null) {
      base.id_servicio_subservicio = service.faseOrden;
    }

    if (service.pagoPorDia !== undefined) {
      base.pago_por_dia = service.pagoPorDia;
    }

    return base;
  });

  // Índice de cada servicio por su id de catálogo, para resolver camiones e
  // ítems de inventario en alquiler vinculados a un servicio.
  const serviceIndexById = new Map<string, number>();
  data.services.forEach((service, index) => {
    serviceIndexById.set(String(service.id), index);
  });

  const inventory: QuotationInventoryBody[] = data.inventory.map((item) => {
    const base: QuotationInventoryBody = {
      id: String(item.id),
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      intencion: item.intencion,
    };

    if (item.intencion === "alquilar") {
      const linkedIndex =
        item.uso != null && item.uso !== ""
          ? serviceIndexById.get(String(item.uso))
          : undefined;

      if (linkedIndex !== undefined) {
        // Vinculado a servicio: el backend deriva los días desde las fechas del
        // servicio. No enviar dias_alquilados para evitar conflictos.
        base.serviceIndex = linkedIndex;
      } else {
        // Alquiler manual (sin servicio): días explícitos, sin límite del proyecto.
        const dias = Number(item.dias_alquilados);
        base.dias_alquilados =
          Number.isFinite(dias) && dias > 0 ? dias : 1;
      }
    }

    return base;
  });

  const trucks: QuotationTruckBody[] = data.trucks.map((truck) => {
    const base: QuotationTruckBody = {
      plate: truck.plate,
      model: truck.model,
      color: truck.color,
      maintenanceDate: truck.maintenanceDate,
      description: truck.description,
    };

    const linkedIndex =
      truck.uso != null ? serviceIndexById.get(String(truck.uso)) : undefined;
    if (linkedIndex !== undefined) {
      base.serviceIndex = linkedIndex;

      // Enviamos las fechas en formato MySQL DATETIME para que el backend las
      // inserte directamente (evita el error "Incorrect datetime value" cuando
      // el backend reformatea la fecha del servicio como Date.toString()).
      const linkedService = data.services[linkedIndex];
      const entrada = toMysqlDateTime(linkedService?.startDate);
      const salida = toMysqlDateTime(linkedService?.dueDate);
      if (entrada) base.fecha_hora_entrada = entrada;
      if (salida) base.fecha_hora_salida = salida;
    }

    return base;
  });

  return {
    name: data.name || "cotización",
    fecha_inicio_proyecto: data.projectStartDate || undefined,
    quotationConditions: {
      emissionDate: data.quotationConditions.emissionDate,
      expirationDate: data.quotationConditions.expirationDate,
      conditions: data.quotationConditions.conditions,
      observations: data.quotationConditions.observations,
    },
    quotationRate: {
      buyingRate: data.quotationRate.buyingRate,
      sellingRate: data.quotationRate.sellingRate,
    },
    inventory,
    services,
    trucks,
    pickupService: {
      pickupCost: data.pickupService.pickupCost,
      pickupDate: data.pickupService.pickupDate,
      pickupAddress: data.pickupService.pickupAddress,
    },
    phases: data.phases,
  };
};
