import { UserProvider } from "./providers/user.provider.tsx";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";

// Ensure any stuck overlays are removed on page load and continuously monitored
if (typeof window !== "undefined") {
  // Remove any overlays that might be stuck - SPECIFIC TO OVERLAYS ONLY
  const removeStuckOverlays = () => {
    // Only target specific overlay elements, NOT buttons or button wrappers
    const overlays = document.querySelectorAll(
      '[data-slot="dialog-overlay"], [data-slot="sheet-overlay"]'
    );
    overlays.forEach((overlay) => {
      // Skip if it's a button or contains buttons
      if (overlay.tagName === "BUTTON" || overlay.querySelector("button") || overlay.querySelector("[role='button']")) {
        return;
      }
      
      const state = overlay.getAttribute("data-state");
      const isOpen = overlay.getAttribute("aria-hidden") === "false" || state === "open";
      
      if (!isOpen) {
        // Force remove and disable pointer events
        (overlay as HTMLElement).style.display = "none";
        (overlay as HTMLElement).style.pointerEvents = "none";
        (overlay as HTMLElement).style.opacity = "0";
        (overlay as HTMLElement).style.visibility = "hidden";
        overlay.remove();
      }
    });
    
    // Remove fixed/absolute elements that might be overlays - EXCLUDE BUTTONS
    const allElements = document.querySelectorAll("body > div");
    allElements.forEach((el) => {
      // Skip if it's a button wrapper or contains buttons
      if (
        el.tagName === "BUTTON" || 
        el.querySelector("button") || 
        el.querySelector("[role='button']") ||
        el.classList.toString().includes("button") ||
        el.getAttribute("data-slot") === "button"
      ) {
        return;
      }
      
      const state = el.getAttribute("data-state");
      const isOpen = el.getAttribute("aria-hidden") === "false" || state === "open";
      
      if (!isOpen) {
        const style = window.getComputedStyle(el);
        const hasFixedOrAbsolute = style.position === "fixed" || style.position === "absolute";
        const zIndex = parseInt(style.zIndex) || 0;
        const isHighZIndex = zIndex > 30;
        const hasDarkBg = 
          style.backgroundColor.includes("rgba(0") ||
          style.backgroundColor.includes("rgb(0, 0, 0");
        const isOverlayClass = 
          el.classList.toString().includes("overlay") ||
          el.classList.toString().includes("backdrop");
        
        // Only remove if it's clearly an overlay (has overlay/backdrop class OR dark bg with high z-index)
        if (hasFixedOrAbsolute && ((isOverlayClass && hasDarkBg) || (hasDarkBg && isHighZIndex))) {
          (el as HTMLElement).style.display = "none";
          (el as HTMLElement).style.pointerEvents = "none";
          (el as HTMLElement).style.opacity = "0";
          el.remove();
        }
      }
    });
    
    // Ensure all buttons are visible and clickable
    const buttons = document.querySelectorAll("button, [role='button'], [data-slot='button']");
    buttons.forEach((btn) => {
      (btn as HTMLElement).style.display = "";
      (btn as HTMLElement).style.visibility = "";
      (btn as HTMLElement).style.opacity = "";
      (btn as HTMLElement).style.pointerEvents = "";
      (btn as HTMLElement).style.zIndex = "";
    });
  };

  // Run on load
  window.addEventListener("load", removeStuckOverlays);
  // Run immediately
  removeStuckOverlays();
  // Run after delays to catch any late-rendering overlays
  setTimeout(removeStuckOverlays, 100);
  setTimeout(removeStuckOverlays, 500);
  setTimeout(removeStuckOverlays, 1000);
  
  // Use MutationObserver to watch for new overlay elements
  const observer = new MutationObserver(() => {
    removeStuckOverlays();
  });
  
  // Start observing when DOM is ready
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state", "class", "style"],
    });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-state", "class", "style"],
      });
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
