import { UserProvider } from "./providers/user.provider.tsx";
import { CurrencyProvider } from "./context/CurrencyContext.tsx";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";

// ... (skipping long overlay code)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </UserProvider>
  </StrictMode>
);
