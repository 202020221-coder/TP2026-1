import type { ServicioEtapaPayload } from "@/intranet/services/interfaces/service";
import type { ServicioFase } from "@/intranet/services/interfaces/service";
import { getServicioPrincipal, type ServicioPrincipalTemplate } from "@/intranet/services/api/service.api";
import { getOrder } from "@/intranet/orders/api/order.api";
import type { QuotationPhase } from "../interfaces/phases.types";
import type { QuotationAdminDetailData } from "../interfaces/quotation-admin-detail.dto";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";
import { normalizeTime, parseJornada } from "./quotationSchedule";
import { format } from "date-fns";

const EMPTY_TEMPLATE: ServicioPrincipalTemplate = {
  fases: [],
  subservicios: [],
  principalPagoPorDia: false,
};

type EtapaRaw = ServicioEtapaPayload & {
  name?: string;
  description?: string;
  duration?: number | string;
};

const mapFaseToQuotationPhase = (fase: ServicioFase): QuotationPhase => ({
  id: fase.id,
  name: fase.name,
  description: fase.description,
  duration: fase.duration,
  activities: fase.activities.map((activity) => ({
    id: activity.id,
    name: activity.name,
  })),
});

const mergePhasesByName = (phases: QuotationPhase[]): QuotationPhase[] => {
  const seen = new Set<string>();
  const merged: QuotationPhase[] = [];
  for (const phase of phases) {
    const key = phase.name.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(phase);
  }
  return merged;
};

export const mapApiEtapasToPhases = (etapas: unknown): QuotationPhase[] => {
  if (!Array.isArray(etapas) || etapas.length === 0) {
    return [];
  }

  const sorted = [...etapas].sort(
    (a, b) => Number((a as EtapaRaw).orden ?? 0) - Number((b as EtapaRaw).orden ?? 0),
  );

  return sorted.map((raw, index) => {
    const etapa = raw as EtapaRaw;
    const actividades = etapa.actividades ?? [];

    return {
      id: String(etapa.id ?? `fase_${index + 1}`),
      name: etapa.nombre ?? etapa.name ?? "",
      description: etapa.descripcion ?? etapa.description ?? "",
      duration: Math.max(1, Number(etapa.duracion ?? etapa.duration ?? 1) || 1),
      activities: Array.isArray(actividades)
        ? actividades.map((actividad, actIndex) => ({
            id: String(actividad.id ?? `act_${index + 1}_${actIndex + 1}`),
            name: actividad.nombre ?? actividad.name ?? "",
          }))
        : [],
    };
  });
};

async function resolvePhasesFromQuotationServices(
  services: DesiredQuotationData["services"],
): Promise<QuotationPhase[]> {
  const serviceIds = [
    ...new Set(
      services.map((s) => Number(s.id)).filter((id) => Number.isFinite(id) && id > 0),
    ),
  ];

  if (serviceIds.length === 0) return [];

  const templates = (await Promise.all(
    serviceIds.map((id) =>
      getServicioPrincipal(id).catch(() => EMPTY_TEMPLATE),
    ),
  )) as ServicioPrincipalTemplate[];

  const principalService = services.find((s) => s.isPrincipal);
  if (principalService) {
    const idx = serviceIds.indexOf(Number(principalService.id));
    if (idx >= 0 && templates[idx].fases.length > 0) {
      return mergePhasesByName(
        templates[idx].fases.map(mapFaseToQuotationPhase),
      );
    }
  }

  for (let i = 0; i < serviceIds.length; i++) {
    const subsIds = new Set(templates[i].subservicios.map((sub) => sub.id));
    const hasLinkedSubs = serviceIds.some(
      (id) => id !== serviceIds[i] && subsIds.has(id),
    );
    if (hasLinkedSubs && templates[i].fases.length > 0) {
      return mergePhasesByName(
        templates[i].fases.map(mapFaseToQuotationPhase),
      );
    }
  }

  let bestTemplate = EMPTY_TEMPLATE;
  for (const template of templates) {
    if (template.fases.length > bestTemplate.fases.length) {
      bestTemplate = template;
    }
  }
  if (bestTemplate.fases.length > 0) {
    return mergePhasesByName(
      bestTemplate.fases.map(mapFaseToQuotationPhase),
    );
  }

  const mergedFromAll = mergePhasesByName(
    templates.flatMap((template) =>
      template.fases.map(mapFaseToQuotationPhase),
    ),
  );
  return mergedFromAll;
}

/** Dirección donde se realizará el servicio (solicitud / servicios). */
const resolvePickupAddress = (dto: QuotationAdminDetailData): string => {
  const saved = dto.costoRecojo?.direccionRecojo?.trim();
  if (saved) return saved;

  const principal = dto.servicios.find((s) => s.isPrincipal);
  const principalUbicacion = principal?.ubicacion?.trim();
  if (principalUbicacion) return principalUbicacion;

  for (const servicio of dto.servicios) {
    const ubicacion = servicio.ubicacion?.trim();
    if (ubicacion) return ubicacion;
  }

  return "";
};

