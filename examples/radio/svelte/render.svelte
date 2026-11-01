<script lang="ts">
  import { Bell, Check, Mail, Moon } from "@lucide/svelte"
  import { Radio, RadioGroup } from "@ui-sdk/svelte/radio"

  const options = [
    { value: "all", label: "Everything", description: "Every message and update.", icon: Bell },
    { value: "mentions", label: "Mentions", description: "Only when someone mentions you.", icon: Mail },
    { value: "none", label: "Nothing", description: "Turn notifications off.", icon: Moon },
  ]

  const id = $props.id()
</script>

<RadioGroup aria-label="Notify me about" defaultValue="mentions">
  {#each options as option (option.value)}
    {@const Icon = option.icon}
    <Radio
      value={option.value}
      aria-labelledby={`${id}-notify-${option.value}-label`}
      aria-describedby={`${id}-notify-${option.value}-description`}
    >
      {#snippet render({ props, state })}
        <button {...props}>
          <Icon />
          <span data-slot="stack">
            <span
              id={`${id}-notify-${option.value}-label`}
            >{option.label}</span>
            <span data-slot="hint" id={`${id}-notify-${option.value}-description`}>
              {option.description}
            </span>
          </span>
          {#if state.checked}<Check />{/if}
        </button>
      {/snippet}
    </Radio>
  {/each}
</RadioGroup>
