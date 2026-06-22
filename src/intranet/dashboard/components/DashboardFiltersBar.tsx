import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { DashboardFilters } from "../interfaces/manager-dashboard.types";
import type { Project } from "@/intranet/projects/interfaces/project";

interface DashboardFiltersBarProps {
  filters: DashboardFilters;
  projects: Project[];
  onChange: (filters: DashboardFilters) => void;
  onReset: () => void;
}

export function DashboardFiltersBar({
  filters,
  projects,
  onChange,
  onReset,
}: DashboardFiltersBarProps) {
  const clientOptions = Array.from(
    new Set(projects.map((p) => p.Cliente_Nombre).filter(Boolean)),
  ) as string[];

  return (
    <section className="mb-5 rounded-xl border border-white/30 bg-white/80 p-4 shadow-md backdrop-blur-sm dark:bg-card/80">
      <div className="mb-3 flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Filtros globales
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1">
          <Label htmlFor="dash-from" className="text-xs">
            Desde
          </Label>
          <Input
            id="dash-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dash-to" className="text-xs">
            Hasta
          </Label>
          <Input
            id="dash-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dash-client" className="text-xs">
            Cliente
          </Label>
          <Select
            value={filters.clientQuery || "__all__"}
            onValueChange={(v) =>
              onChange({ ...filters, clientQuery: v === "__all__" ? "" : v })
            }
          >
            <SelectTrigger id="dash-client" className="h-9">
              <SelectValue placeholder="Todos los clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los clientes</SelectItem>
              {clientOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="dash-project" className="text-xs">
            Proyecto
          </Label>
          <Select
            value={filters.projectId != null ? String(filters.projectId) : "__all__"}
            onValueChange={(v) =>
              onChange({
                ...filters,
                projectId: v === "__all__" ? null : Number(v),
              })
            }
          >
            <SelectTrigger id="dash-project" className="h-9">
              <SelectValue placeholder="Todos los proyectos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los proyectos</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id_Proyecto} value={String(p.id_Proyecto)}>
                  {p.Cotizacion_Nombre ?? p.descripcion_servicio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            className="h-9 w-full"
            onClick={onReset}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Limpiar
          </Button>
        </div>
      </div>
    </section>
  );
}

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  dateFrom: "",
  dateTo: "",
  clientQuery: "",
  projectId: null,
};
