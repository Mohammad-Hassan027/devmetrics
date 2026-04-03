import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { DevMetricsProvider } from "./context/DevMetricsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DevMetricsProvider>
      <App />
    </DevMetricsProvider>
  </StrictMode>,
);
