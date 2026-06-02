import type { ReactNode } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
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
import type { InvolvedObject } from "../../interfaces/incident-quotation";
import { formatCurrency, formatDate } from "./utils";

interface IncidentObjectsSectionProps {
  title: string;
  firstColumnLabel: string;
  headerIcon: ReactNode;
  items: InvolvedObject[];
  isLoading: boolean;
  onCreate: () => void;
  onView: (item: InvolvedObject) => void;
  onEdit: (item: InvolvedObject) => void;
  onDelete: (itemId: number) => void;
}

export function IncidentObjectsSection({
  title,
  firstColumnLabel,
  headerIcon,
  items,
  isLoading,
  onCreate,
  onView,
  onEdit,
  onDelete,
}: IncidentObjectsSectionProps) {
  return (
    <section className="space-y-3 rounded-[24px] border-2 border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            {headerIcon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Cargando registros..." : `${items.length} registros`}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 font-medium"
          type="button"
          onClick={onCreate}
        >
          <Plus size={14} />
          Agregar Objeto
        </Button>
      </div>

      <div className="overflow-x-auto rounded-[16px] border-2 border-border">
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
              items.map((item) => (
                <ObjectRow
                  key={item.id}
                  item={item}
                  onView={() => onView(item)}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function ObjectRow({
  item,
  onView,
  onEdit,
  onDelete,
}: {
  item: InvolvedObject;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
        <div className="flex items-center justify-center gap-1 text-xs">
          <Button type="button" variant="link" className="h-auto px-1 text-pink-600" onClick={onView}>
            <Eye size={13} className="mr-1" />
            Ver
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button type="button" variant="link" className="h-auto px-1 text-pink-600" onClick={onEdit}>
            <Pencil size={13} className="mr-1" />
            Editar
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button type="button" variant="link" className="h-auto px-1 text-pink-600" onClick={onDelete}>
            <Trash2 size={13} className="mr-1" />
            Eliminar
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
