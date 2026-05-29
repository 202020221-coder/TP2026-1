import { useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Eraser,
  Search,
  CalendarRange,
  Filter,
  FileText,
  Eye,
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
import { getClientProjects } from "../api/client-projects.api";
import { type ProjectState, ProjectStatesRecord } from "../enum/project-state.record";
import type { Project } from "../interfaces/project";
import { useDebounced } from "@/shared/hooks/useDebounced";
import { ClientProjectDetailModal } from "./ClientProjectDetailModal";

interface ClientProjectsTableProps {
  dni: string;
}

type ClientProject = Project & { Proyecto_Nombre?: string };

export const ClientProjectsTable: FC<ClientProjectsTableProps> = ({ dni }) => {
  const [buscar, setBuscar] = useState("");
  const [estado, setEstado] = useState<ProjectState | "">("");
  const [localFechaInicio, setLocalFechaInicio] = useState("");
  const [localFechaFin, setLocalFechaFin] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);

  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ["client-projects", dni],
    queryFn: () => getClientProjects(dni),
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
    [ProjectStatesRecord.pending, "bg-yellow-100 text-yellow-700 border-yellow-300"],
    [ProjectStatesRecord.inExecution, "bg-blue-100 text-blue-700 border-blue-300"],
    [ProjectStatesRecord.completed, "bg-green-100 text-green-700 border-green-300"],
    [ProjectStatesRecord.legalProcess, "bg-red-100 text-red-700 border-red-300"],
    [ProjectStatesRecord.cancelled, "bg-gray-100 text-gray-600 border-gray-300"],
  ]);

  const formatDate = (dateStr: string) => {
    const [datePart] = dateStr.split("T");
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  const filtered = (data ?? []).filter((p) => {
    const nombre = (p as ClientProject).Proyecto_Nombre ?? p.descripcion_servicio;
    const matchBuscar = buscar
      ? nombre?.toLowerCase().includes(buscar.toLowerCase())
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

  const renderRow = (project: ClientProject) => (
    <TableRow
      key={project.id_Proyecto}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <TableCell className="font-medium py-3">
        {project.Proyecto_Nombre ?? project.descripcion_servicio}
      </TableCell>
      <TableCell className="text-gray-700">
        {project.fecha_inicio ? formatDate(project.fecha_inicio) : "-"}
      </TableCell>
      <TableCell className="text-gray-700">
        {project.fecha_fin ? formatDate(project.fecha_fin) : "-"}
      </TableCell>
      <TableCell className="text-gray-700">{project.ubicacion || "—"}</TableCell>
      <TableCell>
        <span className={`block mx-auto w-fit rounded-full px-3 py-1 text-[13px] font-medium border ${statusStyles.get(project.estado) ?? ""}`}>
          {project.estado}
        </span>
      </TableCell>
      <TableCell className="text-center">
        {project.informe_final ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 text-green-600 border-green-300 bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-colors">
                <FileText className="w-3.5 h-3.5 mr-1 text-green-600" />Ver
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-green-400 text-green-600">Ver informe</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-gray-400 text-sm italic">—</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        {project.orden_servicio ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-5 h-5 fill-red-500">
                  <path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-red-300 text-red-500">Ver orden de servicio</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-gray-400 text-sm italic">—</span>
        )}
      </TableCell>
      {/* Detalles del proyecto */}
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-purple-600 border-purple-300 bg-white hover:bg-purple-50 hover:text-purple-600 hover:border-purple-500 transition-colors"
              onClick={() => setSelectedProject(project)}
            >
              <Eye className="w-3.5 h-3.5 mr-1 text-purple-600" />Ver
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-purple-400 text-purple-600">Ver detalle del proyecto</TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {selectedProject && (
        <ClientProjectDetailModal
          project={selectedProject}
          open={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <div className="flex flex-1 flex-col space-y-3">
        {/* Top controls */}
        <div className="flex flex-wrap gap-2 items-start justify-between">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder="Buscar por nombre"
              className="pl-8"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400" size={16} />
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
              onValueChange={(val) => { setEstado(val as ProjectState); setPage(1); }}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {Object.values(ProjectStatesRecord).map((s, i) => (
                    <SelectItem key={i} value={s}>{s}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="outline"
              title="Limpiar filtros"
              disabled={!estado && !buscar && !fechaInicio && !fechaFin && !localFechaInicio && !localFechaFin}
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
              <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
              <TableHead className="text-gray-500 font-medium">Fecha de inicio</TableHead>
              <TableHead className="text-gray-500 font-medium">Fecha de finalización</TableHead>
              <TableHead className="text-gray-500 font-medium">Ubicación</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Estado</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Informe</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Orden de servicio</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Detalles del proyecto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending || isFetching ? (
              Array.from({ length: limit }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableCell key={i}><Skeleton className="h-4 w-full bg-gray-100" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500 py-6">{error.message}</TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-10">No se encontraron proyectos.</TableCell>
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
              onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}
            >
              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15" disabled={total <= 10}>15</SelectItem>
                <SelectItem value="20" disabled={total <= 15}>20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center gap-x-2 sm:col-span-2">
            <Button className="w-40" variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ArrowLeft /> Anterior
            </Button>
            <Button className="w-40" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
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