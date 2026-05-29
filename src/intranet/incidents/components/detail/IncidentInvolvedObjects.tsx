import { useState, type FC } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Plus, Trash2, Package, Truck } from "lucide-react";
import type { InvolvedObject, InvolvedObjectCategory } from "../../interfaces/incident-quotation";

// ── Mock data (replace with real API call when backend is ready) ─────────────
const MOCK_OBJECTS: InvolvedObject[] = [
  {
    id: 1,
    id_incidencia: 0,
    categoria: "Objetos",
    objeto: "Rociadores",
    fecha_perdida: "2025-04-20",
    cantidad_involucrada: 12,
    cantidad_enviada: 8,
    ocurrencia: "Incendio sector B",
    ultima_ubicacion: "Almacén central",
    precio_remunerar: 4800.0,
  },
  {
    id: 2,
    id_incidencia: 0,
    categoria: "Objetos",
    objeto: "Repuesto bomba",
    fecha_perdida: "2025-04-21",
    cantidad_involucrada: 3,
    cantidad_enviada: 1,
    ocurrencia: "Falla mecánica",
    ultima_ubicacion: "Taller norte",
    precio_remunerar: 2200.5,
  },
  {
    id: 3,
    id_incidencia: 0,
    categoria: "Camiones",
    objeto: "Cisterna",
    fecha_perdida: "2025-04-20",
    cantidad_involucrada: 1,
    cantidad_enviada: 1,
    ocurrencia: "Volcamiento en ruta",
    ultima_ubicacion: "Km 45 carretera central",
    precio_remunerar: 85000.0,
  },
  {
    id: 4,
    id_incidencia: 0,
    categoria: "Camiones",
    objeto: "Ambulancia",
    fecha_perdida: null,
    cantidad_involucrada: 1,
    cantidad_enviada: 0,
    ocurrencia: "Evaluación pendiente",
    ultima_ubicacion: "Base principal",
    precio_remunerar: null,
  },
];

interface IncidentInvolvedObjectsProps {
  incidentId: number;
}

export const IncidentInvolvedObjects: FC<IncidentInvolvedObjectsProps> = ({
  incidentId,
}) => {
  const isFetching = false;
  const allObjects = MOCK_OBJECTS.map((o) => ({
    ...o,
    id_incidencia: incidentId,
  }));

  const categories: InvolvedObjectCategory[] = ["Objetos", "Camiones"];

  return (
    <div className="bg-card rounded-xl shadow-xs border border-border p-6 flex flex-col gap-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-0.5 rounded-full bg-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Objetos involucrados
          </h2>
        </div>
        <Button className="gap-1.5" size="sm">
          <Plus size={14} />
          Agregar objeto
        </Button>
      </div>

      {/* Per-category sub-cards */}
      <div className="flex flex-col gap-4">
        {categories.map((cat) => {
          const items = allObjects.filter((o) => o.categoria === cat);
          return (
            <CategorySubCard
              key={cat}
              category={cat}
              items={items}
              isFetching={isFetching}
            />
          );
        })}
      </div>
    </div>
  );
};

// ── Per-category sub-card ───────────────────────────────────────────────────
const CategorySubCard: FC<{
  category: InvolvedObjectCategory;
  items: InvolvedObject[];
  isFetching: boolean;
}> = ({ category, items, isFetching }) => {
  const [open, setOpen] = useState(true);

  const icon =
    category === "Camiones" ? (
      <Truck size={14} className="text-primary" />
    ) : (
      <Package size={14} className="text-primary" />
    );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Sub-card header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-foreground">
            {category}
          </span>
          {!isFetching && (
            <span className="ml-1 inline-flex items-center justify-center h-5 px-2 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
              {items.length}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground select-none">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Table */}
      {open && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="[&_tr]:border-b border-gray-200">
              <TableRow className="hover:bg-white">
                <TableHead className="text-gray-500 font-medium">Objeto</TableHead>
                <TableHead className="text-gray-500 font-medium">Fecha de pérdida</TableHead>
                <TableHead className="text-center text-gray-500 font-medium">Cant. involucrada</TableHead>
                <TableHead className="text-center text-gray-500 font-medium">Cant. enviada</TableHead>
                <TableHead className="text-gray-500 font-medium">Ocurrencia</TableHead>
                <TableHead className="text-gray-500 font-medium">Última ubicación</TableHead>
                <TableHead className="text-right text-gray-500 font-medium">Precio a remunerar</TableHead>
                <TableHead className="text-center text-gray-500 font-medium">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetching ? (
                <InvolvedObjectSkeleton />
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-400 py-8 italic text-sm"
                  >
                    No hay {category.toLowerCase()} registrados.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <InvolvedObjectRow key={item.id} item={item} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// ── Single object row ────────────────────────────────────────────────────────
const InvolvedObjectRow: FC<{ item: InvolvedObject }> = ({ item }) => {
  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Objeto */}
      <TableCell className="font-medium text-gray-800">{item.objeto}</TableCell>

      {/* Fecha pérdida */}
      <TableCell className="text-gray-600 text-sm">
        {item.fecha_perdida ? (
          new Date(item.fecha_perdida).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        ) : (
          <span className="text-gray-400 italic text-sm">—</span>
        )}
      </TableCell>

      {/* Cantidad involucrada */}
      <TableCell className="text-center">
        <span className="font-mono text-sm font-medium text-gray-700">
          {item.cantidad_involucrada}
        </span>
      </TableCell>

      {/* Cantidad enviada */}
      <TableCell className="text-center">
        <span
          className={`font-mono text-sm font-medium ${
            item.cantidad_enviada < item.cantidad_involucrada
              ? "text-amber-600"
              : "text-green-600"
          }`}
        >
          {item.cantidad_enviada}
        </span>
      </TableCell>

      {/* Ocurrencia */}
      <TableCell
        className="text-gray-600 text-sm max-w-[160px] truncate"
        title={item.ocurrencia}
      >
        {item.ocurrencia}
      </TableCell>

      {/* Última ubicación */}
      <TableCell
        className="text-gray-600 text-sm max-w-[140px] truncate"
        title={item.ultima_ubicacion}
      >
        {item.ultima_ubicacion}
      </TableCell>

      {/* Precio a remunerar */}
      <TableCell className="text-right">
        {item.precio_remunerar !== null ? (
          <span className="font-mono text-sm font-medium text-gray-700">
            S/{" "}
            {item.precio_remunerar.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
            })}
          </span>
        ) : (
          <span className="text-gray-400 italic text-sm">—</span>
        )}
      </TableCell>

      {/* Acciones */}
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-red-500 border-red-300 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-red-400 text-red-500">
            Eliminar objeto
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const InvolvedObjectSkeleton: FC = () => (
  <>
    {Array.from({ length: 2 }).map((_, i) => (
      <TableRow key={i} className="border-b border-gray-100 hover:bg-transparent">
        <TableCell><Skeleton className="h-4 w-28 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20 bg-gray-100" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto bg-gray-100" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28 bg-gray-100" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto bg-gray-100" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-8 w-8 mx-auto bg-gray-100 rounded" /></TableCell>
      </TableRow>
    ))}
  </>
);
