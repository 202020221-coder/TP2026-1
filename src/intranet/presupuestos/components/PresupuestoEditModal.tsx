import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { MaterialDirectoTab } from "./tabs/MaterialDirectoTab";
import { ManoObraTab } from "./tabs/ManoObraTab";
import { ServicioTab } from "./tabs/ServicioTab";
import { GastoAdminTab } from "./tabs/GastoAdminTab";
import { ChecklistPresupuestoDialog } from "./ChecklistPresupuestoDialog";
import type { Cotizacion } from "../interfaces/presupuesto";

type Tab = "material" | "mano-obra" | "servicio" | "gasto-admin";

const TABS: { id: Tab; label: string }[] = [
  { id: "material", label: "Material Directo" },
  { id: "mano-obra", label: "Mano de Obra" },
  { id: "servicio", label: "Servicio" },
  { id: "gasto-admin", label: "Gasto Administrativo" },
];

interface Props {
  cotizacion: Cotizacion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PresupuestoEditModal({ cotizacion, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("material");

  if (!cotizacion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Editar Presupuesto — {cotizacion.nombre}
          </DialogTitle>
          <div className="text-sm text-muted-foreground flex gap-4 mt-1">
            <span>Cliente: {cotizacion.nombreCliente}</span>
            <span>Precio Total: S/. {parseFloat(cotizacion.precioTotal).toFixed(2)}</span>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 pt-2 pb-1">
          <div className="flex gap-3 flex-wrap">
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
          <ChecklistPresupuestoDialog cotizacionId={cotizacion.ID} />
        </div>

        <div className="flex-1 overflow-y-auto pt-2">
          {activeTab === "material" && <MaterialDirectoTab cotizacionId={cotizacion.ID} />}
          {activeTab === "mano-obra" && <ManoObraTab cotizacionId={cotizacion.ID} />}
          {activeTab === "servicio" && <ServicioTab cotizacionId={cotizacion.ID} />}
          {activeTab === "gasto-admin" && <GastoAdminTab cotizacionId={cotizacion.ID} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
