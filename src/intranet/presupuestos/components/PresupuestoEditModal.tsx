import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { usePresupuestosList } from "../hooks/usePresupuestos";
import { MaterialDirectoTab } from "./tabs/MaterialDirectoTab";
import { ManoObraTab } from "./tabs/ManoObraTab";
import { ServicioTab } from "./tabs/ServicioTab";
import { GastoAdminTab } from "./tabs/GastoAdminTab";
import type { Presupuesto } from "../interfaces/presupuesto";

type Tab = "material" | "mano-obra" | "servicio" | "gasto-admin";

const TABS: { id: Tab; label: string }[] = [
  { id: "material", label: "Material Directo" },
  { id: "mano-obra", label: "Mano de Obra" },
  { id: "servicio", label: "Servicio" },
  { id: "gasto-admin", label: "Gasto Administrativo" },
];

interface Props {
  presupuesto: Presupuesto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PresupuestoEditModal({ presupuesto, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("material");

  if (!presupuesto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Editar Presupuesto — {presupuesto.Cotizacion_Nombre}
          </DialogTitle>
          <div className="text-sm text-muted-foreground flex gap-4 mt-1">
            <span>Costos Indirectos: S/. {parseFloat(presupuesto.costos_indirectos).toFixed(2)}</span>
            <span>Costo Total Est.: S/. {parseFloat(presupuesto.coste_total_estimado).toFixed(2)}</span>
          </div>
        </DialogHeader>

        {/* Tab buttons — estilo prototipo */}
        <div className="flex gap-3 flex-wrap pt-2 pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto pt-2">
          {activeTab === "material" && (
            <MaterialDirectoTab presupuestoId={presupuesto.ID} />
          )}
          {activeTab === "mano-obra" && (
            <ManoObraTab presupuestoId={presupuesto.ID} />
          )}
          {activeTab === "servicio" && (
            <ServicioTab presupuestoId={presupuesto.ID} />
          )}
          {activeTab === "gasto-admin" && (
            <GastoAdminTab presupuestoId={presupuesto.ID} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
