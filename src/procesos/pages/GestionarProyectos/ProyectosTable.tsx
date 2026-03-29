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
import { Search, Plus, Filter, ChevronDown, MoreVertical } from "lucide-react"

interface Personnel {
  id: string
  name: string
  employeeNo: string
  role: string
  position: string
  area: string
  status: "active" | "inactive"
}

const personnelData: Personnel[] = [
  {
    id: "P001",
    name: "AARON BORJA MEDINA",
    employeeNo: "00011814",
    role: "AUXILIAR DE PLANEAMIENTO DE LA PRODUCCION",
    position: "POS-1005620",
    area: "PLANEAMIENTO PRODUCCION",
    status: "active",
  },
  {
    id: "P002",
    name: "ABDON SERGIO CERVANTES RAMIREZ",
    employeeNo: "00011127",
    role: "OPERARIO DE PRODUCCION",
    position: "POS_130548",
    area: "PLANTA LATEX",
    status: "active",
  },
  {
    id: "P003",
    name: "ABEL ANTONIO VILLODAS AGUIRRE",
    employeeNo: "00004397",
    role: "OPERADOR DE MONTACARGA",
    position: "POS_130356",
    area: "ALMACENES CENTRALES",
    status: "active",
  },
  {
    id: "P004",
    name: "ABEL BRAYDEN ESTELA IDROGO",
    employeeNo: "00011675",
    role: "PRACTICANTE DE QUIMICOS Y MATERIALES",
    position: "POS_130656",
    area: "SSOMA",
    status: "inactive",
  },
]

const getInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const getAvatarColor = (index: number) => {
  const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"]
  return colors[index % colors.length]
}

export function PersonalTable({
  onEdit,
  onAdd,
  activeTab,
  setActiveTab,
}: {
  onEdit: (id: string) => void
  onAdd: () => void
  activeTab: "active" | "inactive"
  setActiveTab: (tab: "active" | "inactive") => void
}) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = React.useState(false)

  const filteredData = personnelData.filter(
    (p) =>
      (activeTab === "active" ? p.status === "active" : p.status === "inactive") &&
      (searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.employeeNo.includes(searchTerm) ||
        p.position.includes(searchTerm)),
  )

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredData.map((p) => p.id)))
    }
    setSelectAll(!selectAll)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-border">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Colaboradores activos
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "inactive"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Colaboradores inactivos
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
          <p className="text-sm text-muted-foreground">👥 {filteredData.length} colaboradores</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Nuevo colaborador
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                Acciones
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-foreground">Cargas masivas</p>
              </div>
              <DropdownMenuItem>Cargar o actualizar colaboradores</DropdownMenuItem>
              <DropdownMenuItem>Cargar avatars</DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-foreground">Descargas masivas</p>
              </div>
              <DropdownMenuItem>Descargar colaboradores seleccionados ({selectedRows.size})</DropdownMenuItem>
              <DropdownMenuItem>Descargar todos los colaboradores</DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-foreground">Acciones masivas</p>
              </div>
              <DropdownMenuItem>Restablecer contraseña de seleccionados ({selectedRows.size})</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Dar de baja a colaboradores seleccionados ({selectedRows.size})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, ID o posición..."
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
              <TableHead>Nro. Colaborador</TableHead>
              <TableHead>Posición</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Área</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((person, index) => (
              <TableRow key={person.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Checkbox checked={selectedRows.has(person.id)} onCheckedChange={() => handleSelectRow(person.id)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-sm font-semibold`}
                    >
                      {getInitials(person.name)}
                    </div>
                    <span className="font-medium text-blue-600">{person.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{person.employeeNo}</TableCell>
                <TableCell className="text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">{person.position}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{person.position}</TableCell>
                <TableCell className="text-sm">{person.area}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(person.id)}>Editar</DropdownMenuItem>
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
