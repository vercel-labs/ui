<script lang="ts">
  import { LoaderCircle } from "@lucide/svelte"
  import { createSwitchController, Switch, SwitchThumb } from "@ui-sdk/svelte/switch"

  const save = (_checked: boolean) => new Promise((resolve) => setTimeout(resolve, 800))

  const backups = createSwitchController()
  let saving = $state(false)
  let saved = $state(false)

  function onCheckedChange(next: boolean, details: { reason: string; cancel: () => void }) {
    if (details.reason === "imperative") return
    details.cancel()
    if (saving) return
    saving = true
    saved = false
    save(next).then(() => {
      saving = false
      backups.setChecked(next, { reason: "imperative" })
      saved = true
    })
  }
</script>

<div data-slot="stack">
  <label data-slot="label">
    <Switch controller={backups} aria-busy={saving} {onCheckedChange}>
      <SwitchThumb>
        {#if saving}<LoaderCircle aria-hidden="true" />{/if}
      </SwitchThumb>
    </Switch>
    Automatic backups
  </label>
  <p data-slot="hint" role="status">
    {saving ? "Saving…" : saved ? "Saved" : ""}
  </p>
</div>
