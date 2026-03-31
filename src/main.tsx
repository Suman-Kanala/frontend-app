import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { store } from "@/store";
import App from "@/App";
import "@/index.css";

// Fix clerk-js v5.125.7 bug: error factory calls url.startsWith()
// on a Request/URL object instead of a string.
if (typeof Request !== "undefined" && !Request.prototype.startsWith) {
  Request.prototype.startsWith = function (...args) {
    return this.url.startsWith(...args);
  };
}
if (typeof URL !== "undefined" && !URL.prototype.startsWith) {
  URL.prototype.startsWith = function (...args) {
    return this.href.startsWith(...args);
  };
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ClerkProvider publishableKey={clerkPubKey}>
          <App />
        </ClerkProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
