import React from "react";
import { PersonnelForm, PersonnelTable } from "../components";

export const PersonnelManagement = () => {
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
          onAdd={handleAdd}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <PersonnelForm
          personnelId={selectedPersonnelId}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};
