<script lang="ts">
  import SettingsForm from "#lib/components/settings-form.svelte"
  import type { PageProps } from "./$types"

  let { data }: PageProps = $props()
</script>

<main class="min-h-0 flex-1 overflow-y-auto">
  <div class="mx-auto grid max-w-xl gap-8 px-4 py-10">
    <div class="grid gap-1">
      <h1 class="text-xl font-semibold">Settings</h1>
      <p class="text-muted-foreground">
        How the tracker works for the Acme workspace.
      </p>
    </div>
    <SettingsForm settings={data.settings} />
  </div>
</main>
