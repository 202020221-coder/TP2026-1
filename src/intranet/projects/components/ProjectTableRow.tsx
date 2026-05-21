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
import {
  type ProjectState,
  ProjectStatesRecord,
} from "../enum/project-state.record";

export const ProjectTableRow: FC<{ project: Project }> = ({ project }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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
        <TableCell className="text-gray-700">
          {project.Cliente_Nombre}
        </TableCell>

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
              <DropdownMenuItem disabled>Ver detalle-proyecto</DropdownMenuItem>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="w-5 h-5 fill-red-500"
                  >
                    <path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-red-300 text-red-500">
                Ver orden de servicio
              </TooltipContent>
            </Tooltip>
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
