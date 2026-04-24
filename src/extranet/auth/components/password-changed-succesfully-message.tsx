import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, LogIn } from "lucide-react";
import type { FC } from "react";

export const PasswordChangedSuccessfullyMesage: FC<{
  onAccept?: () => void;
}> = ({ onAccept = () => {} }) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-green-500/10 p-3">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            ¡Contraseña actualizada!
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar
            sesión con tu nueva contraseña.
          </p>
        </div>

        <Button className="mt-4" onClick={onAccept}>
          <LogIn className="mr-2 h-4 w-4" />
          Volver al inicio de sesión
        </Button>
      </div>
    </div>
  );
};
