import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { DevMetricsProvider } from "./context/DevMetricsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DevMetricsProvider>
        <App />
      </DevMetricsProvider>
    </BrowserRouter>
  </StrictMode>,
);
