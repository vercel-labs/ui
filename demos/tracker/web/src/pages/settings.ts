import { html } from "lit-html"
import { settingsForm } from "../components/settings-form"
import { db } from "../lib/tracker"

function settingsPage() {
  return html`<main class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto grid max-w-xl gap-8 px-4 py-10">
      <div class="grid gap-1">
        <h1 class="text-xl font-semibold">Settings</h1>
        <p class="text-muted-foreground">
          How the tracker works for the Acme workspace.
        </p>
      </div>
      ${settingsForm(db.settings)}
    </div>
  </main>`
}

export { settingsPage }
