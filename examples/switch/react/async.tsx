"use client"

import * as React from "react"
import { createSwitchController } from "@ui-sdk/core/switch"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import { LoaderCircle } from "lucide-react"

const save = (_checked: boolean) => new Promise((resolve) => setTimeout(resolve, 800))

function Example() {
  const [backups] = React.useState(() => createSwitchController())
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const pending = React.useRef(false)

  return (
    <div data-slot="stack">
      <label data-slot="label">
        <Switch
          controller={backups}
          aria-busy={saving}
          onCheckedChange={(next, details) => {
            if (details.reason === "imperative") return
            details.cancel()
            if (pending.current) return
            pending.current = true
            setSaving(true)
            setSaved(false)
            save(next).then(() => {
              pending.current = false
              backups.setChecked(next, { reason: "imperative" })
              setSaving(false)
              setSaved(true)
            })
          }}
        >
          <SwitchThumb>{saving && <LoaderCircle aria-hidden="true" />}</SwitchThumb>
        </Switch>
        Automatic backups
      </label>
      <p data-slot="hint" role="status">
        {saving ? "Saving…" : saved ? "Saved" : ""}
      </p>
    </div>
  )
}

export { Example }
