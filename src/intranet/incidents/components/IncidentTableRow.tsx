import { useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { PackageSearch, Users, Pencil, Trash2 } from "lucide-react";
import type { Incident } from "../interfaces/incident";
import {
  type IncidentState,
  IncidentStatesRecord,
} from "../enum/incident-state.record";
import { deleteIncident } from "../api/incident.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditIncidentModal } from "./EditIncidentModal";
import { IncidentObjectsModal } from "./IncidentObjectsModal";
import { IncidentInvolvedModal } from "./IncidentInvolvedModal";

export const IncidentTableRow: FC<{ incident: Incident }> = ({ incident }) => {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [objectsOpen, setObjectsOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);

  const statusStyles = new Map<IncidentState, string>([
    [IncidentStatesRecord.sinEnviar, "bg-gray-100 text-gray-600 border-gray-300"],
    [IncidentStatesRecord.enviado, "bg-blue-100 text-blue-700 border-blue-300"],
    [IncidentStatesRecord.enRevision, "bg-yellow-100 text-yellow-700 border-yellow-300"],
    [IncidentStatesRecord.cerrado, "bg-green-100 text-green-700 border-green-300"],
  ]);

  const handleDelete = () => {
    toast.promise(
      deleteIncident(incident.id_incidencia).then(() =>
        queryClient.invalidateQueries({ queryKey: ["incidents"] })
      ),
      {
        loading: "Eliminando incidencia...",
        success: "Incidencia eliminada.",
        error: "No se pudo eliminar la incidencia.",
      }
    );
  };

  return (
    <>
      <EditIncidentModal
        incident={incident}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <IncidentObjectsModal
        incidentId={incident.id_incidencia}
        open={objectsOpen}
        onClose={() => setObjectsOpen(false)}
      />
      <IncidentInvolvedModal
        incidentId={incident.id_incidencia}
        open={involvedOpen}
        onClose={() => setInvolvedOpen(false)}
      />

      <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        {/* ID */}
        <TableCell className="font-mono text-gray-500 text-sm">
          #{incident.id_incidencia}
        </TableCell>

        {/* Cliente */}
        <TableCell className="font-medium">{incident.Cliente_Nombre}</TableCell>

        {/* Cotización */}
        <TableCell className="text-gray-600">
          {incident.Cotizacion_Nombre ?? (
            <span className="text-gray-400 italic text-sm">—</span>
          )}
        </TableCell>

        {/* Empresa involucrada */}
        <TableCell className="text-gray-600 font-mono text-sm">
          {incident.empresa_involucrada}
        </TableCell>

        {/* Comentario */}
        <TableCell className="text-gray-700 max-w-[220px] truncate" title={incident.comentario}>
          {incident.comentario}
        </TableCell>

        {/* Remuneración cotización */}
        <TableCell className="text-center text-gray-700">
          {incident.cotizacion_remuneracion !== null &&
          incident.cotizacion_remuneracion !== undefined ? (
            <span className="font-mono">
              S/ {incident.cotizacion_remuneracion.toLocaleString("es-PE")}
            </span>
          ) : (
            <span className="text-gray-400 italic text-sm">—</span>
          )}
        </TableCell>

        {/* Estado */}
        <TableCell className="text-center">
          <span
            className={`inline-block rounded-full px-3 py-1 text-[13px] font-medium border ${
              statusStyles.get(incident.estado as IncidentState) ??
              "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {incident.estado}
          </span>
        </TableCell>

        {/* Objetos */}
        <TableCell className="text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setObjectsOpen(true)}
                className="h-8 px-3 text-violet-600 border-violet-300 bg-white hover:bg-violet-50 hover:text-violet-600 hover:border-violet-500 transition-colors"
              >
                <PackageSearch className="w-3.5 h-3.5 mr-1 text-violet-600" />
                Ver
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-violet-400 text-violet-600">
              Ver objetos y camiones de la incidencia
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* Involucrados */}
        <TableCell className="text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInvolvedOpen(true)}
                className="h-8 px-3 text-blue-600 border-blue-300 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 transition-colors"
              >
                <Users className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Ver
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-blue-400 text-blue-600">
              Ver involucrados de la incidencia
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* Acciones */}
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                  className="h-8 px-3 text-gray-600 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-600 hover:border-gray-500 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1 text-gray-600" />
                  Editar
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-gray-400 text-gray-600">
                Editar incidencia
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 px-2 text-red-500 border-red-300 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-red-400 text-red-500">
                Eliminar incidencia
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
