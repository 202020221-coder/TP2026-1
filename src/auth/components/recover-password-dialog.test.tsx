import { RecoverPasswordDialog } from "./recover-password-dialog";
import userEvent from "@testing-library/user-event";
import { sendRecoveryEmail } from "../api/recover.api";
import {
  RecoverPasswordProvider,
  useRecoverPasswordContext,
} from "../context/recover-password-context";
import { render, screen } from "@testing-library/react";
import { useEffect } from "react";

vi.mock("../api/recover.api", () => ({
  sendRecoveryEmail: vi.fn(),
}));

it("Moves to code phase after successful email submission", async () => {
  const user = userEvent.setup();
  const mockedSendRecoveryEmail = vi.mocked(sendRecoveryEmail);
  mockedSendRecoveryEmail.mockResolvedValue();
  render(
    <RecoverPasswordProvider>
      <OpenDialogWrapper/>
    </RecoverPasswordProvider>,
  );

  const emailInput = screen.getByRole("textbox", {
    name: /correo/i,
  });

  const submitButton = screen.getByRole("button", {
    name: /Enviar código de verificación/i,
  });

  await user.type(emailInput, "test@email.com");

  await user.click(submitButton);

  const textbox = await screen.findByRole("textbox", {
    name: /Código Enviado/i,
  });
  // Aquí debería aparecer el siguiente form
  expect(textbox).toBeInTheDocument();
});

function OpenDialogWrapper() {
  const { openDialog } = useRecoverPasswordContext();

  useEffect(() => {
    openDialog();
  }, [openDialog]);

  return <RecoverPasswordDialog />;
}
