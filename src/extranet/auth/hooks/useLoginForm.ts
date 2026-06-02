import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { createSession } from "@/security/session/hooks/stores/useSession.store";
import { LogIn } from "../api/session.api";
import { isAxiosError } from "axios";
import type { LogInResponse } from "../interfaces/responses.dto";
import { getDefaultRouteByRole } from "../utils/navigation";

export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
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
      createSession(response);
      handleNavigation(response);
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

  const handleNavigation = useCallback(({ user, nuevo }: LogInResponse) => {
    const intended = location.state as { from?: string } | null;
    if (intended?.from) {
      navigate(intended.from, { replace: true });
      return;
    }
    navigate(getDefaultRouteByRole(user.rol, nuevo), { replace: true });
  }, [location.state]);

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
