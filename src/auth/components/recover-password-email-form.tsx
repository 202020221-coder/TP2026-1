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
export function RecoverPasswordEmailForm() {
  const { emailForm, onSubmitEmail, isSubmitting } =
    useRecoverPasswordContext();
  return (
    <Form {...emailForm}>
      <form
        noValidate
        onSubmit={emailForm.handleSubmit(onSubmitEmail)}
        className="space-y-4"
      >
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar código de verificación"}
        </Button>
      </form>
    </Form>
  );
}
