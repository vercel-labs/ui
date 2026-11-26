<!-- Checked by svelte-check, never rendered: a change handler typed with the app's own union types the value, as in React. -->
<script lang="ts">
  import { NavigationMenu } from "../../src/navigation-menu"
  import { RadioGroup } from "../../src/radio"
  import { SegmentedControl } from "../../src/segmented-control"
  import { Tabs } from "../../src/tabs"

  type Plan = "hobby" | "pro"
  let plan: Plan | null = $state("hobby")
  const set = (value: Plan | null) => (plan = value)
</script>

<RadioGroup defaultValue="hobby" onValueChange={set} />
<SegmentedControl bind:value={plan} onValueChange={set} />
<NavigationMenu value={plan} onValueChange={set} />
<Tabs value={plan} onValueChange={set} />
