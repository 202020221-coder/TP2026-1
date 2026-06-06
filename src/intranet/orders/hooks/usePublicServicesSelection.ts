import { useQuery } from "@tanstack/react-query";
import { getServiciosPublicos } from "@/intranet/services/api/service.api";
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
    queryFn: getServiciosPublicos,
    staleTime: 60_000,
    retry: 1,
  });

  const serviceOptions: ServiceOption[] = (query.data ?? [])
    .filter((s) => s.activo)
    .map((s) => ({
      id: `service-${s.id}`,
      serviceId: s.id,
      name: s.nombre,
      description: s.descripcion || s.observaciones || "",
      price: s.precio_regular,
      imageUrl: resolveServicioFotoUrl(s.foto) || undefined,
      Icon: pickServicioIcon(s.nombre),
    }));

  return {
    serviceOptions,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  };
}
