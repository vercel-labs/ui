import { html } from "lit-html"
import { header } from "./components/header"
import { overlays } from "./components/overlays"
import { issuesPage } from "./pages/issues"
import { settingsPage } from "./pages/settings"
import { route } from "./lib/router"

function app() {
  const settings = route() === "settings"
  document.title = settings ? "Settings · Tracker" : "Tracker"
  return html`${header()} ${settings ? settingsPage() : issuesPage()}
  ${overlays()}`
}

export { app }
