import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ForgotPasswordButton from "./forgot-password-button";
import { RecoverPasswordProvider } from "../context/recover-password-context";
import userEvent from "@testing-library/user-event";

describe("Forgor Password Button", () => {
  it("Renders a button to recover password", async () => {
    renderButton();
    const button = screen.getByText("¿Has olvidado tu contraseña?");
    expect(button).toBeInTheDocument();
  });

  it("Opens dialog on click", async () => {
    renderButton();
    const button = screen.getByText("¿Has olvidado tu contraseña?");
    await userEvent.click(button);
    const dialog = screen.getByTestId("recover-password-dialog");
    expect(dialog).toBeVisible();
  });
});

/**
 * Renders ``ForgotPasswordButton.tsx``.
 */
function renderButton() {
  render(
    <RecoverPasswordProvider>
      <ForgotPasswordButton />
    </RecoverPasswordProvider>,
  );
}
