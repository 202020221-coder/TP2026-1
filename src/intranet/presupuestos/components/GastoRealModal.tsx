import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Cotizacion } from "../interfaces/presupuesto";
import { GastoRealMaterialTab } from "./tabs/gasto-real/GastoRealMaterialTab";
import { GastoRealManoObraTab } from "./tabs/gasto-real/GastoRealManoObraTab";
import { GastoRealServicioTab } from "./tabs/gasto-real/GastoRealServicioTab";
import { GastoRealGastoAdminTab } from "./tabs/gasto-real/GastoRealGastoAdminTab";

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

export function GastoRealModal({ cotizacion, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("material");

  if (!cotizacion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">
            Comparación con Gasto Real — {cotizacion.nombre}
          </DialogTitle>
          <div className="flex gap-6 text-sm text-muted-foreground mt-1">
            <span>Cliente: <span className="font-medium text-foreground">{cotizacion.nombreCliente}</span></span>
            <span>Presupuesto Total: <span className="font-medium text-foreground">S/. {parseFloat(cotizacion.precioTotal).toFixed(2)}</span></span>
          </div>
        </DialogHeader>

        <div className="flex gap-2 flex-wrap pt-2 pb-1 flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto pt-2 min-h-0">
          {activeTab === "material" && <GastoRealMaterialTab cotizacionId={cotizacion.ID} />}
          {activeTab === "mano-obra" && <GastoRealManoObraTab cotizacionId={cotizacion.ID} />}
          {activeTab === "servicio" && <GastoRealServicioTab cotizacionId={cotizacion.ID} />}
          {activeTab === "gasto-admin" && <GastoRealGastoAdminTab cotizacionId={cotizacion.ID} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
