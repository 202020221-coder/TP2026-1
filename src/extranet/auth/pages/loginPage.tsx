import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoginForm } from "../components/login-form";
import ForgotPasswordButton from "../components/forgot-password-button";
import { RecoverPasswordProvider } from "../context/recover-password-context";
import { Link } from "react-router";
import { CircleArrowLeft } from "lucide-react";

export function LoginPage() {
  return (
    <>
      <Link to={"/"} className="text-muted-foreground/70 flex text-sm items-end gap-x-1 hover:underline relative left-4 top-4 w-fit">
        <CircleArrowLeft strokeWidth={1.5} />
        Volver a la sección principal
      </Link>
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingrese sus credenciales para acceder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <RecoverPasswordProvider>
                <ForgotPasswordButton />
              </RecoverPasswordProvider>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
