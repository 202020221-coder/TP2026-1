import React from "react";
import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="text-2xl font-bold text-gray-900">
            Acceso Denegado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Usted no tiene los permisos necesarios para entrar a esta página.{" "}
            <span className="font-black block">Lo estamos vigilando.</span>
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Regresar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
