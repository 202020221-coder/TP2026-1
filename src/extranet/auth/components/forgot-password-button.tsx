import { Button } from "@/shared/components/ui/button";
import { RecoverPasswordDialog } from "./recover-password-dialog";
import { useRecoverPasswordContext } from "../context/recover-password-context";


export default function ForgotPasswordButton() {
  const { openDialog } = useRecoverPasswordContext();
  return (
    <>
      <Button onClick={() => openDialog()} variant={"link"} className="block ml-auto">
        ¿Has olvidado tu contraseña?
      </Button>
      <RecoverPasswordDialog/>
    </>
  );
}
