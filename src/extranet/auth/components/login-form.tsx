import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useLoginForm } from "../hooks/useLoginForm";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/components/ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
export function LoginForm() {
  const { form, isLoading, onSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      size="icon-sm"
                      className="cursor-pointer bg-transparent hover:bg-transparent text-neutral-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeClosed /> : <Eye />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando..." : "Iniciar Sesión"}
        </Button>
      </form>
    </Form>
  );
}
