<script lang="ts">
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"
  import { useLog } from "../../../shared/svelte/log"

  const log = useLog()
  let title = $state("")
  const blocked = $derived(!title.trim())
</script>

<div data-slot="stack">
  <Field>
    <FieldLabel>Post title</FieldLabel>
    <FieldControl value={title} oninput={(event) => (title = event.currentTarget.value)} />
  </Field>
  <Tooltip disabled={!blocked}>
    <TooltipTrigger
      data-variant="solid"
      aria-disabled={blocked || undefined}
      onclick={() => {
        if (!blocked) log(`Published “${title.trim()}”`)
      }}
    >
      Publish
    </TooltipTrigger>
    <TooltipContent side="right">Add a title to publish</TooltipContent>
  </Tooltip>
</div>
