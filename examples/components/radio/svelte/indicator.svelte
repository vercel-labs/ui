<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]
</script>

<RadioGroup defaultValue="system" aria-label="Theme">
  {#each themes as theme (theme.value)}
    <label data-slot="label">
      <Radio value={theme.value}>
        <RadioIndicator keepMounted />
      </Radio>
      {theme.label}
    </label>
  {/each}
</RadioGroup>
