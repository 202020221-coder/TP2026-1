import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Cylinder,
  Droplets,
  Flame,
  Settings,
  Truck,
  Users,
  Waves,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Icono según el nombre del servicio (incendios, bombeo, etc.). */
export function pickServicioIcon(nombre: string): LucideIcon {
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
  if (n.includes("preventiv") || n.includes("incendio")) return Flame;
  return Wrench;
}
