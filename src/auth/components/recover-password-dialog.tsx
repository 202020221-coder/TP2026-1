import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useRecoverPasswordContext } from "../context/recover-password-context";
import { RecoverPasswordEmailForm } from "./recover-password-email-form";
import { RecoverPasswordCodeForm } from "./recover-password-code-form";
import { CodeExpiredMessage } from "./code-expired-message";
import { useMemo } from "react";
import { RecoverPasswordForm } from "./recover-password-form";
import { PasswordChangedSuccessfullyMesage } from "./password-changed-succesfully-message";

export function RecoverPasswordDialog() {
  const {
    isDialogOpen,
    closeDialog,
    openDialog,
    dialogDescription,
    dialogTitle,
    currentRecoverPhase,
  } = useRecoverPasswordContext();
  const defaultExitAllowed = useMemo(() => {
    return (
      currentRecoverPhase !== "Type Code" &&
      currentRecoverPhase !== "Code Expired" &&
      currentRecoverPhase !== "Password Changed"
    );
  }, [currentRecoverPhase]);
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => (open ? openDialog() : closeDialog())}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        showCloseButton={defaultExitAllowed}
        onInteractOutside={(e) => !defaultExitAllowed && e.preventDefault()}
        onEscapeKeyDown={(e) => !defaultExitAllowed && e.preventDefault()}
      >
        <DialogHeader>
          {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
          {dialogDescription && (
            <DialogDescription>{dialogDescription}</DialogDescription>
          )}
        </DialogHeader>
        {currentRecoverPhase === "Type Email" && <RecoverPasswordEmailForm />}
        {currentRecoverPhase === "Type Code" && <RecoverPasswordCodeForm />}
        {currentRecoverPhase === "Code Expired" && (
          <CodeExpiredMessage onAccept={() => closeDialog()} />
        )}
        {currentRecoverPhase === "Type New Password" && <RecoverPasswordForm />}
        {currentRecoverPhase === "Password Changed" && (
          <PasswordChangedSuccessfullyMesage onAccept={() => closeDialog()} />
        )}
      </DialogContent>
    </Dialog>
  );
}
