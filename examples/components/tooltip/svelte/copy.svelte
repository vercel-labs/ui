<script lang="ts">
  import { CheckIcon, CopyIcon } from "@lucide/svelte"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const command = "pnpm add @ui-sdk/svelte"
  let copied = $state(false)

  function copy() {
    navigator.clipboard?.writeText(command).catch(() => {})
    copied = true
  }
</script>

<div data-slot="row">
  <code>{command}</code>
  <Tooltip
    closeOnPress={false}
    onOpenChangeComplete={(open) => {
      if (!open) copied = false
    }}
  >
    <TooltipTrigger onclick={copy}>
      {#if copied}
        <CheckIcon />
      {:else}
        <CopyIcon />
      {/if}
    </TooltipTrigger>
    <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
  </Tooltip>
</div>
