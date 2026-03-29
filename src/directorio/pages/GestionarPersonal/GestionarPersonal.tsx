import React from 'react'

import { Layout } from '@/shared/layout/Layout';
import { PersonalTable } from './PersonalTable';
import { PersonalForm } from './PersonalForm';

export const GestionarPersonal = () => {
  const [view, setView] = React.useState<"table" | "form">("table")
  const [selectedPersonnelId, setSelectedPersonnelId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"active" | "inactive">("active")

  const handleEdit = (id: string) => {
    setSelectedPersonnelId(id)
    setView("form")
  }

  const handleAdd = () => {
    setSelectedPersonnelId(null)
    setView("form")
  }

  const handleCancel = () => {
    setSelectedPersonnelId(null)
    setView("table")
  }

  return (
    <Layout title = "Gestionar personal">
      {view === "table" ? (
        <PersonalTable onEdit={handleEdit} onAdd={handleAdd} activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <PersonalForm personnelId={selectedPersonnelId} onCancel={handleCancel} />
      )}
    </Layout>
  )
}
