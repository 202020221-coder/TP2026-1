import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { getServiciosPublicos } from "@/intranet/services/api/service.api";
import type { Servicio, ServicioFase } from "@/intranet/services/interfaces/service";
import { resolveServicioFotoUrl } from "@/intranet/services/lib/servicio-foto";
import { pickServicioIcon } from "@/intranet/services/lib/pick-servicio-icon";

export const LANDING_SERVICES_QUERY_KEY = ["landing", "servicios"] as const;

export interface LandingService {
  /** Clave única para React (origen + id). */
  key: string;
  id: number;
  name: string;
  description: string;
  image: string;
  icon: LucideIcon;
  /** true si proviene del backend (endpoint público); false si es estático. */
  isDynamic: boolean;
  /** Observaciones del servicio (solo para servicios del backend). */
  observaciones?: string;
  /** Fases predeterminadas del servicio (solo para servicios del backend). */
  fases?: ServicioFase[];
  /** Detalle enriquecido (solo para los servicios estáticos de la landing). */
  details?: {
    description: string;
    highlightTitle: string;
    highlightText: string;
    listTitle: string;
    listItems: string[];
  };
}

function mapServicio(servicio: Servicio): LandingService {
  return {
    key: `api-${servicio.id}`,
    id: servicio.id,
    name: servicio.nombre,
    description: servicio.descripcion,
    image: resolveServicioFotoUrl(servicio.foto),
    icon: pickServicioIcon(servicio.nombre),
    isDynamic: true,
    observaciones: servicio.observaciones,
    fases: servicio.fases,
  };
}

/**
 * Trae los servicios desde el endpoint público y filtra solo los que están
 * activos y tienen imagen. Si la petición falla (p. ej. el endpoint público
 * aún no existe), devuelve una lista vacía y la landing muestra solo los
 * servicios estáticos.
 */
export function useLandingServices() {
  const query = useQuery({
    queryKey: LANDING_SERVICES_QUERY_KEY,
    queryFn: getServiciosPublicos,
    staleTime: 60_000,
    retry: 1,
  });

  const apiServices: LandingService[] = (query.data ?? [])
    .filter((s) => s.activo && !!s.foto && s.foto.trim().length > 0)
    .map(mapServicio);

  return {
    apiServices,
    isLoading: query.isPending,
    isError: query.isError,
  };
}
