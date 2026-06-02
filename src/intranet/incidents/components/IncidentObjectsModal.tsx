import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Package, Pencil, Plus, Trash2, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getIncidentObjects } from "../api/incident.api";
import type { InvolvedObject } from "../interfaces/incident-quotation";

interface IncidentObjectsModalProps {
  incidentId: number;
  open: boolean;
  onClose: () => void;
}

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function IncidentObjectsModal({
  incidentId,
  open,
  onClose,
}: IncidentObjectsModalProps) {
  const { data: objects = [], isLoading } = useQuery({
    queryKey: ["incident-objects", incidentId],
    queryFn: () => getIncidentObjects(incidentId),
    enabled: open && incidentId > 0,
  });

  const groupedObjects = useMemo(
    () => ({
      Objetos: objects.filter((item) => item.categoria === "Objetos"),
      Camiones: objects.filter((item) => item.categoria === "Camiones"),
    }),
    [objects],
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">Objetos involucrados</DialogTitle>
              <p className="text-sm text-muted-foreground">Proyecto #{incidentId}</p>
            </div>

            <Button className="gap-2 font-medium" size="sm" type="button">
              <Plus size={14} />
              Agregar Objeto
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 min-h-0 pr-1">
          <div className="space-y-6 pb-2">
            <ObjectsSection
              title="Objeto involucrado"
              icon={<Package size={14} />}
              firstColumnLabel="Objetos"
              items={groupedObjects.Objetos}
              isLoading={isLoading}
            />

            <ObjectsSection
              title="Camiones"
              icon={<Truck size={14} />}
              firstColumnLabel="Camiones"
              items={groupedObjects.Camiones}
              isLoading={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ObjectsSection({
  title,
  icon,
  firstColumnLabel,
  items,
  isLoading,
}: {
  title: string;
  icon: ReactNode;
  firstColumnLabel: string;
  items: InvolvedObject[];
  isLoading: boolean;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Cargando registros..." : `${items.length} registros`}
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="gap-2 font-medium" type="button">
          <Plus size={14} />
          Agregar Objeto
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">
                {firstColumnLabel}
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">
                Fecha de pérdida
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground text-center">
                Cantidad involucrada
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground text-center">
                Cantidad enviada
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">
                Ocurrencia
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">
                Última ubicación
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground text-right">
                Precio a remunerar
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground text-center">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <RowsSkeleton />
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No hay {title.toLowerCase()} registrados.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => <ObjectRow key={item.id} item={item} />)
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function ObjectRow({ item }: { item: InvolvedObject }) {
  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{item.objeto}</TableCell>
      <TableCell className="text-muted-foreground">
        {item.fecha_perdida ? formatDate(item.fecha_perdida) : "—"}
      </TableCell>
      <TableCell className="text-center font-mono text-foreground">
        {item.cantidad_involucrada}
      </TableCell>
      <TableCell className="text-center font-mono text-foreground">
        {item.cantidad_enviada}
      </TableCell>
      <TableCell className="max-w-[220px] truncate text-muted-foreground" title={item.ocurrencia}>
        {item.ocurrencia}
      </TableCell>
      <TableCell className="max-w-[220px] truncate text-muted-foreground" title={item.ultima_ubicacion}>
        {item.ultima_ubicacion}
      </TableCell>
      <TableCell className="text-right font-mono text-foreground">
        {item.precio_remunerar !== null ? formatCurrency(item.precio_remunerar) : "—"}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" type="button" aria-label="Ver registro">
            <Eye size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" type="button" aria-label="Editar registro">
            <Pencil size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" type="button" aria-label="Eliminar registro">
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function RowsSkeleton() {
  return Array.from({ length: 2 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="mx-auto h-4 w-14" /></TableCell>
      <TableCell><Skeleton className="mx-auto h-4 w-14" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
      <TableCell><Skeleton className="ml-auto h-4 w-24" /></TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  ));
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatCurrency(value: number) {
  return `S/ ${currencyFormatter.format(value)}`;
}
