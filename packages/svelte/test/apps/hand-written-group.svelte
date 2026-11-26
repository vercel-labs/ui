<script lang="ts">
  import type { Snippet } from "svelte"
  import { Part, usePart } from "../../src/primitive"
  import { shell } from "./hand-written-group"

  let { value, children }: { value: string; children?: Snippet } = $props()
  const group = usePart(shell, "group", () => ({ value }))
</script>

{#if group.present}
  <Part tag="div" part={group} props={{ children }} />
{/if}
