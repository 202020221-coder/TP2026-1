import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/register.schema";
import { createSession } from "@/security/session/hooks/stores/useSession.store";
import { toast } from "sonner";

export function useRegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call for registration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Registration attempt with:", data);

      // Create session as a client
      createSession(data.email);

      toast.success("Cuenta creada exitosamente. Redirigiendo...");

      // Redirect to create-request
      navigate("/intranet/solicitudes/create-request");
    } catch (error) {
      console.error("Registration error:", error);
      form.setError("root", {
        message: "Ocurrió un error en el registro. Inténtelo nuevamente.",
      });
      toast.error("Ocurrió un error en el registro.");
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
