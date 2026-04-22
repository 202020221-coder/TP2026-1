import { describe, it, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ForgotPasswordButton from "./forgot-password-button";
import { RecoverPasswordProvider } from "../context/recover-password-context";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  cleanup();
});

describe("Forgor Password Button", () => {
  it("Renders a button to recover password", async () => {
    render(
      <RecoverPasswordProvider>
        <ForgotPasswordButton />
      </RecoverPasswordProvider>,
    );
    const button = screen.getByText("¿Has olvidado tu contraseña?");
    expect(button).toBeInTheDocument();
  });

  it("Opens dialog on click", async () => {
    render(
      <RecoverPasswordProvider>
        <ForgotPasswordButton />
      </RecoverPasswordProvider>,
    );

    const button = screen.getByText("¿Has olvidado tu contraseña?");
    await userEvent.click(button);
    const dialog = screen.getByTestId("recover-password-dialog")
    expect(dialog).toBeVisible();
  });
});
