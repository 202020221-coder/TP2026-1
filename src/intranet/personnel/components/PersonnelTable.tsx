import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Search, Plus, Filter, ChevronDown, MoreVertical, AlertCircle, RefreshCw } from "lucide-react"
import { personnelService } from "../services/personnel.service"
import { friendlyError } from "../lib/friendly-error"
import type { Personal } from "../types"

const getInitials = (nombre: string, apellido: string) => {
  const a = nombre.trim()[0] ?? ""
  const b = apellido.trim()[0] ?? ""
  const initials = `${a}${b}`.toUpperCase()
  return initials || "?"
}

const getAvatarColor = (index: number) => {
  const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"]
  return colors[index % colors.length]
}

const estadoBadge = (estado: Personal["estado"]) => {
  switch (estado) {
    case "disponible":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Disponible</Badge>
    case "en trabajo":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">En trabajo</Badge>
    case "inhabilitado":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Inhabilitado</Badge>
    default:
      return <span className="text-xs text-muted-foreground">—</span>
  }
}

export function PersonnelTable({
  onEdit,
  onAdd,
  activeTab,
  setActiveTab,
  canEdit,
}: {
  onEdit: (id: string) => void
  onAdd?: () => void
  activeTab: "active" | "inactive"
  setActiveTab: (tab: "active" | "inactive") => void
  canEdit: boolean
}) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = React.useState(false)
  const [data, setData] = React.useState<Personal[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [deletingDni, setDeletingDni] = React.useState<string | null>(null)

  const loadData = React.useCallback(() => {
    setLoading(true)
    setError(null)
    personnelService
      .list()
      .then((res) => setData(res.data))
      .catch((e: unknown) => setError(friendlyError(e, "No se pudo cargar el personal")))
      .finally(() => setLoading(false))
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const filteredData = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return data.filter((p) => {
      const isInactive = p.estado === "inhabilitado"
      const matchesTab = activeTab === "active" ? !isInactive : isInactive
      if (!matchesTab) return false
      if (!term) return true
      const haystack = [p.Nombre, p.Apellido, p.DNI, p.profesion ?? "", p.rol ?? ""]
        .join(" ")
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [data, searchTerm, activeTab])

  const handleSelectRow = (dni: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(dni)) {
      newSelected.delete(dni)
    } else {
      newSelected.add(dni)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredData.map((p) => p.DNI)))
    }
    setSelectAll(!selectAll)
  }

  const handleDelete = async (person: Personal) => {
    if (!person.DNI) {
      toast.error("Este colaborador no tiene un DNI válido")
      return
    }
    if (
      !window.confirm(
        `¿Eliminar a ${person.Nombre} ${person.Apellido} (DNI ${person.DNI})? Esta acción no se puede deshacer.`,
      )
    )
      return
    setDeletingDni(person.DNI)
    try {
      await personnelService.remove(person.DNI)
      toast.success("Colaborador eliminado")
      setData((prev) => prev.filter((p) => p.DNI !== person.DNI))
    } catch (e: unknown) {
      toast.error(friendlyError(e, "No se pudo eliminar al colaborador"))
    } finally {
      setDeletingDni(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Personal</h1>

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
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={loadData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          {canEdit ? (
            <>
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
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Vista de solo lectura</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, DNI, profesión o rol..."
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
              <TableHead>DNI</TableHead>
              <TableHead>Profesión</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button variant="outline" size="sm" onClick={loadData}>
                      <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <p className="text-sm font-medium text-foreground">
                      No hay colaboradores {activeTab === "active" ? "activos" : "inactivos"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm
                        ? "Prueba con otro término de búsqueda."
                        : canEdit
                          ? "Registra un nuevo colaborador para empezar."
                          : "Aún no hay registros para mostrar."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((person, index) => (
                <TableRow key={person.DNI} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(person.DNI)}
                      onCheckedChange={() => handleSelectRow(person.DNI)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-sm font-semibold`}
                      >
                        {getInitials(person.Nombre, person.Apellido)}
                      </div>
                      <button
                        onClick={() => onEdit(person.DNI)}
                        className="font-medium text-blue-600 hover:underline text-left"
                      >
                        {person.Nombre} {person.Apellido}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{person.DNI}</TableCell>
                  <TableCell className="text-sm">{person.profesion || "—"}</TableCell>
                  <TableCell className="text-sm">{person.rol || "—"}</TableCell>
                  <TableCell>{estadoBadge(person.estado)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(person.DNI)}>
                          {canEdit ? "Editar" : "Ver"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(person.DNI)}>Ver detalles</DropdownMenuItem>
                        {canEdit ? (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              disabled={deletingDni === person.DNI}
                              onClick={() => handleDelete(person)}
                            >
                              {deletingDni === person.DNI ? "Eliminando..." : "Eliminar"}
                            </DropdownMenuItem>
                          </>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
