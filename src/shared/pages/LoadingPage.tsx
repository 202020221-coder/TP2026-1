import type { FC } from "react";

export const LoadingPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black space-y-6">
      {/* Spinner animado tipo radar */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-[#1fc750] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-[#1fc750] border-t-transparent rounded-full animate-spin-slow"></div>
      </div>

      {/* Texto animado */}
      <p className="text-2xl font-semibold">
        Cargando{" "}
        <span className="inline-block animate-bounce delay-[0ms]">.</span>{" "}
        <span className="inline-block animate-bounce delay-[200ms]">.</span>{" "}
        <span className="inline-block animate-bounce delay-[400ms]">.</span>
      </p>

      <p className="text-muted-foreground">
        Por favor espere mientras preparamos todo para usted
      </p>
    </div>
  );
};

// Animación personalizada lenta
const style = document.createElement("style");

style.textContent = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
`;

document.head.appendChild(style);

export default LoadingPage;
