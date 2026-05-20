import { useState } from "react";
import { useNavigate } from "react-router";
import { EditProjectModal } from "./EditProjectModal";
import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Pencil, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { Project } from "../interfaces/project";
import { type ProjectState, ProjectStatesRecord } from "../enum/project-state.record";

export const ProjectTableRow: FC<{ project: Project }> = ({ project }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <EditProjectModal
        project={project}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        {/* Nombre */}
        <TableCell className="font-medium py-3">
          {project.Cotizacion_Nombre}
        </TableCell>

        {/* Fecha inicio */}
        <TableCell className="text-gray-700">
          {project.fecha_inicio ? formatDate(project.fecha_inicio) : "-"}
        </TableCell>

        {/* Fecha finalización */}
        <TableCell className="text-gray-700">
          {project.fecha_fin ? formatDate(project.fecha_fin) : "-"}
        </TableCell>

        {/* Cliente */}
        <TableCell className="text-gray-700">{project.Cliente_Nombre}</TableCell>

        {/* Estado */}
        <TableCell>
          <span
            className={`block mx-auto w-fit rounded-full px-3 py-1 text-[13px] font-medium border ${statusStyles.get(project.estado) ?? ""}`}
          >
            {project.estado}
          </span>
        </TableCell>

        {/* Acciones */}
        <TableCell className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-blue-600 border-blue-300 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 transition-colors"
              >
                Acciones
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-blue-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem disabled>
                Ver detalle-proyecto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/intranet/organizar-personal")}
              >
                Organizar personal
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/intranet/organizar-recursos")}
              >
                Organizar recursos
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Gestionar Presupuesto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>

        {/* Orden de servicio */}
        <TableCell className="text-center">
          {project.orden_servicio ? (
            <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {project.orden_servicio}
            </span>
          ) : (
            <span className="text-gray-400 text-sm italic">—</span>
          )}
        </TableCell>

        {/* Editar proyecto */}
        <TableCell className="text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-gray-600 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-600 hover:border-gray-500 transition-colors"
                onClick={() => setModalOpen(true)}
              >
                <Pencil className="w-3.5 h-3.5 mr-1 text-gray-600" />
                Edit
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-gray-400 text-gray-600">
              Editar proyecto
            </TooltipContent>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
};