<script lang="ts">
  import { createParts } from "../../src/primitive"
  import Group from "./hand-written-group.svelte"
  import { shell } from "./hand-written-group"

  const parts = createParts(shell, { group: "div", item: "span" })
</script>

<parts.Root>
  <parts.Group value="generated"><parts.Item /></parts.Group>
  <Group value="by hand"><parts.Item /></Group>
</parts.Root>
