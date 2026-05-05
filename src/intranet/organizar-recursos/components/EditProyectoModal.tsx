import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useProyecto } from "../hooks/useOrganizarRecursos";
import { InventarioSection } from "./InventarioSection";
import { CamionesSection } from "./CamionesSection";

interface EditProyectoModalProps {
  projectId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProyectoModal({
  projectId,
  isOpen,
  onClose,
}: EditProyectoModalProps) {
  const { data: proyecto, isLoading, refetch } = useProyecto(projectId || 0);

  useEffect(() => {
    if (projectId && isOpen) {
      refetch();
    }
  }, [projectId, isOpen, refetch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">
            {isLoading ? "Cargando..." : `Editar Proyecto #${projectId}`}
          </DialogTitle>
          {!isLoading && proyecto?.Cotizacion_Nombre && (
            <p className="text-sm text-muted-foreground">
              {proyecto.Cotizacion_Nombre}
            </p>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : proyecto ? (
          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="space-y-6 pb-6 pr-1">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Información del Proyecto</h2>
                <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                    <p className="text-sm font-semibold">
                      {proyecto.Cliente_Nombre || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                    <p className="text-sm font-semibold">{proyecto.estado}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                    <p className="text-sm">{proyecto.descripcion_servicio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha Inicio</p>
                    <p className="text-sm font-semibold">
                      {new Date(proyecto.fecha_inicio).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha Fin</p>
                    <p className="text-sm font-semibold">
                      {new Date(proyecto.fecha_fin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <hr />

              <InventarioSection projectId={projectId || 0} />

              <hr />

              <CamionesSection projectId={projectId || 0} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">
              No se pudo cargar la información del proyecto
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
