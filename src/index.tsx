import "./index.scss";

import { createRoot } from "react-dom/client";
import WebFont from "webfontloader";

import Root from "./Root";
import * as serviceWorker from "./serviceWorker";
import colorThemeStyles from "./styles/colorTheme.module.scss";
import { initializeEmojiMart } from "./utils";
import { registerCustomYupValidators } from "./utils/customYupValidators";
import { maybeRegisterAutoSelectionBarrier } from "./utils/selectionBarrier";

// This is to cover the case where the Electron app has cached the HTML and some
// of the JS, but it can't actually boot Spot because the user is offline
window.addEventListener("DOMContentLoaded", () => {
  if (!navigator.onLine) {
    (window as any).electron?.send("initial-load-offline");
  }
});

WebFont.load({
  google: {
    families: ["Inter:100,300,400,500,700,900", "Comfortaa:500"],
  },
});

let theme: string | undefined | null;

// Add custom theme if not default
try {
  const userPrefs = localStorage.getItem("userPrefs-v2");
  if (userPrefs) {
    theme = JSON.parse(userPrefs).theme;
    if (theme && theme !== colorThemeStyles.DEFAULT_THEME) {
      document.body.classList.add(colorThemeStyles[theme]);
    }
  }
} catch (e) {
  // localStorage might be full or disabled
}

void initializeEmojiMart();

maybeRegisterAutoSelectionBarrier();
registerCustomYupValidators();

const root = createRoot(document.getElementById("root")!);
//root.render(<Root />);

// We don't have a service worker, but we try to unregister it just in case.
// This would allow us to have a service worker on a branch release channel and
// have that service worker be unregistered when switching back to the default
// release channel.
serviceWorker.unregister();
