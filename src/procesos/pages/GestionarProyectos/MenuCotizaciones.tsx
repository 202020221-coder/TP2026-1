import React from 'react'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Search, Plus, Pencil, Trash2, Eye, Download, Filter } from "lucide-react"
import { Layout } from '@/shared/layout/Layout'
interface Cotizacion {
  id: string
  numeroRef: string
  cliente: string
  fechaEmision: string
  monto: number
  estado: "pendiente" | "aprobada" | "rechazada" | "enviada" | "vencida"
  fechaVencimiento: string
  descripcion: string
  validez: number
}

interface MenuCotizacionesProps {
  cotizaciones?: Cotizacion[]
  onAgregar?: (cotizacion: Cotizacion) => void
  onEditar?: (id: string, cotizacion: Cotizacion) => void
  onEliminar?: (id: string) => void
}

const estadoConfig = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  aprobada: { label: "Aprobada", color: "bg-green-100 text-green-800" },
  rechazada: { label: "Rechazada", color: "bg-red-100 text-red-800" },
  enviada: { label: "Enviada", color: "bg-blue-100 text-blue-800" },
  vencida: { label: "Vencida", color: "bg-gray-100 text-gray-800" },
}

export function MenuCotizaciones({
  cotizaciones: initialCotizaciones = [],
  onAgregar,
  onEditar,
  onEliminar,
}: MenuCotizacionesProps) {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(initialCotizaciones)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("")
  const [filtroFechaFin, setFiltroFechaFin] = useState("")
  const [filtroCliente, setFiltroCliente] = useState("")
  const [detalleId, setDetalleId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<Cotizacion>>({
    numeroRef: "",
    cliente: "",
    fechaEmision: new Date().toISOString().split("T")[0],
    monto: 0,
    estado: "pendiente",
    fechaVencimiento: "",
    descripcion: "",
    validez: 30,
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto" || name === "validez" ? Number(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      const updated = cotizaciones.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      setCotizaciones(updated as Cotizacion[])
      onEditar?.(editingId, { ...cotizaciones.find((c) => c.id === editingId)!, ...formData } as Cotizacion)
    } else {
      const newCotizacion: Cotizacion = {
        id: Date.now().toString(),
        numeroRef: formData.numeroRef || "",
        cliente: formData.cliente || "",
        fechaEmision: formData.fechaEmision || "",
        monto: formData.monto || 0,
        estado: (formData.estado as any) || "pendiente",
        fechaVencimiento: formData.fechaVencimiento || "",
        descripcion: formData.descripcion || "",
        validez: formData.validez || 30,
      }
      setCotizaciones([...cotizaciones, newCotizacion])
      onAgregar?.(newCotizacion)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      numeroRef: "",
      cliente: "",
      fechaEmision: new Date().toISOString().split("T")[0],
      monto: 0,
      estado: "pendiente",
      fechaVencimiento: "",
      descripcion: "",
      validez: 30,
    })
    setShowForm(false)
    setEditingId(null)
    setDetalleId(null)
  }

  const handleEdit = (id: string) => {
    const cotizacion = cotizaciones.find((c) => c.id === id)
    if (cotizacion) {
      setFormData(cotizacion)
      setEditingId(id)
      setShowForm(true)
      setDetalleId(null)
    }
  }

  const handleDelete = (id: string) => {
    setCotizaciones(cotizaciones.filter((c) => c.id !== id))
    onEliminar?.(id)
  }

  const handleVerDetalle = (id: string) => {
    setDetalleId(detalleId === id ? null : id)
  }

  const cotizacionesFiltradas = cotizaciones.filter((cotizacion) => {
    const matchBusqueda =
      cotizacion.numeroRef.toLowerCase().includes(busqueda.toLowerCase()) ||
      cotizacion.cliente.toLowerCase().includes(busqueda.toLowerCase())

    const matchEstado = filtroEstado === "todos" || cotizacion.estado === filtroEstado

    const matchFecha =
      (!filtroFechaInicio || cotizacion.fechaEmision >= filtroFechaInicio) &&
      (!filtroFechaFin || cotizacion.fechaEmision <= filtroFechaFin)

    const matchCliente = !filtroCliente || cotizacion.cliente.toLowerCase().includes(filtroCliente.toLowerCase())

    return matchBusqueda && matchEstado && matchFecha && matchCliente
  })

  const cotizacionDetalle = detalleId ? cotizaciones.find((c) => c.id === detalleId) : null

  const handleExportarPDF = (cotizacion: Cotizacion) => {
    console.log("[v0] Exporting to PDF:", cotizacion)
    // Placeholder para implementar exportación a PDF
    alert(`Exportando cotización ${cotizacion.numeroRef} a PDF...`)
  }

  return (
    <Layout className="w-full space-y-6" title="Gestionar Cotizaciones">
      <div className='px-5'>
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Cotizaciones</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Total: {cotizacionesFiltradas.length} cotizaciones</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(true)
            setDetalleId(null)
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={20} /> Nueva Cotización
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar y Filtrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <Input
                placeholder="Buscar por número o cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobada">Aprobada</SelectItem>
                <SelectItem value="rechazada">Rechazada</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Fecha de inicio</Label>
              <Input type="date" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Fecha de fin</Label>
              <Input type="date" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Cliente</Label>
              <Input
                placeholder="Nombre del cliente..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBusqueda("")
                setFiltroEstado("todos")
                setFiltroFechaInicio("")
                setFiltroFechaFin("")
                setFiltroCliente("")
              }}
            >
              <Filter size={16} /> Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Nueva"} Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Número de Referencia *</Label>
                  <Input
                    name="numeroRef"
                    value={formData.numeroRef || ""}
                    onChange={handleFormChange}
                    placeholder="COT-2025-001"
                    required
                  />
                </div>
                <div>
                  <Label>Cliente *</Label>
                  <Input
                    name="cliente"
                    value={formData.cliente || ""}
                    onChange={handleFormChange}
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Descripción *</Label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={handleFormChange}
                  placeholder="Descripción detallada del proyecto..."
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Monto (USD) *</Label>
                  <Input
                    name="monto"
                    type="number"
                    value={formData.monto || ""}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label>Validez (días)</Label>
                  <Input
                    name="validez"
                    type="number"
                    value={formData.validez || 30}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label>Fecha de Emisión</Label>
                  <Input
                    name="fechaEmision"
                    type="date"
                    value={formData.fechaEmision || ""}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={formData.estado || "pendiente"}
                    onValueChange={(value) => handleSelectChange("estado", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="aprobada">Aprobada</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                      <SelectItem value="enviada">Enviada</SelectItem>
                      <SelectItem value="vencida">Vencida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Fecha de Vencimiento</Label>
                <Input
                  name="fechaVencimiento"
                  type="date"
                  value={formData.fechaVencimiento || ""}
                  onChange={handleFormChange}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? "Actualizar" : "Crear"} Cotización
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {cotizacionDetalle && (
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Detalles de Cotización: {cotizacionDetalle.numeroRef}</CardTitle>
                <CardDescription>Cliente: {cotizacionDetalle.cliente}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetalleId(null)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-slate-600 mb-3">Información General</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Número:</span>
                    <p className="font-medium">{cotizacionDetalle.numeroRef}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Cliente:</span>
                    <p className="font-medium">{cotizacionDetalle.cliente}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Fecha de Emisión:</span>
                    <p className="font-medium">{cotizacionDetalle.fechaEmision}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Fecha de Vencimiento:</span>
                    <p className="font-medium">{cotizacionDetalle.fechaVencimiento || "No especificada"}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Estado:</span>
                    <p className="font-medium">
                      <Badge className={estadoConfig[cotizacionDetalle.estado]?.color}>
                        {estadoConfig[cotizacionDetalle.estado]?.label}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-slate-600 mb-3">Monto y Validez</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <span className="text-slate-500">Monto Total:</span>
                    <p className="text-2xl font-bold text-blue-600">${cotizacionDetalle.monto.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Validez:</span>
                    <p className="font-medium">{cotizacionDetalle.validez} días</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-slate-600 mb-3">Descripción</h3>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">{cotizacionDetalle.descripcion}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button size="sm" variant="outline" onClick={() => handleEdit(cotizacionDetalle.id)}>
                <Pencil size={16} className="mr-2" /> Editar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExportarPDF(cotizacionDetalle)}>
                <Download size={16} className="mr-2" /> Exportar PDF
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  handleDelete(cotizacionDetalle.id)
                  setDetalleId(null)
                }}
              >
                <Trash2 size={16} className="mr-2" /> Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {cotizacionesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">
                {cotizaciones.length === 0
                  ? "No hay cotizaciones creadas"
                  : "No hay cotizaciones que coincidan con los filtros"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-900">
                  <th className="px-4 py-3 text-left font-semibold">Número</th>
                  <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha Emisión</th>
                  <th className="px-4 py-3 text-right font-semibold">Monto</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold">Vencimiento</th>
                  <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cotizacionesFiltradas.map((cotizacion) => (
                  <tr key={cotizacion.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-medium text-blue-600">{cotizacion.numeroRef}</td>
                    <td className="px-4 py-3">{cotizacion.cliente}</td>
                    <td className="px-4 py-3">{cotizacion.fechaEmision}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      ${cotizacion.monto.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={estadoConfig[cotizacion.estado]?.color}>
                        {estadoConfig[cotizacion.estado]?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{cotizacion.fechaVencimiento || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVerDetalle(cotizacion.id)}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(cotizacion.id)} title="Editar">
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(cotizacion.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      </div>
    </Layout>
  )
}

