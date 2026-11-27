<!-- Checked by svelte-check, never rendered: a change handler typed with the app's own union types the value, as in React. -->
<script lang="ts">
  import { Accordion } from "../../src/accordion"
  import { Checkbox, CheckboxGroup } from "../../src/checkbox"
  import { NavigationMenu } from "../../src/navigation-menu"
  import { RadioGroup } from "../../src/radio"
  import { SegmentedControl } from "../../src/segmented-control"
  import { Tabs } from "../../src/tabs"
  import { Toggle, ToggleGroup } from "../../src/toggle"

  type Plan = "hobby" | "pro"
  let plan: Plan | null = $state("hobby")
  const set = (value: Plan | null) => (plan = value)
  let plans: Plan[] = $state(["hobby"])
  const setAll = (value: Plan[]) => (plans = value)
</script>

<RadioGroup defaultValue="hobby" onValueChange={set} />
<SegmentedControl bind:value={plan} onValueChange={set} />
<NavigationMenu value={plan} onValueChange={set} />
<Tabs value={plan} onValueChange={set} />
<Accordion bind:value={plans} onValueChange={setAll} />
<CheckboxGroup bind:value={plans} onValueChange={setAll}>
  <Checkbox value="pro" />
</CheckboxGroup>
<ToggleGroup bind:value={plans} onValueChange={setAll}>
  <Toggle value="pro" />
</ToggleGroup>
