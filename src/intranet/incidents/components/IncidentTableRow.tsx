import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Eye, MessageSquare, Pencil, FileCheck } from "lucide-react";
import { toast } from "sonner";
import type { Incident } from "../interfaces/incident";
import { IncidentStatesRecord } from "../enum/incident-state.record";
import { EditIncidentModal } from "./EditIncidentModal";
import { QuotationCommentsModal } from "./detail/QuotationCommentsModal";

const ConversationStatusList = [
  "no iniciado",
  "iniciado",
  "mensaje pendiente",
  "conversación finalizada",
] as const;
type ConversationStatus = (typeof ConversationStatusList)[number];

export const IncidentTableRow: FC<{
  incident: Incident;
  isSelected?: boolean;
  onSelect?: (incidentId: number) => void;
}> = ({ incident, isSelected = false, onSelect }) => {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const rowData = incident as Incident &
    Partial<{
      nombre: string;
      fecha: string | null;
      version: number;
      precio_subtotal: number | null;
      mensajes: number;
      mensajes_pendientes: number;
      orden_compra_url: string | null;
    }>;

  const displayName =
    rowData.nombre ?? incident.Cotizacion_Nombre ?? incident.Cliente_Nombre;
  const displayDate = rowData.fecha
    ? new Date(rowData.fecha).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "—";
  const displayVersion =
    rowData.version !== undefined && rowData.version !== null
      ? `v${rowData.version}`
      : "—";
  const subtotalValue = rowData.precio_subtotal ?? incident.cotizacion_remuneracion;

  const finalizedStates: ReadonlyArray<string> = [
    IncidentStatesRecord.pagoPorRecibir,
    IncidentStatesRecord.pagoRealizado,
    IncidentStatesRecord.materialRecuperado,
  ];
  const conversationStatus: ConversationStatus = finalizedStates.includes(
    incident.estado,
  )
    ? "conversación finalizada"
    : (rowData.mensajes_pendientes ?? 0) > 0
      ? "mensaje pendiente"
      : (rowData.mensajes ?? 0) > 0
        ? "iniciado"
        : "no iniciado";
  const conversationStatusClassMap: Record<ConversationStatus, string> = {
    "no iniciado": "bg-gray-100 text-gray-600 border-gray-300",
    iniciado: "bg-blue-100 text-blue-700 border-blue-300",
    "mensaje pendiente":
      "bg-amber-100 text-amber-700 border-amber-300 animate-pulse",
    "conversación finalizada": "bg-green-100 text-green-700 border-green-300",
  };
  const conversationStatusLabel =
    conversationStatus.charAt(0).toUpperCase() + conversationStatus.slice(1);

  const messageStatus =
    rowData.mensajes !== undefined
      ? rowData.mensajes > 0
        ? rowData.mensajes_pendientes && rowData.mensajes_pendientes > 0
          ? `Pendientes (${rowData.mensajes_pendientes})`
          : "Enviados"
        : "No iniciado"
      : incident.estado === IncidentStatesRecord.sinEnviar
        ? "No iniciado"
        : incident.estado === IncidentStatesRecord.cotizacionSinRespuesta
          ? "Pendientes"
          : "Enviados";

  return (
    <>
      <EditIncidentModal incident={incident} open={editOpen} onClose={() => setEditOpen(false)} />
      {incident.cotizacion_remuneracion && (
        <QuotationCommentsModal
          quotationId={incident.cotizacion_remuneracion}
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
        />
      )}

      <TableRow
        className={`border-b border-gray-100 transition-colors cursor-pointer ${
          isSelected ? "bg-blue-50/60" : "hover:bg-gray-50"
        }`}
        onClick={() => onSelect?.(incident.id_incidencia)}
      >
        {/* Nombre */}
        <TableCell className="font-medium text-gray-900">
          {displayName}
        </TableCell>

        {/* Fecha */}
        <TableCell className="text-gray-600">{displayDate}</TableCell>

        {/* Versión */}
        <TableCell className="text-center text-gray-700">
          <span className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {displayVersion}
          </span>
        </TableCell>

        {/* Precio Subtotal */}
        <TableCell className="text-center text-gray-700">
          {subtotalValue !== null && subtotalValue !== undefined ? (
            <span className="font-mono">
              S/ {subtotalValue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </span>
          ) : (
            <span className="text-gray-400 italic text-sm">—</span>
          )}
        </TableCell>

        {/* Estado */}
        <TableCell className="text-center">
          <span
            className={`inline-block rounded-full px-3 py-1 text-[13px] font-medium border ${conversationStatusClassMap[conversationStatus]}`}
          >
            {conversationStatusLabel}
          </span>
        </TableCell>

        {/* Acciones */}
        <TableCell className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/intranet/incidencias/${incident.id_incidencia}`);
                  }}
                  className="h-8 w-8 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                  aria-label="Ver"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-gray-400 text-gray-600">
                Ver detalle de la incidencia
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (incident.cotizacion_remuneracion) {
                      setCommentsOpen(true);
                    } else {
                      toast.info("No hay cotización de remuneración asociada para ver comentarios");
                    }
                  }}
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  aria-label="Comentarios"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-blue-400 text-blue-600">
                Ver comentarios de la incidencia
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(event) => {
                    event.stopPropagation();
                    setEditOpen(true);
                  }}
                  className="h-8 w-8 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                  aria-label="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-gray-400 text-gray-600">
                Editar incidencia
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (rowData.orden_compra_url) {
                      window.open(rowData.orden_compra_url, "_blank", "noopener,noreferrer");
                    } else {
                      toast.info("No hay orden de compra asociada a esta incidencia");
                    }
                  }}
                  className="h-8 w-8 text-violet-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  aria-label="Ver orden de compra"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-violet-400 text-violet-600">
                Ver orden de compra asociada
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>

        {/* Mensajes */}
        <TableCell className="text-center">
          <span
            className={`inline-block rounded-full px-3 py-1 text-[13px] font-medium border ${
              messageStatus === "Pendientes (1)"
                ? "bg-amber-100 text-amber-700 border-amber-300"
                : messageStatus === "Pendientes"
                  ? "bg-amber-100 text-amber-700 border-amber-300"
                  : messageStatus === "Enviados"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {messageStatus}
          </span>
        </TableCell>
      </TableRow>
    </>
  );
};
