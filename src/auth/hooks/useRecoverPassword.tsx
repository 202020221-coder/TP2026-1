import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  NewPasswordFormValues,
  RecoverPasswordCodeFormValues,
  RecoverPasswordEmailFormValues,
} from "../schemas/recover-password.schema";
import {
  newPasswordFormSchema,
  recoverPasswordCodeFormSchema,
  recoverPasswordEmailFormSchema,
} from "../schemas/recover-password.schema";
import type { IRecoverPasswordContext } from "../context/recover-password-context";

export type RecoverPhase =
  | "Type Email"
  | "Type Code"
  | "Type New Password"
  | "Code Expired"
  | "Password Changed";

export function useRecoverPassword(): IRecoverPasswordContext {
  /**==================HOOKS DEL DIALOG====================*/
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRecoverPhase, setCurrentRecoverPhase] =
    useState<RecoverPhase>("Type Email");

  /*=================HOOKS DE FORMULARIOS==================*/
  const emailForm = useForm<RecoverPasswordEmailFormValues>({
    resolver: zodResolver(recoverPasswordEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const codeForm = useForm<RecoverPasswordCodeFormValues>({
    resolver: zodResolver(recoverPasswordCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const passwordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  /*========================EVENT HANDLERS==================== */
  const onSubmitEmail = useCallback(
    async (values: RecoverPasswordEmailFormValues) => {
      setIsLoading(true);
      try {
        // TODO: Replace with your actual API call
        console.log("Sending recovery code to:", values.email);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Success handling
        console.log("Code sent successfully!");
        setCurrentRecoverPhase("Type Code");
      } catch (error) {
        console.error("Failed to send recovery code:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setCurrentRecoverPhase],
  );

  const onSubmitCode = useCallback(
    async (values: RecoverPasswordCodeFormValues) => {
      setIsLoading(true);
      try {
        // TODO: Replace with your actual API call
        console.log("Validating code:", values.code);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Success handling
        console.log("Code is valid!");
        setCurrentRecoverPhase("Type New Password");
      } catch (error) {
        console.error("Failed to validate code:", error);

        // You can add error toast notification here
        // toast.error("Failed to validate code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const onCodeExpired = useCallback(() => {
    setCurrentRecoverPhase("Code Expired");
  }, [setCurrentRecoverPhase]);

  const onSubmitNewPassword = useCallback(
    async (values: NewPasswordFormValues) => {
      setIsLoading(true);
      try {
        // TODO: Replace with your actual API call
        console.log("Recreating assword:", values.password);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Success handling
        console.log("Password Changed!");
        setCurrentRecoverPhase("Password Changed");
      } catch (error) {
        console.error("Failed to create new password:", error);

        // You can add error toast notification here
        // toast.error("Failed to create new password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  /*==========================ACCIONES A REALIZAR======================== */
  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
    //reset variables
    setCurrentRecoverPhase("Type Email");
    setIsLoading(false);
    //reset forms
    emailForm.reset();
    codeForm.reset();
  }, [
    setCurrentRecoverPhase,
    setIsLoading,
    setIsDialogOpen,
    emailForm,
    codeForm,
  ]);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  /*========================VALORES CALCULADOS========================== */
  const dialogDescription = useMemo(() => {
    switch (currentRecoverPhase) {
      case "Type Email":
        return "Ingresa el correo vinculado a tu cuenta. Te enviaremos un código para reiniciar tu contraseña.";
      case "Type Code":
        return (
          <span>
            Se mandó un código al correo electrónico:{" "}
            <span className="font-black">{emailForm.getValues("email")}</span>
            <br />
            Ingrésalo en el campo de abajo para crear tu nueva contraseña.
          </span>
        );
      case "Type New Password":
        return "Ingresa y confirma tu nueva contraseña.";
      case "Code Expired":
        return null;
      case "Password Changed":
        return null;
      default:
        throw new Error("Error: unregistered recover phase");
    }
  }, [currentRecoverPhase, emailForm]);

  const dialogTitle = useMemo(() => {
    if (
      currentRecoverPhase === "Code Expired" ||
      currentRecoverPhase === "Password Changed"
    ) {
      return null;
    } else {
      return "Cambiar Contraseña";
    }
  }, [currentRecoverPhase]);
  return {
    currentRecoverPhase,
    emailForm,
    codeForm,
    passwordForm,
    isSubmitting: isLoading,
    isDialogOpen,
    dialogDescription,
    dialogTitle,
    onSubmitEmail,
    onSubmitCode,
    onSubmitNewPassword,
    onCodeExpired,
    openDialog,
    closeDialog,
  };
}
