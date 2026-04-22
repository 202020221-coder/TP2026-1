import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecoverPasswordEmailForm } from "./recover-password-email-form";
import { RecoverPasswordProvider } from "../context/recover-password-context";
import { Toaster } from "sonner";
import { sendRecoveryEmail } from "../api/recover.api";

/**
 * We tell vitest to catch any import of ../api/recover.api
 * and replace its exports with want we desire (in this case,
 * a spy function).
 *
 * vitest needs to catch imports before testing execution,
 * that's why we mock at the file scope.
 * */
vi.mock("../api/recover.api", () => ({
  sendRecoveryEmail: vi.fn(),
}));

describe("Recover Password Email Form", () => {
  it("Renders email textbox", () => {
    renderForm();
    const { emailInput } = getFormElements();
    expect(emailInput).toBeInTheDocument();
  });

  it("Renders submit button", () => {
    renderForm();
    const { submitButton } = getFormElements();
    expect(submitButton).toBeInTheDocument();
  });

  it("Shows error when email is invalid", async () => {
    const user = userEvent.setup();
    renderForm();
    const { emailInput, submitButton } = getFormElements();
    await user.type(emailInput, "invalid email");
    await user.click(submitButton);
    /**
     * Wait for the message to appear in <FormMessage/>.
     * Ideal when appearance might take some time
     * */
    const message = await screen.findByText(
      "Por favor ingrese un correo electrónico válido.",
    );
    expect(message).toBeInTheDocument();
  });

  it("Disables button and shows 'Enviando...' while submitting", async () => {
    const user = userEvent.setup();
    mockApiLoading();
    renderForm();
    const { emailInput, submitButton } = getFormElements();
    await user.type(emailInput, "test@email.com");
    await user.click(submitButton);
    // esperar estado loading
    const loadingButton = await screen.findByRole("button", {
      name: /Enviando.../i,
    });
    expect(loadingButton).toBeDisabled();
  });

  it("Shows error toast when submission fails", async () => {
    const user = userEvent.setup();
    mockApiFailure();
    renderForm({ withToaster: true });
    const { emailInput, submitButton } = getFormElements();
    await user.type(emailInput, "fail@test.com");
    await user.click(submitButton);
    expect(
      await screen.findByText(/No se pudo enviar el código/i),
    ).toBeInTheDocument();
  });
});

/**
 * Renders component according to ``options``.
 * @param options Object to decide what to render depending of test case.
 * @returns `void`
 */
function renderForm(options?: { withToaster: boolean }) {
  return render(
    <RecoverPasswordProvider>
      <RecoverPasswordEmailForm />
      {options?.withToaster && <Toaster />}
    </RecoverPasswordProvider>,
  );
}

/**
 * Gets elements from the ``RecoverPasswordEmailForm.tsx``
 * @returns ``void``
 */
function getFormElements() {
  const emailInput = screen.getByRole("textbox", {
    name: /correo/i,
  });

  const submitButton = screen.getByRole("button", {
    name: /Enviar código de verificación/i,
  });

  return {
    emailInput,
    submitButton,
  };
}

/**
 * Force failure through error throwing.
 * */
function mockApiFailure() {
  const mocked = vi.mocked(sendRecoveryEmail);
  mocked.mockRejectedValue(new Error("Network error"));
}

/**
 * Force eternal loading state through unresolved promise.
 */
function mockApiLoading() {
  const mocked = vi.mocked(sendRecoveryEmail);
  mocked.mockImplementation(() => new Promise(() => {}));
}
