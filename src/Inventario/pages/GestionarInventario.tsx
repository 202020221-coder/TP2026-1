import React from 'react'

import { Layout } from '@/shared/layout/Layout';
import { InventarioTable } from './InventarioTable';
import { InventarioForm } from './InventarioForm';

export const GestionarInventario = () => {
  const [view, setView] = React.useState<"table" | "form">("table")
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"available" | "unavailable">("available")

  const handleEdit = (id: string) => {
    setSelectedItemId(id)
    setView("form")
  }

  const handleAdd = () => {
    setSelectedItemId(null)
    setView("form")
  }

  const handleCancel = () => {
    setSelectedItemId(null)
    setView("table")
  }

  return (
    <Layout title="Gestión de Inventario">
      {view === "table" ? (
        <InventarioTable 
          onEdit={handleEdit} 
          onAdd={handleAdd} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      ) : (
        <InventarioForm 
          itemId={selectedItemId} 
          onCancel={handleCancel} 
        />
      )}
    </Layout>
  )
}
