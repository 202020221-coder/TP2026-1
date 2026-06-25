import { format } from "date-fns";
import { getInventoryItems } from "@/intranet/quotation/api/quotation.api";
import { inventoryApi } from "@/intranet/inventory/api/inventory.api";
import type { InventoryItem } from "@/intranet/quotation/interfaces/create/order-inventory";
import type { QuotationPhase } from "@/intranet/quotation/interfaces/phases.types";
import type { DesiredQuotationData } from "@/intranet/quotation/interfaces/upsert/desiredQuotationInitialData";
import type { GetOrderResponseDTO } from "@/intranet/orders/interfaces";
import {
  resolveOrderInventoryObjectId,
  resolveOrderInventoryObjectName,
} from "@/intranet/orders/lib/normalize-order-inventory";
import {
  getServicioPrincipal,
  getServicios,
  type ServicioPrincipalTemplate,
} from "@/intranet/services/api/service.api";
import type {
  Servicio,
  ServicioFase,
} from "@/intranet/services/interfaces/service";
import {
  extractServiceNameFromDescription,
  findCatalogServiceByName,
  normalizeOrderServices,
  type OrderDetailWithServices,
} from "@/intranet/orders/lib/order-service.utils";
import { computeServiceDates, parseJornada } from "./quotationSchedule";

const DEFAULT_SCHEDULE = { start: "08:00", end: "17:00" } as const;

const EMPTY_TEMPLATE: ServicioPrincipalTemplate = {
  fases: [],
  subservicios: [],
  principalPagoPorDia: false,
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
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(phase);
  }
  return merged;
};

const isInventoryActive = (estado: string | undefined): boolean => {
  if (!estado) return true;
  const normalized = estado.trim().toLowerCase();
  return normalized === "activo" || normalized === "disponible";
};

type InventoryCatalogEntry = Pick<
  InventoryItem,
  "Id_Objeto" | "nombre_objeto" | "precio_comercial" | "estado"
>;

const toCatalogEntry = (item: InventoryItem): InventoryCatalogEntry => ({
  Id_Objeto: item.Id_Objeto,
  nombre_objeto: item.nombre_objeto,
  precio_comercial: item.precio_comercial,
  estado: item.estado,
});

const toCatalogEntryFromDetail = (
  item: Awaited<ReturnType<typeof inventoryApi.getById>>,
): InventoryCatalogEntry => ({
  Id_Objeto: item.Id_Objeto,
  nombre_objeto: item.nombre_objeto,
  precio_comercial: String(item.precio_comercial ?? 0),
  estado: String(item.estado ?? ""),
});

async function loadInventoryCatalogForOrder(
  orderItems: GetOrderResponseDTO["inventario"],
): Promise<Map<number, InventoryCatalogEntry>> {
  const neededIds = [
    ...new Set(
      orderItems
        .map((item) => resolveOrderInventoryObjectId(item))
        .filter((id) => id > 0),
    ),
  ];
  const map = new Map<number, InventoryCatalogEntry>();
  if (neededIds.length === 0) return map;

  const limit = 100;
  for (let page = 1; page <= 15; page++) {
    const batch = await getInventoryItems({ page, limit }).catch(() => ({
      data: [] as InventoryItem[],
      pagination: { page, limit, total: 0, totalPages: 0 },
    }));
    for (const item of batch.data) {
      map.set(item.Id_Objeto, toCatalogEntry(item));
    }
    const allFound = neededIds.every((id) => map.has(id));
    if (allFound || batch.data.length < limit) break;
  }

  const missingIds = neededIds.filter((id) => !map.has(id));
  if (missingIds.length > 0) {
    const details = await Promise.all(
      missingIds.map((id) => inventoryApi.getById(id).catch(() => null)),
    );
    for (const detail of details) {
      if (detail) {
        map.set(detail.Id_Objeto, toCatalogEntryFromDetail(detail));
      }
    }
  }

  return map;
}

export async function enrichOrderQuotationData(
  order: GetOrderResponseDTO,
): Promise<
  Pick<
    DesiredQuotationData,
    "phases" | "services" | "inventory" | "name" | "projectStartDate"
  >
