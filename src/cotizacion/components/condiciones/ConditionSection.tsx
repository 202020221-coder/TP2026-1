import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Clock4 } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useCallback, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { useOrderConditions } from "@/cotizacion/hooks/stores/orderConditions.store";
import { format, addDays } from "date-fns";
export const ConditionSection = () => {
  const update = useOrderConditions((s) => s.update);
  const conditions = useOrderConditions((s) => s.conditions);
  const emissionDate = useOrderConditions((s) => s.emissionDate);
  const expirationDate = useOrderConditions((s) => s.expirationDate);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleAppend = useCallback((appendText: string) => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      const currentText = textarea.value;
      const newText =
        currentText +
        (currentText.trim().length === 0 ? "" : "\n") +
        appendText;

      // ✅ Usar el setter nativo para actualizar correctamente el valor
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(textarea, newText);

      // ✅ Disparar el evento correcto que React escucha
      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    }
  }, []);

  return (
    <>
      <section className="h-full flex flex-col justify-between">
        <Card className={`shadow-none h-full flex`}>
          <CardHeader>
            <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
              <Clock4 />
              <span className="pb-0.5 font-[375]">Condiciones Adicionales</span>
            </CardTitle>
            <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
              Configure los términos y condiciones para la cotizaición
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-5 flex-1 overflow-y-auto">
            {/*SELECT FECHA EMISION*/}
            <div className="row-span-1">
              <p className="font-medium text-[14px] mb-0.5">
                Fecha de Emisión de la cotización
              </p>
              <Input
                type="date"
                value={emissionDate}
                onChange={(e) => {
                  update("emissionDate", e.target.value);
                }}
                disabled
              />
            </div>
            {/*SELECT VIGENCIA*/}
            <div className="row-span-1">
              <p className="font-medium text-[14px] mb-0.5">
                Vigencia de la Cotización
              </p>
              <Input
                type="date"
                value={expirationDate}
                min={format(addDays(new Date(emissionDate), 2), "yyyy-MM-dd")}
                onChange={(e) => {
                  update("expirationDate", e.target.value);
                }}
              />
            </div>

            {/*SELECT TEXTAREA*/}
            <div className="row-span-2 sm:col-span-2 h-[20vh] flex flex-col">
              <p className="font-medium text-[14px] mb-0.5">
                {"Observaciones y condiciones"}
              </p>
              <Textarea
                value={conditions}
                onChange={(e) => {
                  update("conditions", e.target.value);
                }}
                ref={textAreaRef}
                className="flex-1 overflow-y-auto text-[18px] shadow-none"
              />
            </div>
            {/*BOTONES */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 h-[40vh] sm:h-auto sm:flex-wrap">
              <Button
                className="flex-1 text-xl sm:text-[16px] rounded-2xl sm:rounded-sm bg-white text-gray-600 font-[450] border border-gray-200 hover:bg-black hover:text-white active:scale-95 active:bg-gray-200 transition-all duration-100"
                onClick={() =>
                  handleAppend("Forma de pago: 100% contra entrega.")
                }
              >
                + Forma de Pago
              </Button>
              <Button
                className="flex-1 text-xl sm:text-[16px] rounded-2xl sm:rounded-sm bg-white text-gray-600 font-[450] border border-gray-200 hover:bg-black hover:text-white active:scale-95 active:bg-gray-200 transition-all duration-100"
                onClick={() =>
                  handleAppend("Lugar de entrega: Instalaciones del cliente.")
                }
              >
                + Lugar Entrega
              </Button>
              <Button
                className="flex-1 text-xl sm:text-[16px] rounded-2xl sm:rounded-sm bg-white text-gray-600 font-[450] border border-gray-200 hover:bg-black hover:text-white active:scale-95 active:bg-gray-200 transition-all duration-100"
                onClick={() =>
                  handleAppend("Garantía: Respaldamos nuestros resultados.")
                }
              >
                + Garantía
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};
