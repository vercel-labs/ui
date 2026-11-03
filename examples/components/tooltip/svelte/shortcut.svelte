<script lang="ts">
  import { SaveIcon, Share2Icon } from "@lucide/svelte"
  import { registerShortcut } from "@ui-sdk/core/shortcuts"
  import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  let status = $state("Nothing yet")
  const save = () => (status = "Saved")
  const share = () => (status = "Shared")

  $effect(() => {
    const offs = [registerShortcut("mod+s", save), registerShortcut("mod+shift+e", share)]
    return () => offs.forEach((off) => off())
  })
</script>

<div data-slot="stack">
  <div data-slot="row">
    <Tooltip shortcut="mod+s">
      <TooltipTrigger onclick={save}>
        <SaveIcon />
      </TooltipTrigger>
      <TooltipContent>
        Save
        <TooltipShortcut />
      </TooltipContent>
    </Tooltip>
    <Tooltip shortcut="mod+shift+e">
      <TooltipTrigger onclick={share}>
        <Share2Icon />
        Share
      </TooltipTrigger>
      <TooltipContent>
        Share with your team
        <TooltipShortcut>
          {#snippet render({ props })}
            <kbd {...props}></kbd>
          {/snippet}
        </TooltipShortcut>
      </TooltipContent>
    </Tooltip>
  </div>
  <output data-slot="output">{status}</output>
</div>