async function resolvePickupAddressWithOrder(
  dto: QuotationAdminDetailData,
): Promise<string> {
  const fromQuotation = resolvePickupAddress(dto);
  if (fromQuotation) return fromQuotation;

  const orderId = dto.id_solicitud;
  if (!orderId) return "";

  try {
    const order = await getOrder(orderId);
    return order.ubicacion?.trim() ?? "";
  } catch {
    return "";
  }
}

type ProductoRaw = QuotationAdminDetailData["productos"][number] & {
  diasAlquilados?: number | string | null;
  ID_Inventario?: number | string;
  id_inventario?: number | string;
  precio_unitario?: number | string;
};

const parseRentalDays = (value: unknown): number | null => {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Normaliza un producto del GET de cotización al modelo interno. */
const normalizeProductoFromApi = (
  raw: ProductoRaw,
  validServiceIds: Set<string>,
): DesiredQuotationData["inventory"][number] => {
  const id = String(raw.id ?? raw.ID_Inventario ?? raw.id_inventario ?? "");
  const intencion = raw.intencion === "alquilar" ? "alquilar" : "comprar";
  const precio_unitario = Number(raw.precioUnitario ?? raw.precio_unitario ?? 0);

  let uso: string | null = null;
  if (intencion === "alquilar") {
    const rawLink =
      raw.servicio_a_alquilar ?? raw.id_servicio_alquiler ?? raw.ID_Servicio;
    if (rawLink != null && validServiceIds.has(String(rawLink))) {
      uso = String(rawLink);
    }
  }

  const dias =
    parseRentalDays(raw.dias_alquilados) ?? parseRentalDays(raw.diasAlquilados);

  if (intencion === "alquilar") {
    return {
      id,
      nombre: raw.nombre,
      cantidad: raw.cantidad,
      precio_unitario: Number.isFinite(precio_unitario) ? precio_unitario : 0,
      intencion: "alquilar",
      // 0 = no vino del API; se completa desde la solicitud en enrich.
      dias_alquilados: dias ?? 0,
      uso,
    };
  }

  return {
    id,
    nombre: raw.nombre,
    cantidad: raw.cantidad,
    precio_unitario: Number.isFinite(precio_unitario) ? precio_unitario : 0,
    intencion: "comprar",
    dias_alquilados: null,
  };
};

/** Si el GET no trae días correctos, los recupera de la solicitud vinculada. */
async function resolveInventoryDaysFromOrder(
  dto: QuotationAdminDetailData,
  inventory: DesiredQuotationData["inventory"],
): Promise<DesiredQuotationData["inventory"]> {
  const orderId = dto.id_solicitud;
  if (!orderId) {
    return inventory.map((item) =>
      item.intencion === "alquilar" && !parseRentalDays(item.dias_alquilados)
        ? { ...item, dias_alquilados: 1 }
        : item,
    );
  }

  if (!inventory.some((i) => i.intencion === "alquilar")) return inventory;

  try {
    const order = await getOrder(orderId);
    const daysByItemId = new Map<string, number>();
    for (const row of order.inventario) {
      if (row.intencion !== "alquilar") continue;
      const days =
        parseRentalDays(row.dias_alquilados) ??
        parseRentalDays(
          (row as { diasAlquilados?: number | string }).diasAlquilados,
        );
      if (days != null) daysByItemId.set(String(row.ID_Inventario), days);
    }

    return inventory.map((item) => {
      if (item.intencion !== "alquilar") return item;

      const fromOrder = daysByItemId.get(String(item.id));
      const backendDays = parseRentalDays(item.dias_alquilados);

      // Alquiler manual (sin servicio): la solicitud manda; el backend a veces
      // recalcula días según la duración del proyecto/servicio.
      if (!item.uso && fromOrder != null) {
        return { ...item, dias_alquilados: fromOrder };
      }

      if (backendDays) return item;

      if (fromOrder != null) {
        return { ...item, dias_alquilados: fromOrder };
      }

      return { ...item, dias_alquilados: 1 };
    });
  } catch {
    return inventory.map((item) =>
      item.intencion === "alquilar" && !parseRentalDays(item.dias_alquilados)
        ? { ...item, dias_alquilados: 1 }
        : item,
    );
  }
}

type TruckUsage = {
  uso: string | null;
  fecha_hora_entrada: string | null;
  fecha_hora_salida: string | null;
};

/**
 * Resuelve el `uso` (id de servicio) de un camión contra los servicios reales
 * de la cotización. El backend a veces devuelve un `uso` que no coincide con
 * ningún servicio actual; en ese caso lo reasignamos por fecha de entrada o lo
 * dejamos vacío para que el PUT no falle con "uso X no corresponde...".
 */
const buildTruckUsageResolver = (
  servicios: QuotationAdminDetailData["servicios"],
) => {
  const validServiceIds = new Set(servicios.map((s) => String(s.idServicio)));
  const serviceIdByStartDate = new Map<string, string>();
  for (const servicio of servicios) {
    const start = servicio.fecha_inicio?.split("T")[0];
    if (start && !serviceIdByStartDate.has(start)) {
      serviceIdByStartDate.set(start, String(servicio.idServicio));
    }
  }

  return (
    camion: QuotationAdminDetailData["camiones"][number],
  ): TruckUsage => {
    const entrada = camion.fecha_hora_entrada ?? null;
    const salida = camion.fecha_hora_salida ?? null;
    const rawUso = camion.uso != null ? String(camion.uso) : null;

    if (rawUso && validServiceIds.has(rawUso)) {
      return { uso: rawUso, fecha_hora_entrada: entrada, fecha_hora_salida: salida };
    }

    const entradaDate = entrada?.split("T")[0];
    if (entradaDate && serviceIdByStartDate.has(entradaDate)) {
      return {
        uso: serviceIdByStartDate.get(entradaDate) ?? null,
        fecha_hora_entrada: entrada,
        fecha_hora_salida: salida,
      };
    }

    return { uso: null, fecha_hora_entrada: null, fecha_hora_salida: null };
  };
};

export const adaptQuotationAdminDetail = (
  dto: QuotationAdminDetailData,
): DesiredQuotationData => {
  const phases = mapApiEtapasToPhases(dto.etapas);
  const resolveTruckUsage = buildTruckUsageResolver(dto.servicios);
  const validServiceIds = new Set(
    dto.servicios.map((s) => String(s.idServicio)),
  );
  const projectStartDate =
    dto.fecha_inicio_proyecto?.split("T")[0] ??
    dto.servicios
      .map((s) => s.fecha_inicio.split("T")[0])
      .filter(Boolean)
      .sort()[0] ??
    format(new Date(), "yyyy-MM-dd");

  return {
    name: dto.nombre,
    client: {
      comercialName: dto.cliente.nombreComercial,
      companyName: dto.cliente.razonSocial,
      DNIorRUC: dto.cliente.documentoIdentidad,
    },
    pickupService: {
      pickupAddress: resolvePickupAddress(dto),
      pickupCost: dto.costoRecojo?.costo ?? 0.0,
      pickupDate:
        dto.costoRecojo?.fechaRecojo?.split("T")[0] ??
        format(new Date(), "yyyy-MM-dd"),
    },
    quotationConditions: {
      conditions: dto.condiciones.condiciones ?? "",
      observations: dto.condiciones.observaciones ?? "",
      emissionDate: dto.condiciones.fechaEmision,
      expirationDate: dto.condiciones.fechaVigencia,
      plazosPago: dto.plazos_pago
    },
    status: dto.estado as DesiredQuotationData["status"],
    inventory: dto.productos.map((p) =>
      normalizeProductoFromApi(p, validServiceIds),
    ),
    quotationRate: {
      buyingRate: dto.tipoCambio.tasaCompra,
      sellingRate: dto.tipoCambio.tasaVenta,
    },
    services: dto.servicios.map((s) => {
      const fallback = parseJornada(s.jornada);
      const scheduleStart =
        normalizeTime(s.jornada_comienzo) || fallback.start;
      const scheduleEnd = normalizeTime(s.jornada_final) || fallback.end;
      return {
      id: s.idServicio.toString(),
      dueDate: s.fecha_finalizacion.split("T")[0],
      startDate: s.fecha_inicio.split("T")[0],
      scheduleStart,
      scheduleEnd,
      unitPrice: Number(s.precio_comercial),
      name: s.nombre,
      isPrincipal: s.isPrincipal,
      faseOrden: s.faseOrden ?? null,
      pagoPorDia: s.pagoPorDia,
      };
    }),
    trucks: dto.camiones.map((t) => {
      const usage = resolveTruckUsage(t);
      return {
        plate: t.placa,
        color: t.color,
        description: t.caracteristicas,
        maintenanceDate: t.fechaProximaRevision,
        model: t.modelo,
        uso: usage.uso,
        fecha_hora_entrada: usage.fecha_hora_entrada,
        fecha_hora_salida: usage.fecha_hora_salida,
      };
    }),
    phases: { items: phases },
    projectStartDate,
    incidentQuotationId: dto.Id_incidencia ?? null,
  };
};

/** Completa etapas y dirección de entrega desde servicio/solicitud si faltan. */
export async function enrichQuotationAdminDetail(
  dto: QuotationAdminDetailData,
): Promise<DesiredQuotationData> {
  const base = adaptQuotationAdminDetail(dto);

  const [phasesFromServices, pickupAddress, inventory] = await Promise.all([
    base.phases.items.length > 0
      ? Promise.resolve([])
      : resolvePhasesFromQuotationServices(base.services),
    base.pickupService.pickupAddress.trim()
      ? Promise.resolve(base.pickupService.pickupAddress)
      : resolvePickupAddressWithOrder(dto),
    resolveInventoryDaysFromOrder(dto, base.inventory),
  ]);

  return {
    ...base,
    inventory,
    phases:
      base.phases.items.length > 0
        ? base.phases
        : { items: phasesFromServices },
    pickupService: {
      ...base.pickupService,
      pickupAddress: pickupAddress || base.pickupService.pickupAddress,
    },
  };
}
