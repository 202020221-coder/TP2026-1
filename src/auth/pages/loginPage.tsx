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

export function LoginPage() {
  return (
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
  );
}
