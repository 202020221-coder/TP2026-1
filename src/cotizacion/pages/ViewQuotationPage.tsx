import { ReferenceSection } from "../components/ReferenceSection";

import { ScrollArea } from "@/shared/components/ui/scroll-area";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import {
  FileText,
  DollarSign,
  ClipboardList,
  Eye,
} from "lucide-react";

import { useSearchParams } from "react-router";

export function ViewQuotationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    throw new Error("Id de la solicitud no especificada");
  }

  const baseTriggerClass =
    "flex items-center justify-center gap-2 rounded-md h-10 px-3 font-medium transition-colors";

  return (
    <div className="flex flex-col h-full px-6 py-4 bg-slate-50">
      <h1 className="mb-4 text-2xl font-semibold text-slate-800">
        Cotización #{orderId}
      </h1>

      <Tabs defaultValue="reference" className="w-full">

        <TabsList
          className="
            grid w-full grid-cols-4
            bg-white
            border
            rounded-lg
            shadow-sm
            overflow-hidden
            min-h-12
            gap-x-2
          "
        >

          {/* Reference — BLUE */}
          <TabsTrigger
            value="reference"
            className={`${baseTriggerClass}
              data-[state=active]:bg-blue-600
              data-[state=active]:text-white
              hover:bg-slate-100
            `}
          >
            <FileText className="w-4 h-4" />
            Datos de Referencia
          </TabsTrigger>

          {/* Prices — GREEN */}
          <TabsTrigger
            value="prices"
            className={`${baseTriggerClass}
              data-[state=active]:bg-emerald-600
              data-[state=active]:text-white
              hover:bg-slate-100
            `}
          >
            <DollarSign className="w-4 h-4" />
            Precios
          </TabsTrigger>

          {/* Conditions — ORANGE */}
          <TabsTrigger
            value="conditions"
            className={`${baseTriggerClass}
              data-[state=active]:bg-amber-500
              data-[state=active]:text-white
              hover:bg-slate-100
            `}
          >
            <ClipboardList className="w-4 h-4" />
            Condiciones
          </TabsTrigger>

          {/* Visualize — PURPLE */}
          <TabsTrigger
            value="visualize"
            className={`${baseTriggerClass}
              data-[state=active]:bg-violet-600
              data-[state=active]:text-white
              hover:bg-slate-100
            `}
          >
            <Eye className="w-4 h-4" />
            Visualización
          </TabsTrigger>

        </TabsList>

        <ScrollArea className="h-[calc(100vh-180px)] mt-2">

          <TabsContent value="reference">
            <ReferenceSection orderId={Number(orderId)} />
          </TabsContent>

          <TabsContent value="prices">
          </TabsContent>

          <TabsContent value="conditions">
          </TabsContent>

          <TabsContent value="visualize">
          </TabsContent>

        </ScrollArea>

      </Tabs>

    </div>
  );
}

export default ViewQuotationPage;