import { useEffect, useMemo, useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { CheckCircle2, PackageSearch, Search, Wrench } from "lucide-react";
import { getServicios } from "../api/service.api";
import { isServicioDeIncidencia } from "../lib/servicio-incidencia";
import { resolveServicioFotoUrl } from "../lib/servicio-foto";
import { pickServicioIcon } from "../lib/pick-servicio-icon";

export interface SubservicioSeleccionado {
  id: number;
  nombre: string;
}

interface SubserviciosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Servicio actual (se excluye del catálogo para no auto-referenciarse). */
  currentServicioId?: number;
  /** Ids ya seleccionados como subservicios. */
  selectedIds: number[];
  onConfirm: (selected: SubservicioSeleccionado[]) => void;
}

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const SubserviciosDialog: FC<SubserviciosDialogProps> = ({
  open,
  onOpenChange,
  currentServicioId,
  selectedIds,
  onConfirm,
}) => {
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Map<number, string>>(new Map());

  const { data, isPending, isError } = useQuery({
    queryKey: ["servicios", "subservicios"],
    queryFn: () => getServicios({ page: 1, limit: 1000 }),
    enabled: open,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (open) {
      setSearch("");
      // Pre-cargar los ya seleccionados para que se puedan deseleccionar.
      setPicked(new Map(selectedIds.map((id) => [id, ""])));
    }
  }, [open, selectedIds]);

  const catalog = useMemo(() => {
    const list = (data?.data ?? []).filter(
      (s) =>
        s.activo &&
        s.id !== currentServicioId &&
        !isServicioDeIncidencia(s.servicio_de_incidencia),
    );
    const term = normalize(search);
    if (!term) return list;
    return list.filter((s) => normalize(s.nombre).includes(term));
  }, [data, currentServicioId, search]);

  const toggle = (id: number, nombre: string) => {
    setPicked((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, nombre);
      return next;
    });
  };

  const handleConfirm = () => {
    const selected: SubservicioSeleccionado[] = [];
    // Mantener el nombre real desde el catálogo cuando esté disponible.
    const byId = new Map((data?.data ?? []).map((s) => [s.id, s.nombre]));
    picked.forEach((nombre, id) => {
      selected.push({ id, nombre: byId.get(id) ?? nombre });
    });
    onConfirm(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-w-11/12 max-w-3xl flex-col gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wrench className="h-5 w-5 text-primary" />
            Seleccionar Subservicios
          </DialogTitle>
          <DialogDescription>
            Elige los servicios del catálogo que intervienen dentro de las fases
            de este servicio.
          </DialogDescription>
        </DialogHeader>

        <div className="border-b border-border px-6 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {isPending ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Cargando catálogo...
            </p>
          ) : isError ? (
            <p className="py-12 text-center text-sm text-destructive">
              No se pudo cargar el catálogo de servicios.
            </p>
          ) : catalog.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <PackageSearch className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No hay servicios disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((s) => {
                const isSelected = picked.has(s.id);
                const Icon = pickServicioIcon(s.nombre);
                const img = resolveServicioFotoUrl(s.foto);
                return (
                  <Card
                    key={s.id}
                    onClick={() => toggle(s.id, s.nombre)}
                    className={`relative cursor-pointer overflow-hidden border p-3 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                        : "hover:border-primary/40 hover:bg-accent/20"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground" />
                    )}
                    <div className="mb-2 flex h-16 w-full items-center justify-center rounded-lg bg-muted/40">
                      {img ? (
                        <img
                          src={img}
                          alt={s.nombre}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Icon className="h-7 w-7 text-muted-foreground/50" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                      {s.nombre}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <span className="text-sm text-muted-foreground">
            {picked.size} seleccionado{picked.size !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar selección</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
