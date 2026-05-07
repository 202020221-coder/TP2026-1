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
    const FIRSTTIME = true;
    switch (user.rol) {
      case RolesRecord.client:
        FIRSTTIME
          ? navigate("/intranet/solicitudes/crear")
          : navigate("/intranet/solicitudes");
        break;
      case RolesRecord.manager:
        navigate("/intranet/solicitudes");
        break;
      case RolesRecord.projectAdmin:
        navigate("/intranet/solicitudes");
        break;
      case RolesRecord.fieldSupervisor:
        navigate("/intranet/solicitudes");
        break;
      case RolesRecord.fieldWorker:
        navigate("/intranet/solicitudes");
        break;
      case RolesRecord.lawyer:
        navigate("/intranet/solicitudes");
        break;
      case RolesRecord.workshopWorker:
        navigate("/intranet/solicitudes");
        break;
      default:
        throw new Error("Unknown user role unhandled");
    }
  }, []);

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
