import { Button } from "@/shared/components/ui/button";
import PdfPreview from "./PdfPreview";
import { useState } from "react";
import { useNavigate } from "react-router";
import sleep from "@/shared/lib/sleep";
import { toast } from "sonner";
import { Send } from "lucide-react";

export const CreateQuotationVisualizeSection = async () => {
  const [isSending, setIsSending] = useState(false);
  const Navigate = useNavigate();
  const handleSend = async () => {
    try {
      setIsSending(true);

      toast.promise(
        async () => {
          await sleep(3000);
          Navigate("/intranet/solicitudes");
        }, // tu promesa real aquí
        {
          loading: "Loading...",
          success: "Cotización enviada con éxito.",
          error: "Error",
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        className="w-full mb-2 h-14"
        disabled={isSending}
        onClick={handleSend}
      >
        <Send className="mr-2 h-4 w-4" />
        {isSending ? "Enviando..." : "Crear Cotización y enviar al cliente"}
      </Button>
      <PdfPreview key={Date.now()} />
    </>
  );
};
