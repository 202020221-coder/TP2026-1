import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Users, FileText, AlertTriangle, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { Project } from "../interfaces/project";
import type { ProjectState } from "../enum/project-state.record";

export const ProjectTableRow: FC<{ project: Project }> = ({ project }) => {
  const statusStyles = new Map<ProjectState, string>([
    ["Pendiente", "bg-yellow-100 text-yellow-700 border-yellow-300"],
    ["En ejecución", "bg-blue-100 text-blue-700 border-blue-300"],
    ["Completado", "bg-green-100 text-green-700 border-green-300"],
    ["En proceso legal", "bg-red-100 text-red-700 border-red-300"],
  ]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Nombre */}
      <TableCell className="font-medium py-3">{project.nombre}</TableCell>

      {/* Fecha inicio */}
      <TableCell className="text-gray-700">
        {formatDate(project.fecha_inicio)}
      </TableCell>

      {/* Fecha finalización */}
      <TableCell className="text-gray-700">
        {formatDate(project.fecha_finalizacion)}
      </TableCell>

      {/* Cliente */}
      <TableCell className="text-gray-700">{project.cliente}</TableCell>

      {/* Estado */}
      <TableCell>
        <Badge
          className={`block mx-auto rounded-full px-3 py-1 text-[13px] font-medium border ${statusStyles.get(project.estado) ?? ""}`}
        >
          {project.estado}
        </Badge>
      </TableCell>

      {/* Trabajadores */}
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-blue-600 border-blue-300 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 transition-colors"
            >
              <Users className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Ver
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-blue-400 text-blue-600">
            Ver / Asignar trabajadores
          </TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Orden de servicio */}
      <TableCell className="text-center">
        {project.Id_servicio ? (
          <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {project.Id_servicio}
          </span>
        ) : (
          <span className="text-gray-400 text-sm italic">—</span>
        )}
      </TableCell>

      {/* Informe */}
      <TableCell className="text-center">
        {project.Id_informe ? (
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
              Ver informe: {project.Id_informe}
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

      {/* Incidencias */}
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-amber-600 border-amber-300 bg-white hover:bg-amber-50 hover:text-amber-600 hover:border-amber-500 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
              {project.incidencias_count ?? 0}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-amber-400 text-amber-600">
            Ver incidencias del proyecto
          </TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Editar proyecto */}
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-gray-600 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-600 hover:border-gray-500 transition-colors"
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
  );
};
