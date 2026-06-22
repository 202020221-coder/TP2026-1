import { useQuery } from "@tanstack/react-query";
import {
  getServiciosParaSolicitud,
  getServicioPrincipal,
} from "@/intranet/services/api/service.api";
import { isServicioDisponibleParaSolicitud } from "@/intranet/services/lib/servicio-incidencia";
import { resolveServicioFotoUrl } from "@/intranet/services/lib/servicio-foto";
import { pickServicioIcon } from "@/intranet/services/lib/pick-servicio-icon";
import type { ServiceOption } from "../components/create/types";

export const PUBLIC_SERVICES_SELECTION_KEY = [
  "create-request",
  "servicios-solicitud",
] as const;

export function usePublicServicesSelection() {
  const query = useQuery({
    queryKey: PUBLIC_SERVICES_SELECTION_KEY,
    queryFn: async () => {
      const servicios = (await getServiciosParaSolicitud()).filter(
        isServicioDisponibleParaSolicitud,
      );
      const plantillas = await Promise.all(
        servicios.map((s) =>
          getServicioPrincipal(s.id).catch(() => ({
            fases: [],
            subservicios: [],
            principalPagoPorDia: false,
          })),
        ),
      );
      return servicios.map((s, i) => ({
        servicio: s,
        fases: plantillas[i].fases,
      }));
    },
    staleTime: 60_000,
    retry: 1,
  });

  const serviceOptions: ServiceOption[] = (query.data ?? []).map(
    ({ servicio: s, fases }) => ({
      id: `service-${s.id}`,
      serviceId: s.id,
      name: s.nombre,
      description: s.descripcion || s.observaciones || "",
      price: s.precio_regular,
      imageUrl: resolveServicioFotoUrl(s.foto) || undefined,
      Icon: pickServicioIcon(s.nombre),
      fases: fases.length > 0 ? fases : s.fases,
    }),
  );

  return {
    serviceOptions,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  };
}
