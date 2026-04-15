import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import {
  CircleCheckBig,
  CircleX,
  Info,
  Loader,
  TriangleAlert,
} from "lucide-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      icons={{
        success: <CircleCheckBig />,
        info: <Info />,
        warning: <TriangleAlert />,
        error: <CircleX />,
        loading: <Loader className="animate-spin" />,
      }}
      position="top-center"
      richColors
      
    />
  </StrictMode>,
);
