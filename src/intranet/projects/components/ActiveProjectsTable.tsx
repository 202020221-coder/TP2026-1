import { useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Eraser,
  Search,
  CalendarRange,
  Eye,
  Filter,
  FileText,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { getActiveCompletedProjects } from "../api/active-projects.api";
import {
  type ProjectState,
  ProjectStatesRecord,
} from "../enum/project-state.record";
import type { Project } from "../interfaces/project";
import { useDebounced } from "@/shared/hooks/useDebounced";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { ProjectAnalyticsModal } from "./ProjectAnalyticsModal";
import { useNavigate } from "react-router";

interface ActiveProjectsTableProps {
  onVerTodos: () => void;
}

export const ActiveProjectsTable: FC<ActiveProjectsTableProps> = ({
  onVerTodos: _onVerTodos,
}) => {
  const [buscar, setBuscar] = useState("");
  const [estado, setEstado] = useState<ProjectState | "">("");
  const [localFechaInicio, setLocalFechaInicio] = useState("");
  const [localFechaFin, setLocalFechaFin] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detailProjectId, setDetailProjectId] = useState<number | null>(null);
  const [analyticsProject, setAnalyticsProject] = useState<{ id: number; name: string; client: string } | null>(null);
  const navigate = useNavigate();
  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ["active-projects"],
    queryFn: getActiveCompletedProjects,
  });

  const debouncedSearch = useDebounced((val: string) => {
    setBuscar(val);
    setPage(1);
  }, 600);

  const handleAplicarFechas = () => {
    setFechaInicio(localFechaInicio);
    setFechaFin(localFechaFin);
    setPage(1);
  };

  const handleLimpiar = () => {
    setBuscar("");
    setEstado("");
    setLocalFechaInicio("");
    setLocalFechaFin("");
    setFechaInicio("");
    setFechaFin("");
    setPage(1);
  };

  const statusStyles = new Map<ProjectState, string>([
    [
      ProjectStatesRecord.pending,
      "bg-yellow-100 text-yellow-700 border-yellow-300",
    ],
    [
      ProjectStatesRecord.inExecution,
      "bg-blue-100 text-blue-700 border-blue-300",
    ],
    [
      ProjectStatesRecord.completed,
      "bg-green-100 text-green-700 border-green-300",
    ],
    [
      ProjectStatesRecord.legalProcess,
      "bg-red-100 text-red-700 border-red-300",
    ],
    [
      ProjectStatesRecord.cancelled,
      "bg-gray-100 text-gray-600 border-gray-300",
    ],
  ]);

  const formatDate = (dateStr: string) => {
    const [datePart] = dateStr.split("T");
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  const filtered = (data ?? []).filter((p) => {
    const matchBuscar = buscar
      ? p.Cotizacion_Nombre?.toLowerCase().includes(buscar.toLowerCase()) ||
        p.descripcion_servicio?.toLowerCase().includes(buscar.toLowerCase())
      : true;
    const matchEstado = estado ? p.estado === estado : true;
    const matchInicio = fechaInicio
      ? p.fecha_inicio && p.fecha_inicio.split("T")[0] >= fechaInicio
      : true;
    const matchFin = fechaFin
      ? p.fecha_fin && p.fecha_fin.split("T")[0] <= fechaFin
      : true;
    return matchBuscar && matchEstado && matchInicio && matchFin;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const renderRow = (project: Project) => (
    <TableRow
      key={project.id_Proyecto}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <TableCell className="font-medium py-3">
        {project.Cotizacion_Nombre ?? project.descripcion_servicio}
      </TableCell>
      <TableCell className="text-gray-700">
        {project.fecha_inicio ? formatDate(project.fecha_inicio) : "-"}
      </TableCell>
      <TableCell className="text-gray-700">
        {project.fecha_fin ? formatDate(project.fecha_fin) : "-"}
      </TableCell>
      <TableCell className="text-gray-700">{project.Cliente_Nombre}</TableCell>
      <TableCell>
        <span
          className={`block mx-auto w-fit rounded-full px-3 py-1 text-[13px] font-medium border ${statusStyles.get(project.estado) ?? ""}`}
        >
          {project.estado}
        </span>
      </TableCell>
      <TableCell className="text-center">
        {project.informe_final ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-green-600 border-green-300 bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-green-600" />
                Ver
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-green-400 text-green-600">
              Ver informe
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-orange-500 border-orange-300 bg-white hover:bg-orange-50 hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-orange-500" />
                Agregar
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-orange-400 text-orange-500">
              Agregar / Editar informe
            </TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-amber-600 border-amber-300 bg-white hover:bg-amber-50 hover:text-amber-600 hover:border-amber-500 transition-colors"
              onClick={() =>
                navigate(
                  `/intranet/incidencias?id_proyecto=${project.id_Proyecto}`,
                  {
                    state: {
                      projectId: project.id_Proyecto,
                      projectName:
                        project.Cotizacion_Nombre ??
                        project.descripcion_servicio,
                      clientName: project.Cliente_Nombre,
                      clientId: project.Id_Cliente,
                    },
                  },
                )
              }
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />-
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-amber-400 text-amber-600">
            Ver incidencias
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-purple-600 border-purple-300 bg-white hover:bg-purple-50 hover:text-purple-600 hover:border-purple-500 transition-colors"
              onClick={() => setDetailProjectId(project.id_Proyecto)}
            >
              <Eye className="w-3.5 h-3.5 mr-1 text-purple-600" />
              Ver
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-purple-400 text-purple-600">
            Ver detalle del proyecto
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-indigo-600 border-indigo-300 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-500 transition-colors"
              onClick={() =>
                setAnalyticsProject({
                  id: project.id_Proyecto,
                  name: project.Cotizacion_Nombre ?? project.descripcion_servicio,
                  client: project.Cliente_Nombre ?? "",
                })
              }
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Analytics
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-indigo-400 text-indigo-600">
            Ver analíticas del proyecto
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <ProjectAnalyticsModal
        projectId={analyticsProject?.id ?? 0}
        projectName={analyticsProject?.name ?? ""}
        clientName={analyticsProject?.client ?? ""}
        open={analyticsProject !== null}
        onClose={() => setAnalyticsProject(null)}
      />
      <ProjectDetailModal
        projectId={detailProjectId ?? 0}
        open={detailProjectId !== null}
        onClose={() => setDetailProjectId(null)}
      />

      <div className="flex flex-1 flex-col space-y-3">
        {/* Top controls */}
        <div className="flex flex-wrap gap-2 items-start justify-between">
          {/* Solo buscador */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder="Buscar por nombre"
              className="pl-8"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <Search
              className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"
              size={16}
            />
          </div>

          <div className="flex items-center gap-2">
            <CalendarRange size={16} className="text-gray-400 shrink-0" />
            <Input
              type="date"
              className="w-36 text-sm"
              value={localFechaInicio}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) => setLocalFechaInicio(e.target.value)}
            />
            <span className="text-gray-400 text-sm">—</span>
            <Input
              type="date"
              className="w-36 text-sm"
              value={localFechaFin}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) => setLocalFechaFin(e.target.value)}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleAplicarFechas}
              disabled={!localFechaInicio && !localFechaFin}
              title="Aplicar filtro de fechas"
            >
              <Filter size={16} />
            </Button>
          </div>

          <div className="flex gap-x-2">
            <Select
              value={estado}
              onValueChange={(val) => {
                setEstado(val as ProjectState);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {Object.values(ProjectStatesRecord).map((s, i) => (
                    <SelectItem key={i} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="outline"
              title="Limpiar filtros"
              disabled={
                !estado &&
                !buscar &&
                !fechaInicio &&
                !fechaFin &&
                !localFechaInicio &&
                !localFechaFin
              }
              onClick={handleLimpiar}
            >
              <Eraser size={16} />
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <Table containerClassname="flex-1 overflow-auto flex-col">
          <TableHeader className="[&_tr]:border-b border-gray-200">
            <TableRow className="hover:bg-white">
              <TableHead className="text-gray-500 font-medium">
                Nombre
              </TableHead>
              <TableHead className="text-gray-500 font-medium">
                Fecha de inicio
              </TableHead>
              <TableHead className="text-gray-500 font-medium">
                Fecha de finalización
              </TableHead>
              <TableHead className="text-gray-500 font-medium">
                Cliente
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium">
                Estado
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium">
                Informe
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium">
                Incidencias
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium">
                Detalles
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium">
                Analytics
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending || isFetching ? (
              Array.from({ length: limit }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full bg-gray-100" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-red-500 py-6"
                >
                  {error.message}
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-gray-400 py-10"
                >
                  No se encontraron proyectos.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map(renderRow)
            )}
          </TableBody>
        </Table>

        {/* Bottom controls */}
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4">
          <div className="flex gap-x-2 items-center sm:col-span-1">
            <Label>Tamaño de Página:</Label>
            <Select
              value={limit.toString()}
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15" disabled={total <= 10}>
                  15
                </SelectItem>
                <SelectItem value="20" disabled={total <= 15}>
                  20
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center gap-x-2 sm:col-span-2">
            <Button
              className="w-40"
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ArrowLeft /> Anterior
            </Button>
            <Button
              className="w-40"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente <ArrowRight />
            </Button>
          </div>
          <div className="flex gap-x-2 items-center w-fit sm:col-span-1">
            <p>Página</p>
            <Input
              type="number"
              step={1}
              min={1}
              max={totalPages}
              value={page}
              className="w-16"
              onChange={(e) => setPage(Number(e.target.value))}
              disabled={totalPages === 1}
            />
            <p>de</p>
            <p>{totalPages}</p>
          </div>
        </div>
      </div>
    </>
  );
};
