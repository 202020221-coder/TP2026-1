import { useQuery } from "@tanstack/react-query";
import {
  getServiciosPublicos,
  getServicioPrincipal,
} from "@/intranet/services/api/service.api";
import { resolveServicioFotoUrl } from "@/intranet/services/lib/servicio-foto";
import { pickServicioIcon } from "@/intranet/services/lib/pick-servicio-icon";
import type { ServiceOption } from "../components/create/types";

export const PUBLIC_SERVICES_SELECTION_KEY = [
  "create-request",
  "servicios-publicos",
] as const;

export function usePublicServicesSelection() {
  const query = useQuery({
    queryKey: PUBLIC_SERVICES_SELECTION_KEY,
    queryFn: async () => {
      const servicios = (await getServiciosPublicos()).filter((s) => s.activo);
      // Trae las fases reales (etapas) de cada servicio en paralelo.
      const plantillas = await Promise.all(
        servicios.map((s) =>
          getServicioPrincipal(s.id).catch(() => ({
            fases: [],
            subservicios: [],
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
