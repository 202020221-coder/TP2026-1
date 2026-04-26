import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useProyectoTodo } from "../hooks/useOrganizarRecursos";
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
  const { data: proyectoData, isLoading, refetch } = useProyectoTodo(
    projectId || 0
  );

  useEffect(() => {
    if (projectId && isOpen) {
      refetch();
    }
  }, [projectId, isOpen, refetch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* flex flex-col + overflow-hidden para que el hijo scrollable funcione correctamente */}
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">
            {isLoading ? "Cargando..." : `Editar Proyecto #${projectId}`}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : proyectoData ? (
          /* min-h-0 es crítico: sin él, flex-1 no puede contraerse y no hay scroll */
          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="space-y-6 pb-6 pr-1">
              {/* Información del Proyecto */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Información del Proyecto</h2>
                <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                    <p className="text-sm font-semibold">
                      {proyectoData.proyecto.Cliente_Nombre || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                    <p className="text-sm font-semibold">{proyectoData.proyecto.estado}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                    <p className="text-sm">{proyectoData.proyecto.descripcion_servicio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha Inicio</p>
                    <p className="text-sm font-semibold">
                      {new Date(proyectoData.proyecto.fecha_inicio).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha Fin</p>
                    <p className="text-sm font-semibold">
                      {new Date(proyectoData.proyecto.fecha_fin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <hr />

              {/* Sección Inventario */}
              <InventarioSection projectId={projectId || 0} />

              <hr />

              {/* Sección Camiones */}
              <CamionesSection
                projectId={projectId || 0}
                camiones={proyectoData.camiones}
                onRefresh={() => refetch()}
              />
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
