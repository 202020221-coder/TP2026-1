import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { createSession } from "@/security/session/hooks/stores/useSession.store";
import { LogIn } from "../api/session.api";
import { RolesRecord } from "@/security/session/enum/roles.enum";

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

      if ("error" in response) {
        form.setError("root", {
          message: response.error.error,
        });
        return;
      }
      createSession(response);
      const { user } = response;
      const FIRSTTIME = true;
      if (user.rol === RolesRecord.client && FIRSTTIME) {
        navigate("/intranet/solicitudes/crear");
      } else {
        navigate("/intranet/solicitudes");
      }
    } catch (error) {
      form.setError("root", {
        message: "Ocurrió un error. Comuníquese con sistemas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
