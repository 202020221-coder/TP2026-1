import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/schema";

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
      // Simulate API call with 3-second delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Here you would normally make an actual API call to authenticate
      console.log("Login attempt with:", data);

      // On successful login, redirect to /directorio/dashboard (or similar)
      navigate("/directorio");
    } catch (error) {
      console.error("Login error:", error);
      form.setError("root", {
        message: "Ocurrió un error. Inténtelo nuevamente.",
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
