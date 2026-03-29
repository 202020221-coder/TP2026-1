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
import { Search, Plus, Filter, ChevronDown, MoreVertical, Package } from "lucide-react"

interface Item {
  id: string
  nombre: string
  fabricante: string
  numero_serial?: string
  lugar_almacenaje?: string
  cantidad: number
  estado: "disponible" | "en_reparacion" | "retirado" | "daniado"
}

const itemsData: Item[] = [
  {
    id: "I001",
    nombre: "Extintor CO2 10lb",
    fabricante: "Kidde",
    numero_serial: "EX12345",
    lugar_almacenaje: "Camión 03",
    cantidad: 5,
    estado: "disponible",
  },
  {
    id: "I002",
    nombre: "Manguera 1.5'' 30m",
    fabricante: "Angus Fire",
    numero_serial: "MGH7890",
    lugar_almacenaje: "Depósito Central",
    cantidad: 10,
    estado: "en_reparacion",
  },
]

export function InventarioTable({
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

  const filteredData = itemsData.filter(
    (i) =>
      (activeTab === "available"
        ? i.estado === "disponible"
        : i.estado !== "disponible") &&
      (searchTerm === "" ||
        i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.numero_serial && i.numero_serial.includes(searchTerm)))
  )

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
    setSelectedRows(newSelected)
  }

  const handleSelectAll = () => {
    if (selectAll) setSelectedRows(new Set())
    else setSelectedRows(new Set(filteredData.map((i) => i.id)))
    setSelectAll(!selectAll)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" /> Inventario General
        </h1>

        <div className="flex gap-8 border-b border-border">
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "available"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Disponibles
          </button>
          <button
            onClick={() => setActiveTab("unavailable")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "unavailable"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
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
          <p className="text-sm text-muted-foreground">📦 {filteredData.length} objetos</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Nuevo objeto
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                Acciones
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Exportar inventario</DropdownMenuItem>
              <DropdownMenuItem>Importar CSV</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Eliminar seleccionados ({selectedRows.size})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, fabricante o serie..."
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
              <TableHead>Nombre</TableHead>
              <TableHead>Fabricante</TableHead>
              <TableHead>N° Serie</TableHead>
              <TableHead>Lugar Almacenaje</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item.id)}
                    onCheckedChange={() => handleSelectRow(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{item.nombre}</TableCell>
                <TableCell>{item.fabricante}</TableCell>
                <TableCell>{item.numero_serial ?? "—"}</TableCell>
                <TableCell>{item.lugar_almacenaje ?? "—"}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.estado === "disponible"
                        ? "bg-green-100 text-green-800"
                        : item.estado === "en_reparacion"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.estado.replace("_", " ")}
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
                      <DropdownMenuItem onClick={() => onEdit(item.id)}>Editar</DropdownMenuItem>
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
