import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Edit2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Proyecto } from "../interfaces/proyecto";
import { formatDate } from "@/shared/lib/utils";
import { ESTADO_BADGES } from "../lib/constants";
import { useProyectoTodo } from "../hooks/useOrganizarRecursos";

// Fila individual que fetcha proyecto_todo para mostrar objetos/camiones/métodos
function ProyectoRow({
  proyecto,
  onEdit,
}: {
  proyecto: Proyecto;
  onEdit: (id: number) => void;
}) {
  const { data: todo } = useProyectoTodo(proyecto.id_Proyecto);

  const objetosFull = useMemo(() => {
    if (!todo?.inventario?.length) return "Sin objetos";
    return todo.inventario.map((i) => i.nombre_del_producto).join(", ");
  }, [todo]);

  const camionsFull = useMemo(() => {
    if (!todo?.camiones?.length) return "Sin camiones";
    return todo.camiones.map((c) => c.Camion_Nombre).join(", ");
  }, [todo]);

  const objetosText =
    objetosFull.length > 30 ? objetosFull.slice(0, 30) + "..." : objetosFull;
  const camionesText =
    camionsFull.length > 30 ? camionsFull.slice(0, 30) + "..." : camionsFull;

  const badgeVariant = ESTADO_BADGES[proyecto.estado] ?? "secondary";

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{proyecto.id_Proyecto}</TableCell>
      <TableCell className="font-medium">
        {proyecto.Cliente_Nombre || proyecto.Cotizacion_Nombre || "Sin nombre"}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">
        <span title={objetosFull}>{objetosText}</span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">
        <span title={camionsFull}>{camionesText}</span>
      </TableCell>
      <TableCell className="text-sm">
        {proyecto.fecha_inicio ? formatDate(proyecto.fecha_inicio) : "—"}
      </TableCell>
      <TableCell className="text-sm">
        {proyecto.fecha_fin ? formatDate(proyecto.fecha_fin) : "—"}
      </TableCell>
      <TableCell className="text-sm">{"—"}</TableCell>
      <TableCell>
        <Badge variant={badgeVariant}>{proyecto.estado}</Badge>
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(proyecto.id_Proyecto)}
          className="gap-1"
        >
          <Edit2 className="h-3 w-3" />
          Editar
        </Button>
      </TableCell>
    </TableRow>
  );
}

interface ProyectosTableProps {
  proyectos: Proyecto[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function ProyectosTable({
  proyectos,
  isLoading,
  onEdit,
  pagination,
  onPageChange,
}: ProyectosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProyectos = useMemo(
    () =>
      proyectos.filter(
        (p) =>
          p.Cliente_Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion_servicio?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [proyectos, searchTerm]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10"
        />
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">ID Proyecto</TableHead>
              <TableHead className="font-semibold text-foreground">Nombre</TableHead>
              <TableHead className="font-semibold text-foreground">Objetos</TableHead>
              <TableHead className="font-semibold text-foreground">Camiones</TableHead>
              <TableHead className="font-semibold text-foreground">Primera Fecha de Salida</TableHead>
              <TableHead className="font-semibold text-foreground">Fecha de Último Retorno</TableHead>
              <TableHead className="font-semibold text-foreground">Métodos Traslado</TableHead>
              <TableHead className="font-semibold text-foreground">Estado</TableHead>
              <TableHead className="text-center font-semibold text-foreground">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Cargando proyectos...
                </TableCell>
              </TableRow>
            ) : filteredProyectos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No hay proyectos disponibles
                </TableCell>
              </TableRow>
            ) : (
              filteredProyectos.map((proyecto) => (
                <ProyectoRow
                  key={proyecto.id_Proyecto}
                  proyecto={proyecto}
                  onEdit={onEdit}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredProyectos.length} de {pagination.total} proyecto
          {pagination.total !== 1 ? "s" : ""}
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="h-8 gap-1 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="h-8 gap-1 px-2"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
