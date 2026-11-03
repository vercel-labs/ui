<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const options = [
    { value: "default", label: "Default", description: "Standard spacing for most use cases." },
    { value: "comfortable", label: "Comfortable", description: "More space between elements." },
    { value: "compact", label: "Compact", description: "Minimal spacing for dense layouts." },
  ]

  const id = $props.id()
</script>

<RadioGroup defaultValue="comfortable" aria-label="Density">
  {#each options as option (option.value)}
    <div data-slot="row">
      <Radio
        id={`${id}-density-${option.value}`}
        value={option.value}
        aria-describedby={`${id}-density-${option.value}-description`}
      >
        <RadioIndicator />
      </Radio>
      <div data-slot="stack">
        <label data-slot="label"
          for={`${id}-density-${option.value}`}
        >{option.label}</label>
        <p data-slot="hint" id={`${id}-density-${option.value}-description`}>
          {option.description}
        </p>
      </div>
    </div>
  {/each}
</RadioGroup>
