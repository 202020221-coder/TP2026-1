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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Edit2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Proyecto } from "../interfaces/proyecto";
import { formatDate } from "@/shared/lib/utils";
import { ESTADO_BADGES, ORGANIZAR_RECURSOS_DEFAULTS } from "../lib/constants";
import { useInventarioDelProyecto, useCamionesByProyecto } from "../hooks/useOrganizarRecursos";

function ProyectoRow({
  proyecto,
  onEdit,
}: {
  proyecto: Proyecto;
  onEdit: (id: number) => void;
}) {
  const { data: inventario } = useInventarioDelProyecto(proyecto.id_Proyecto);
  const { data: camiones } = useCamionesByProyecto(proyecto.id_Proyecto);

  const objetosFull = useMemo(() => {
    if (!inventario?.length) return "Sin objetos";
    return inventario.map((i) => i.Objeto_Nombre).join(", ");
  }, [inventario]);

  const camionsFull = useMemo(() => {
    if (!camiones?.length) return "Sin camiones";
    return camiones.map((c) => c.Camion_Nombre).join(", ");
  }, [camiones]);
  /*
    const nombreFull = useMemo(() => {
      if (!Cotizacion_Nombre?.length) return "Sin objetos";
      return Cotizacion_Nombre.map((i) => i.Objeto_Nombre).join(", ");
    }, [Cotizacion_Nombre]);
  */
  const objetosText =
    objetosFull.length > 30 ? objetosFull.slice(0, 30) + "..." : objetosFull;
  const camionesText =
    camionsFull.length > 30 ? camionsFull.slice(0, 30) + "..." : camionsFull;
  /*
    const nombreText =
    nombreFull.length > 30 ? nombreFull.slice(0, 30) + "..." : nombreFull;
*/

  const badgeVariant = ESTADO_BADGES[proyecto.estado] ?? "secondary";

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{proyecto.id_Proyecto}</TableCell>
      <TableCell className="font-medium">
        {proyecto.Cotizacion_Nombre || "Sin nombre"}
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
  const [estadoFilter, setEstadoFilter] = useState("todos");

  const filteredProyectos = useMemo(() => {
    return proyectos.filter((p) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        p.Cotizacion_Nombre?.toLowerCase().includes(term) ||
        p.Cliente_Nombre?.toLowerCase().includes(term) ||
        p.descripcion_servicio?.toLowerCase().includes(term) ||
        p.id_Proyecto.toString().includes(term);

      const matchesEstado =
        estadoFilter === "todos" || p.estado === estadoFilter;

      return matchesSearch && matchesEstado;
    });
  }, [proyectos, searchTerm, estadoFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <Input
          placeholder="Buscar por nombre de proyecto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 flex-1"
        />
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="h-10 w-48 flex-shrink-0">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ORGANIZAR_RECURSOS_DEFAULTS.ESTADOS_PROYECTO.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              <TableHead className="font-semibold text-foreground">Estado</TableHead>
              <TableHead className="text-center font-semibold text-foreground">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Cargando proyectos...
                </TableCell>
              </TableRow>
            ) : filteredProyectos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
