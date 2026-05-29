import React from "react";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { canEditPersonnel } from "@/intranet/layout/sidebar-links";
import { PersonnelForm, PersonnelTable } from "../components";

export const PersonnelManagement = () => {
  const role = useSession((state) => state.loggedUser?.rol);
  const canEdit = canEditPersonnel(role);
  const [view, setView] = React.useState<"table" | "form">("table");
  const [selectedPersonnelId, setSelectedPersonnelId] = React.useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = React.useState<"active" | "inactive">(
    "active",
  );

  const handleEdit = (id: string) => {
    setSelectedPersonnelId(id);
    setView("form");
  };

  const handleAdd = () => {
    setSelectedPersonnelId(null);
    setView("form");
  };

  const handleCancel = () => {
    setSelectedPersonnelId(null);
    setView("table");
  };

  return (
    <>
      {view === "table" ? (
        <PersonnelTable
          onEdit={handleEdit}
          onAdd={canEdit ? handleAdd : undefined}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canEdit={canEdit}
        />
      ) : (
        <PersonnelForm
          personnelId={selectedPersonnelId}
          onCancel={handleCancel}
          canEdit={canEdit}
        />
      )}
    </>
  );
};
