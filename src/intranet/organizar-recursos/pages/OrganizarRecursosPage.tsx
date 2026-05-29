import { useState } from "react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { canEditResources } from "@/intranet/layout/sidebar-links";
import { useProyectosList } from "../hooks/useOrganizarRecursos";
import { ProyectosTable } from "../components/ProyectosTable";
import { EditProyectoModal } from "../components/EditProyectoModal";

export function OrganizarRecursosPage() {
  const role = useSession((state) => state.loggedUser?.rol);
  const canEdit = canEditResources(role);
  const [page, setPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: proyectosData, isLoading } = useProyectosList(page, 10);

  const handleEdit = (id: number) => {
    setSelectedProjectId(id);
    setIsEditOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditOpen(false);
    setSelectedProjectId(null);
  };

  return (
    <div className="flex h-full flex-col bg-background px-6 py-4 space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Organizar Recursos
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Gestiona la asignación de objetos y camiones para los proyectos
        </p>
      </div>

      <ProyectosTable
        proyectos={proyectosData?.data || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        canEdit={canEdit}
        pagination={
          proyectosData?.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          }
        }
        onPageChange={setPage}
      />

      <EditProyectoModal
        projectId={selectedProjectId}
        isOpen={isEditOpen}
        canEdit={canEdit}
        onClose={handleCloseModal}
      />
    </div>
  );
}
