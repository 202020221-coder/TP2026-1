"use client"

import { Layout } from "@/shared/layout/Layout"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { XCircle, Save } from "lucide-react"
import React from "react"

export const GestionarCamiones = () => {
  const [formData, setFormData] = React.useState({
    placa: "",
    marcaFabricante: "",
    fechaUltimoChequeo: "",
    estado: "",
    inventarioFaltante: "",
    proyectoExtra: "",
    fechaEntrada: "",
    fechaSalida: "",
    observaciones: "",
  })

  const inventarioMock = ["Extintor", "Manguera", "Bomba", "Válvula"]
  const proyectosMock = ["Proyecto Lima Centro", "Proyecto Surco", "Proyecto Arequipa"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    alert("Camión registrado correctamente")
  }

  return (
    <Layout title="Gestión de Camiones">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="placa">Placa</Label>
            <Input name="placa" id="placa" value={formData.placa} onChange={handleChange} placeholder="ABC-123" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marcaFabricante">Marca / Fabricante</Label>
            <Input
              name="marcaFabricante"
              id="marcaFabricante"
              value={formData.marcaFabricante}
              onChange={handleChange}
              placeholder="Ej: Volvo, Scania..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaUltimoChequeo">Fecha Último Chequeo</Label>
            <Input
              name="fechaUltimoChequeo"
              id="fechaUltimoChequeo"
              type="date"
              value={formData.fechaUltimoChequeo}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <select
              name="estado"
              id="estado"
              value={formData.estado}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            >
              <option value="">-- Selecciona --</option>
              <option value="disponible">Disponible</option>
              <option value="en_reparacion">En reparación</option>
              <option value="averiado">Averiado</option>
              <option value="inventario_faltante">Inventario faltante</option>
              <option value="retirado_definitivo">Retirado de manera definitiva</option>
              <option value="en_proyecto">En proyecto</option>
            </select>
          </div>

          {formData.estado === "inventario_faltante" && (
            <div className="space-y-2">
              <Label htmlFor="inventarioFaltante">Objeto faltante</Label>
              <select
                name="inventarioFaltante"
                id="inventarioFaltante"
                value={formData.inventarioFaltante}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
              >
                <option value="">-- Selecciona objeto --</option>
                {inventarioMock.map((obj) => (
                  <option key={obj} value={obj}>
                    {obj}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.estado === "en_proyecto" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="proyectoExtra">Proyecto Asignado</Label>
                <select
                  name="proyectoExtra"
                  id="proyectoExtra"
                  value={formData.proyectoExtra}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full"
                >
                  <option value="">-- Selecciona proyecto --</option>
                  {proyectosMock.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaEntrada">Fecha de Entrada</Label>
                <Input
                  name="fechaEntrada"
                  id="fechaEntrada"
                  type="date"
                  value={formData.fechaEntrada}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaSalida">Fecha de Salida</Label>
                <Input
                  name="fechaSalida"
                  id="fechaSalida"
                  type="date"
                  value={formData.fechaSalida}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            name="observaciones"
            id="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Notas adicionales sobre el camión..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setFormData({ ...formData })}>
            <XCircle className="w-4 h-4 mr-2" /> Cancelar
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" /> Registrar
          </Button>
        </div>
      </form>
    </Layout>
  )
}

export default GestionarCamiones