> {
  const orderDetail = order as OrderDetailWithServices;
  const { allServices, principal } = normalizeOrderServices(orderDetail);

  const [catalogResponse, inventoryById] = await Promise.all([
    getServicios({ page: 1, limit: 100 }).catch(() => ({
      data: [] as Servicio[],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
    })),
    loadInventoryCatalogForOrder(order.inventario ?? []),
  ]);

  const catalogById = new Map<number, Servicio>(
    catalogResponse.data.map((service) => [service.id, service]),
  );

  let principalServiceId = principal?.ID_Servicio ?? null;
  if (principalServiceId == null) {
    const serviceName = extractServiceNameFromDescription(order.descripcion);
    const catalogService = await findCatalogServiceByName(serviceName);
    principalServiceId = catalogService?.id ?? null;
  }

  const principalTemplate = principalServiceId
    ? await getServicioPrincipal(principalServiceId).catch(() => EMPTY_TEMPLATE)
    : EMPTY_TEMPLATE;

  const phases = mergePhasesByName(
    principalTemplate.fases.map(mapFaseToQuotationPhase),
  );

  const projectStartDate = format(new Date(), "yyyy-MM-dd");
  const phasesObj = { items: phases };

  const faseOrdenById = new Map<string, number>();
  phases.forEach((phase, index) => faseOrdenById.set(phase.id, index + 1));

  type QuotationService = DesiredQuotationData["services"][number];

  const templateSubById = new Map(
    principalTemplate.subservicios.map((sub) => [sub.id, sub]),
  );

  const resolveFaseOrden = (
    serviceId: number,
    ubicacionOrden: number | null,
  ): number | null => {
    if (ubicacionOrden != null && ubicacionOrden > 0) return ubicacionOrden;
    const templateSub = templateSubById.get(serviceId);
    if (templateSub) {
      const fromTemplate = templateSub.faseIds
        .map((faseId) => faseOrdenById.get(faseId))
        .find((orden) => orden != null);
      if (fromTemplate != null) return fromTemplate;
      if (templateSub.ubicacion_etapa?.orden) {
        return templateSub.ubicacion_etapa.orden;
      }
    }
    return phases.length > 0 ? 1 : null;
  };

  const buildService = (opts: {
    id: number;
    name: string;
    unitPrice: number;
    isPrincipal: boolean;
    faseOrden: number | null;
    pagoPorDia: boolean;
    scheduleStart: string;
    scheduleEnd: string;
  }): QuotationService => {
    const dates = computeServiceDates(
      { isPrincipal: opts.isPrincipal, faseOrden: opts.faseOrden },
      projectStartDate,
      phasesObj,
    );
    return {
      id: opts.id.toString(),
      name: opts.name,
      startDate: dates.startDate,
      dueDate: dates.dueDate,
      scheduleStart: opts.scheduleStart,
      scheduleEnd: opts.scheduleEnd,
      unitPrice: opts.unitPrice,
      isPrincipal: opts.isPrincipal,
      faseOrden: opts.faseOrden,
      pagoPorDia: opts.pagoPorDia,
    };
  };

  const services: QuotationService[] = [];
  const addedIds = new Set<number>();

  const appendService = (
    serviceId: number,
    opts: Omit<Parameters<typeof buildService>[0], "id">,
  ) => {
    if (addedIds.has(serviceId)) return;
    services.push(buildService({ id: serviceId, ...opts }));
    addedIds.add(serviceId);
  };

  if (principalServiceId != null) {
    const catalog = catalogById.get(principalServiceId);
    const linked = allServices.find((s) => s.ID_Servicio === principalServiceId);
    const principalJornada = parseJornada(linked?.horario_servicio);
    appendService(principalServiceId, {
      name:
        linked?.nombre ??
        catalog?.nombre ??
        (extractServiceNameFromDescription(order.descripcion) ||
          `Servicio #${principalServiceId}`),
      unitPrice: catalog ? Number(catalog.precio_regular) : 0,
      isPrincipal: true,
      faseOrden: null,
      pagoPorDia:
        principalTemplate.principalPagoPorDia ||
        catalog?.pago_por_dia === true,
      scheduleStart: principalJornada.start || DEFAULT_SCHEDULE.start,
      scheduleEnd: principalJornada.end || DEFAULT_SCHEDULE.end,
    });
  }

  for (const linkedService of allServices) {
    const id = linkedService.ID_Servicio;
    if (id === principalServiceId) continue;
    if (addedIds.has(id)) continue;

    const catalog = catalogById.get(id);
    const templateSub = templateSubById.get(id);
    const parsed = parseJornada(linkedService.horario_servicio);

    appendService(id, {
      name:
        linkedService.nombre ??
        catalog?.nombre ??
        templateSub?.nombre ??
        `Servicio #${id}`,
      unitPrice: catalog ? Number(catalog.precio_regular) : 0,
      isPrincipal: false,
      faseOrden: resolveFaseOrden(
        id,
        linkedService.ubicacion_etapa?.orden ?? null,
      ),
      pagoPorDia:
        templateSub?.pagoPorDia === true || catalog?.pago_por_dia === true,
      scheduleStart: parsed.start || DEFAULT_SCHEDULE.start,
      scheduleEnd: parsed.end || DEFAULT_SCHEDULE.end,
    });
  }

  const inventory: DesiredQuotationData["inventory"] = (order.inventario ?? [])
    .map((item) => {
      const objectId = resolveOrderInventoryObjectId(item);
      const catalogItem = inventoryById.get(objectId);
      if (catalogItem && !isInventoryActive(catalogItem.estado)) return null;

      const nombre =
        resolveOrderInventoryObjectName(item) ||
        catalogItem?.nombre_objeto ||
        (objectId > 0 ? `Producto #${objectId}` : "Producto sin nombre");

      const precio = catalogItem
        ? Number(catalogItem.precio_comercial)
        : Number(item.precio_unitario);

      if (item.intencion === "alquilar") {
        const dias =
          Number(item.dias_alquilados) ||
          Number((item as { diasAlquilados?: number }).diasAlquilados) ||
          1;
        return {
          id: objectId.toString(),
          nombre,
          cantidad: item.cantidad,
          precio_unitario: Number.isFinite(precio) ? precio : 0,
          intencion: "alquilar" as const,
          dias_alquilados: dias,
          uso: null,
        };
      }

      return {
        id: objectId.toString(),
        nombre,
        cantidad: item.cantidad,
        precio_unitario: Number.isFinite(precio) ? precio : 0,
        intencion: "comprar" as const,
        dias_alquilados: null,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  const suggestedName = extractServiceNameFromDescription(order.descripcion);

  return {
    name: suggestedName || "",
    phases: { items: phases },
    services,
    inventory,
    projectStartDate,
  };
}
