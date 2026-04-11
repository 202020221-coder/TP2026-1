import {
  createContext,
  useContext,
  type JSX,
  type PropsWithChildren,
} from "react";
import type { UseFormReturn } from "react-hook-form";
import type {
  NewPasswordFormValues,
  RecoverPasswordCodeFormValues,
  RecoverPasswordEmailFormValues,
} from "../schemas/recover-password.schema";
import {
  useRecoverPassword,
  type RecoverPhase,
} from "../hooks/useRecoverPassword";

export interface IRecoverPasswordContext {
  currentRecoverPhase: RecoverPhase;
  emailForm: UseFormReturn<RecoverPasswordEmailFormValues>;
  codeForm: UseFormReturn<RecoverPasswordCodeFormValues>;
  passwordForm: UseFormReturn<NewPasswordFormValues>;
  isSubmitting: boolean;
  isDialogOpen: boolean;
  dialogDescription: JSX.Element | string | null;
  dialogTitle: string | null;
  openDialog: () => void;
  closeDialog: () => void;
  onSubmitEmail: (formData: RecoverPasswordEmailFormValues) => void;
  onSubmitCode: (formData: RecoverPasswordCodeFormValues) => void;
  onSubmitNewPassword: (formData: NewPasswordFormValues) => void;
  onCodeExpired: () => void;
}

const RecoverPasswordContext = createContext<IRecoverPasswordContext | null>(
  null,
);

export const useRecoverPasswordContext = () => {
  const ctx = useContext(RecoverPasswordContext);
  if (!ctx) {
    throw new Error("Error: Can't use context outside provider");
  }
  return ctx;
};

export function RecoverPasswordProvider({ children }: PropsWithChildren) {
  const contextValue = useRecoverPassword();
  return (
    <RecoverPasswordContext value={contextValue}>
      {children}
    </RecoverPasswordContext>
  );
}
