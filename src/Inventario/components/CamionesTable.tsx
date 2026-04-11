"use client"

import * as React from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Search, Plus, Filter, ChevronDown, MoreVertical, Truck } from "lucide-react"

interface Camion {
  id: string
  placa: string
  marca: string
  fechaUltimoChequeo: string
  estado: "disponible" | "en_reparacion" | "averiado" | "inventario_faltante" | "retirado_definitivo" | "en_proyecto"
}

const camionesData: Camion[] = [
  { id: "C001", placa: "ABC-123", marca: "Volvo", fechaUltimoChequeo: "2025-10-01", estado: "disponible" },
  { id: "C002", placa: "XYZ-456", marca: "Scania", fechaUltimoChequeo: "2025-09-15", estado: "en_reparacion" },
]

export function CamionesTable({
  onEdit,
  onAdd,
  activeTab,
  setActiveTab,
}: {
  onEdit: (id: string) => void
  onAdd: () => void
  activeTab: "available" | "unavailable"
  setActiveTab: (tab: "available" | "unavailable") => void
}) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = React.useState(false)

  const filteredData = camionesData.filter(
    (c) =>
      (activeTab === "available" ? c.estado === "disponible" : c.estado !== "disponible") &&
      (searchTerm === "" || c.placa.toLowerCase().includes(searchTerm.toLowerCase()) || c.marca.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
    setSelectedRows(newSelected)
  }

  const handleSelectAll = () => {
    if (selectAll) setSelectedRows(new Set())
    else setSelectedRows(new Set(filteredData.map((c) => c.id)))
    setSelectAll(!selectAll)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Truck className="w-6 h-6 text-blue-600" /> Gestión de Camiones
        </h1>

        <div className="flex gap-8 border-b border-border">
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "available" ? "text-blue-600 border-b-2 border-blue-600" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Disponibles
          </button>
          <button
            onClick={() => setActiveTab("unavailable")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "unavailable" ? "text-blue-600 border-b-2 border-blue-600" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            No disponibles
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
          <p className="text-sm text-muted-foreground">🚛 {filteredData.length} camiones</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Nuevo camión
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                Acciones
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Exportar lista</DropdownMenuItem>
              <DropdownMenuItem>Importar CSV</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Eliminar seleccionados ({selectedRows.size})</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por placa o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground"
        />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Marca / Fabricante</TableHead>
              <TableHead>Fecha Último Chequeo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((camion) => (
              <TableRow key={camion.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Checkbox checked={selectedRows.has(camion.id)} onCheckedChange={() => handleSelectRow(camion.id)} />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{camion.placa}</TableCell>
                <TableCell>{camion.marca}</TableCell>
                <TableCell>{camion.fechaUltimoChequeo}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      camion.estado === "disponible"
                        ? "bg-green-100 text-green-800"
                        : camion.estado === "en_reparacion"
                        ? "bg-yellow-100 text-yellow-800"
                        : camion.estado === "averiado"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {camion.estado.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(camion.id)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
