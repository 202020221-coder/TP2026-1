import { Button } from "@/shared/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { FC } from "react";

export const CodeExpiredMessage: FC<{ onAccept?: () => void }> = ({onAccept=()=>{}}) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            ¡Ups! Código expirado
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            El código de verificación ha expirado. Por favor, solicite uno nuevo
            e intente de nuevo.
          </p>
        </div>

        <Button
          className="mt-4"
          onClick={onAccept}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
};
