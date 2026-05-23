import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { createSession } from "@/security/session/hooks/stores/useSession.store";
import { LogIn } from "../api/session.api";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { User } from "@/security/session/interfaces/user";
import { isAxiosError } from "axios";

export function useLoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await LogIn(data.email, data.password);
      const { user } = response;
      createSession(response);
      handleNavigation(user);
    } catch (error) {
      if (isAxiosError<{ error: string }>(error)) {
        const message = error.response?.data.error;
        form.setError("root", {
          message,
        });
      } else {
        form.setError("root", {
          message: "Ocurrió un error. Comuníquese con sistemas (500).",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = useCallback((user: User) => {
    switch (user.rol) {
      case RolesRecord.client:
        navigate("/intranet/solicitudes");
        break;
      case RolesRecord.manager:
        navigate("/intranet/dashboard");
        break;
      case RolesRecord.projectAdmin:
        navigate("/intranet/dashboard");
        break;
      case RolesRecord.fieldSupervisor:
      case RolesRecord.fieldWorker:
      case RolesRecord.lawyer:
      case RolesRecord.workshopWorker:
        navigate("/intranet/proyectos");
        break;
      default:
        navigate("/intranet/proyectos");
    }
  }, []);

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
