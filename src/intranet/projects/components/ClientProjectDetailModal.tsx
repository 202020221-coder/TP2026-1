import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FileText, ClipboardList, Receipt, Hash } from "lucide-react";
import type { Project } from "../interfaces/project";

interface ClientProjectDetailModalProps {
  project: Project & { Proyecto_Nombre?: string };
  open: boolean;
  onClose: () => void;
}

export const ClientProjectDetailModal: FC<ClientProjectDetailModalProps> = ({
  project,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !max-w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
        {/* Header rojo */}
        <DialogHeader className="bg-red-500 px-6 py-4 rounded-t-lg sticky top-0 z-10">
          <DialogTitle className="text-white text-xl font-bold">
            Detalle del Proyecto
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3 border-b border-red-100 pb-1">
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-4">

              {/* ID Proyecto */}
              <div className="flex gap-2 items-start">
                <Hash className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">ID Proyecto</p>
                  <p className="text-sm font-medium text-gray-800">{project.id_Proyecto}</p>
                </div>
              </div>

              {/* ID Cliente */}
              <div className="flex gap-2 items-start">
                <Hash className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">ID Cliente</p>
                  <p className="text-sm font-medium text-gray-800">{project.Id_Cliente ?? "—"}</p>
                </div>
              </div>

              {/* ID Trabajo */}
              <div className="flex gap-2 items-start">
                <Hash className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">ID Trabajo</p>
                  <p className="text-sm font-medium text-gray-800">{project.ID_Trabajo ?? "—"}</p>
                </div>
              </div>

              {/* ID Cotización */}
              <div className="flex gap-2 items-start">
                <Hash className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">ID Cotización</p>
                  <p className="text-sm font-medium text-gray-800">{project.id_cotizacion ?? "—"}</p>
                </div>
              </div>

              {/* Descripción del servicio */}
              <div className="col-span-2 flex gap-2 items-start">
                <FileText className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Descripción del servicio</p>
                  <p className="text-sm text-gray-700 break-words">{project.descripcion_servicio ?? "—"}</p>
                </div>
              </div>

              {/* Factura */}
              <div className="flex gap-2 items-start">
                <Receipt className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Factura</p>
                  <p className="text-sm text-gray-700">{project.factura ?? "—"}</p>
                </div>
              </div>

              {/* Observaciones */}
              <div className="col-span-2 flex gap-2 items-start">
                <ClipboardList className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Observaciones</p>
                  <p className="text-sm text-gray-700 break-words">{project.observaciones ?? "—"}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};