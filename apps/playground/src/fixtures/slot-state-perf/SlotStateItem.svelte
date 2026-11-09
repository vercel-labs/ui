<script lang="ts">
  import type { menu } from "@ui-sdk/core/menu"
  import { usePart, type PrimitiveHandle } from "@ui-sdk/svelte/primitive"
  import { untrack } from "svelte"

  let {
    handle,
    value,
    label,
    round,
  }: {
    handle: PrimitiveHandle<typeof menu>
    value: string
    label: string
    // Changes on every round, so the item renders again.
    round: number
  } = $props()

  // The handle is read once: a part belongs to one instance for its life.
  const item = usePart(
    untrack(() => handle),
    "item",
    () => ({ value })
  )
</script>

<div {...item.slot({ "data-round": round })}>
  {item.state.highlighted ? "→ " : ""}{label}
</div>
