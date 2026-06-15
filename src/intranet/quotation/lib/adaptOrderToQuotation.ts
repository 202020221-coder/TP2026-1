import { format } from "date-fns";
import { getInventoryItems } from "@/intranet/quotation/api/quotation.api";
import type { QuotationPhase } from "@/intranet/quotation/interfaces/phases.types";
import type { DesiredQuotationData } from "@/intranet/quotation/interfaces/upsert/desiredQuotationInitialData";
import type { GetOrderResponseDTO } from "@/intranet/orders/interfaces";
import {
  getServicioPrincipal,
  getServicios,
} from "@/intranet/services/api/service.api";
import type {
  Servicio,
  ServicioFase,
  ServicioPrincipalTemplate,
} from "@/intranet/services/interfaces/service";
import { computeServiceDates } from "./quotationSchedule";

const EMPTY_TEMPLATE: ServicioPrincipalTemplate = {
  fases: [],
  subservicios: [],
  principalPagoPorDia: false,
};

const normalizeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.!]+$/g, "");

const extractServiceNameFromDescription = (descripcion: string): string => {
  const firstLine = descripcion.split("\n")[0]?.trim() ?? "";
  const match = firstLine.match(/^Solicito el servicio:\s*(.+)$/i);
  return (match?.[1] ?? firstLine).replace(/\.\s*$/, "").trim();
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

/** Busca un servicio en el catálogo por nombre (módulo Servicios). */
async function findCatalogServiceByName(name: string): Promise<Servicio | null> {
  if (!name.trim()) return null;
  const normalized = normalizeName(name);

  const searched = await getServicios({ page: 1, limit: 20, search: name }).catch(
    () => ({ data: [] as Servicio[], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }),
  );
  const fromSearch = searched.data.find(
    (service) => normalizeName(service.nombre) === normalized,
  );
  if (fromSearch) return fromSearch;

  for (let page = 1; page <= 5; page++) {
    const batch = await getServicios({ page, limit: 100 }).catch(
      () => ({ data: [] as Servicio[], pagination: { page: 1, limit: 100, total: 0, totalPages: 0 } }),
    );
    if (batch.data.length === 0) break;
    const found = batch.data.find(
      (service) => normalizeName(service.nombre) === normalized,
    );
    if (found) return found;
  }

  return null;
}

/**
 * Resuelve la plantilla del servicio principal desde el módulo Servicios.
 * Prioridad: nombre en la descripción de la solicitud → servicios vinculados.
 */
async function resolvePrincipalServiceTemplate(
  order: GetOrderResponseDTO,
  linkedIds: number[],
  linkedTemplates: ServicioPrincipalTemplate[],
): Promise<{ id: number | null; template: ServicioPrincipalTemplate }> {
  const serviceName = extractServiceNameFromDescription(order.descripcion);
  if (serviceName) {
    const catalogService = await findCatalogServiceByName(serviceName);
    if (catalogService) {
      const template = await getServicioPrincipal(catalogService.id).catch(
        () => EMPTY_TEMPLATE,
      );
      if (template.fases.length > 0) {
        return { id: catalogService.id, template };
      }
    }
  }

  if (linkedIds.length > 0) {
    for (let i = 0; i < linkedIds.length; i++) {
      const subsIds = new Set(
        linkedTemplates[i]?.subservicios.map((sub) => sub.id) ?? [],
      );
      const hasLinkedSubs = linkedIds.some(
        (id) => id !== linkedIds[i] && subsIds.has(id),
      );
      if (hasLinkedSubs && (linkedTemplates[i]?.fases.length ?? 0) > 0) {
        return { id: linkedIds[i], template: linkedTemplates[i] };
      }
    }

    let bestIndex = -1;
    let bestCount = 0;
    linkedTemplates.forEach((template, index) => {
      if (template.fases.length > bestCount) {
        bestCount = template.fases.length;
        bestIndex = index;
      }
    });
    if (bestIndex >= 0 && linkedTemplates[bestIndex].fases.length > 0) {
      return {
        id: linkedIds[bestIndex],
        template: linkedTemplates[bestIndex],
      };
    }

    for (const id of linkedIds) {
      const template = await getServicioPrincipal(id).catch(
        () => EMPTY_TEMPLATE,
      );
      if (template.fases.length > 0) {
        return { id, template };
      }
    }
  }

  return { id: null, template: EMPTY_TEMPLATE };
}

export async function enrichOrderQuotationData(
  order: GetOrderResponseDTO,
): Promise<
  Pick<
    DesiredQuotationData,
    "phases" | "services" | "inventory" | "name" | "projectStartDate"
  >
> {
  const linkedIds = order.servicios.map((service) => service.ID_Servicio);

  const [catalogResponse, inventoryResponse, ...linkedTemplates] =
    await Promise.all([
      getServicios({ page: 1, limit: 100 }).catch(() => ({
        data: [] as Servicio[],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
      })),
      getInventoryItems({ page: 1, limit: 100 }).catch(() => ({
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
      })),
      ...linkedIds.map((id) =>
        getServicioPrincipal(id).catch(() => EMPTY_TEMPLATE),
      ),
    ]);

  const catalogById = new Map<number, Servicio>(
    catalogResponse.data.map((service) => [service.id, service]),
  );
  const inventoryById = new Map(
    inventoryResponse.data.map((item) => [item.Id_Objeto, item]),
  );

  const { id: principalServiceId, template: principalTemplate } =
    await resolvePrincipalServiceTemplate(order, linkedIds, linkedTemplates);

  const phases = mergePhasesByName(
    principalTemplate.fases.map(mapFaseToQuotationPhase),
  );

  // Día de inicio del proyecto (ancla para calcular fechas). Por defecto hoy;
  // el usuario lo ajusta en la pestaña Datos de Referencia.
  const projectStartDate = format(new Date(), "yyyy-MM-dd");
  const phasesObj = { items: phases };

  // Mapa etapa.id → orden (1-based) para ubicar el subservicio en su etapa.
  const faseOrdenById = new Map<string, number>();
  phases.forEach((phase, index) => faseOrdenById.set(phase.id, index + 1));

  type QuotationService = DesiredQuotationData["services"][number];

  const buildService = (opts: {
    id: number;
    name: string;
    unitPrice: number;
    isPrincipal: boolean;
    faseOrden: number | null;
    pagoPorDia: boolean;
    schedule: string;
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
      schedule: opts.schedule,
      unitPrice: opts.unitPrice,
      isPrincipal: opts.isPrincipal,
      faseOrden: opts.faseOrden,
      pagoPorDia: opts.pagoPorDia,
    };
  };

  const services: QuotationService[] = [];
  const addedIds = new Set<string>();

  // 1) Servicio principal: abarca todo el proyecto.
  if (principalServiceId != null) {
    const catalog = catalogById.get(principalServiceId);
    if (!catalog || catalog.activo) {
      services.push(
        buildService({
          id: principalServiceId,
          name: catalog?.nombre ?? `Servicio #${principalServiceId}`,
          unitPrice: catalog ? Number(catalog.precio_regular) : 0,
          isPrincipal: true,
          faseOrden: null,
          pagoPorDia:
            principalTemplate.principalPagoPorDia ||
            catalog?.pago_por_dia === true,
          schedule: "Todo el proyecto",
        }),
      );
      addedIds.add(principalServiceId.toString());
    }
  }

  // 2) Subservicios de la plantilla: los vinculados en la solicitud o, si no
  //    hay ninguno vinculado, todos los definidos por el servicio principal.
  const linkedSet = new Set(linkedIds);
  const linkedTemplateSubs = principalTemplate.subservicios.filter((sub) =>
    linkedSet.has(sub.id),
  );
  const subsToInclude =
    linkedTemplateSubs.length > 0
      ? linkedTemplateSubs
      : principalTemplate.subservicios;

  for (const sub of subsToInclude) {
    if (addedIds.has(sub.id.toString())) continue;
    const catalog = catalogById.get(sub.id);
    if (catalog && !catalog.activo) continue;

    const faseOrden =
      sub.faseIds
        .map((faseId) => faseOrdenById.get(faseId))
        .find((orden) => orden != null) ?? null;

    services.push(
      buildService({
        id: sub.id,
        name: catalog?.nombre ?? sub.nombre,
        unitPrice: catalog ? Number(catalog.precio_regular) : 0,
        isPrincipal: false,
        faseOrden,
        pagoPorDia: sub.pagoPorDia === true || catalog?.pago_por_dia === true,
        schedule: "Por definir",
      }),
    );
    addedIds.add(sub.id.toString());
  }

  // 3) Servicios vinculados que no están en la plantilla: abarcan todo el
  //    proyecto (sin etapa específica).
  for (const linkedService of order.servicios) {
    const id = linkedService.ID_Servicio;
    if (id === principalServiceId) continue;
    if (addedIds.has(id.toString())) continue;
    const catalog = catalogById.get(id);
    if (catalog && !catalog.activo) continue;

    services.push(
      buildService({
        id,
        name: catalog?.nombre ?? `Servicio #${id}`,
        unitPrice: catalog ? Number(catalog.precio_regular) : 0,
        isPrincipal: false,
        faseOrden: null,
        pagoPorDia: catalog?.pago_por_dia === true,
        schedule: linkedService.horario_servicio || "Por definir",
      }),
    );
    addedIds.add(id.toString());
  }

  const inventory: DesiredQuotationData["inventory"] = order.inventario
    .map((item) => {
      const catalogItem = inventoryById.get(item.ID_Inventario);
      if (catalogItem && !isInventoryActive(catalogItem.estado)) return null;

      const precio = catalogItem
        ? Number(catalogItem.precio_comercial)
        : Number(item.precio_unitario);

      if (item.intencion === "alquilar") {
        return {
          id: item.ID_Inventario.toString(),
          nombre: catalogItem?.nombre_objeto ?? item.nombre,
          cantidad: item.cantidad,
          precio_unitario: Number.isFinite(precio) ? precio : 0,
          intencion: "alquilar" as const,
          dias_alquilados: item.dias_alquilados ?? 1,
        };
      }

      return {
        id: item.ID_Inventario.toString(),
        nombre: catalogItem?.nombre_objeto ?? item.nombre,
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
