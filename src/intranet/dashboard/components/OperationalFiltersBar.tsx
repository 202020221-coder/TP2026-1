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
import type { OperationalDashboardFilters } from "../interfaces/project-assistant-dashboard.types";

interface OperationalFiltersBarProps {
  filters: OperationalDashboardFilters;
  clientOptions: string[];
  onChange: (filters: OperationalDashboardFilters) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "Cotizado", label: "Cotizado" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "En Ejecución", label: "En Ejecución" },
] as const;

export function OperationalFiltersBar({
  filters,
  clientOptions,
  onChange,
  onReset,
}: OperationalFiltersBarProps) {
  return (
    <section className="mb-5 rounded-xl border border-white/30 bg-white/80 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Filtros globales
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1">
          <Label htmlFor="op-from" className="text-xs">
            Desde
          </Label>
          <Input
            id="op-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="op-to" className="text-xs">
            Hasta
          </Label>
          <Input
            id="op-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="op-client" className="text-xs">
            Cliente
          </Label>
          <Select
            value={filters.clientQuery || "__all__"}
            onValueChange={(v) =>
              onChange({ ...filters, clientQuery: v === "__all__" ? "" : v })
            }
          >
            <SelectTrigger id="op-client" className="h-9">
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
          <Label htmlFor="op-status" className="text-xs">
            Estado
          </Label>
          <Select
            value={filters.statusFilter}
            onValueChange={(v) =>
              onChange({
                ...filters,
                statusFilter: v as OperationalDashboardFilters["statusFilter"],
              })
            }
          >
            <SelectTrigger id="op-status" className="h-9">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="h-9 w-full" onClick={onReset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Limpiar
          </Button>
        </div>
      </div>
    </section>
  );
}
