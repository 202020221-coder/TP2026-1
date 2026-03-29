"use client"

import React, { useState } from "react"
import { Layout } from "@/shared/layout/Layout"
import { CamionesTable } from "./CamionesTable"
import { CamionesForm } from "./CamionesForm"

export const InventarioCamiones = () => {
  const [view, setView] = useState<"table" | "form">("table")
  const [selectedCamionId, setSelectedCamionId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"available" | "unavailable">("available")

  const handleEdit = (id: string) => {
    setSelectedCamionId(id)
    setView("form")
  }

  const handleAdd = () => {
    setSelectedCamionId(null)
    setView("form")
  }

  const handleCancel = () => {
    setSelectedCamionId(null)
    setView("table")
  }

  return (
    <Layout title="Inventario de Camiones">
      {view === "table" ? (
        <CamionesTable
          onEdit={handleEdit}
          onAdd={handleAdd}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <CamionesForm camionId={selectedCamionId} onCancel={handleCancel} />
      )}
    </Layout>
  )
}
