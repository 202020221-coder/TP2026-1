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
import {
  Countdown_,
  CountdownDescription,
  CountdownDisplay,
} from "@/shared/components/ui/countdown";
export function RecoverPasswordCodeForm() {
  const { codeForm, onSubmitCode, isSubmitting, closeDialog, onCodeExpired } = useRecoverPasswordContext();
  return (
    <Form {...codeForm}>
      <form
        onSubmit={codeForm.handleSubmit(onSubmitCode)}
        className="space-y-4"
      >
        <FormField
          control={codeForm.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código Enviado</FormLabel>
              <FormControl>
                <Input
                  placeholder="XXX-XXX"
                  type="text"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Countdown_
          initialTime={5000}
          onFinish={onCodeExpired}
          className="flex-row gap-1 justify-center items-center"
        >
          <CountdownDescription>Código expira en:</CountdownDescription>
          <CountdownDisplay
            className="text-lg"
            warningClassName="text-amber-200"
            finishedClassName="text-red-500"
          />
        </Countdown_>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
        <Button type="button" className="w-full" disabled={isSubmitting} variant={"secondary"} onClick={()=>closeDialog()}>
          Cancelar operación
        </Button>
      </form>
    </Form>
  );
}
