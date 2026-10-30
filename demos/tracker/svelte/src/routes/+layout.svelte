<script lang="ts">
  import "../app.css"
  import Header from "#lib/components/header.svelte"
  import { Confirmer } from "#ui/alert-dialog"
  import { Toaster } from "#ui/toast"
  import { setTracker, Tracker } from "#lib/tracker.svelte.ts"
  import type { LayoutProps } from "./$types"

  let { data, children }: LayoutProps = $props()

  const tracker = setTracker(new Tracker())
</script>

<svelte:head>
  <title>Tracker</title>
  <meta name="description" content="An issue tracker built with ui-sdk." />
</svelte:head>

<Header issues={data.issues} />
{@render children()}
<Toaster />
<Confirmer confirm={tracker.confirm} />
