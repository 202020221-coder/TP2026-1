import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Cylinder,
  Droplets,
  Flame,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { getServiciosPublicos } from "@/intranet/services/api/service.api";
import type { Servicio } from "@/intranet/services/interfaces/service";
import { resolveServicioFotoUrl } from "@/intranet/services/lib/servicio-foto";

export const LANDING_SERVICES_QUERY_KEY = ["landing", "servicios"] as const;

export interface LandingService {
  /** Clave única para React (origen + id). */
  key: string;
  id: number;
  name: string;
  description: string;
  image: string;
  icon: LucideIcon;
  /** Observaciones del servicio (solo para servicios del backend). */
  observaciones?: string;
  /** Detalle enriquecido (solo para los servicios estáticos de la landing). */
  details?: {
    description: string;
    highlightTitle: string;
    highlightText: string;
    listTitle: string;
    listItems: string[];
  };
}

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function pickIcon(nombre: string): LucideIcon {
  const n = normalize(nombre);
  if (n.includes("camion") || n.includes("cisterna")) return Truck;
  if (n.includes("electrogeno") || n.includes("grupo")) return Zap;
  if (n.includes("deteccion") || n.includes("alarma")) return Bell;
  if (n.includes("bombeo") || n.includes("bomba")) return Waves;
  if (n.includes("brigada") || n.includes("bombero")) return Users;
  if (n.includes("ranurado")) return Settings;
  if (n.includes("espuma")) return Droplets;
  if (n.includes("aire") || n.includes("botella") || n.includes("cilindro"))
    return Cylinder;
  if (n.includes("termofusion") || n.includes("fusion")) return Flame;
  if (n.includes("viento")) return Wind;
  return ShieldCheck;
}

function mapServicio(servicio: Servicio): LandingService {
  return {
    key: `api-${servicio.id}`,
    id: servicio.id,
    name: servicio.nombre,
    description: servicio.descripcion,
    image: resolveServicioFotoUrl(servicio.foto),
    icon: pickIcon(servicio.nombre),
    observaciones: servicio.observaciones,
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
