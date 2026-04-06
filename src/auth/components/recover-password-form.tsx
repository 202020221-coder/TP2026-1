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
import { useRecoverPasswordContext } from "../context/recover-password-context";
export function RecoverPasswordForm() {
  const { passwordForm, onSubmitNewPassword, isSubmitting, closeDialog } =
    useRecoverPasswordContext();
  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(onSubmitNewPassword)}
        className="space-y-4"
      >
        <FormField
          control={passwordForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva Contraseña</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese su nueva contraseña"
                  type="password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                La contraseña debe tener:
                <br />
                - De 8 a 12 caracteres
                <br />
                - Al menos una mayúscula
                <br />- Al menos un carácter especial
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={passwordForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirme su contraseña</FormLabel>
              <FormControl>
                <Input
                  placeholder="Repita su contraseña"
                  type="password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Cambiar contraseña"}
        </Button>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          variant={"outline"}
          onClick={() => closeDialog()}
        >
          Cancelar Operación
        </Button>
      </form>
    </Form>
  );
}
