import React from "react";
import { InventarioForm, InventarioTable } from "../components";
import { ListInventarioProvider } from "../context/ListInventarioProvider";

export const GestionarInventario = () => {
  const [view, setView] = React.useState<"table" | "form">("table");
  const [selectedItemId, setSelectedItemId] = React.useState<number | null>(
    null,
  );

  const handleEdit = (id: number) => {
    setSelectedItemId(id);
    setView("form");
  };

  const handleAdd = () => {
    setSelectedItemId(null);
    setView("form");
  };

  const handleCancel = () => {
    setSelectedItemId(null);
    setView("table");
  };

  if (view === "form") {
    return <InventarioForm itemId={selectedItemId} onCancel={handleCancel} />;
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Inventario general
        </h1>
      </div>
      <ListInventarioProvider>
        <div className="bg-card p-6 rounded-xl shadow-xs border flex flex-col flex-1 min-h-0">
          <InventarioTable onEdit={handleEdit} onAdd={handleAdd} />
        </div>
      </ListInventarioProvider>
    </>
  );
};
