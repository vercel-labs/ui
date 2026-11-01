<script lang="ts">
  import { Check, Plus } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"

  const topics = [
    { value: "design", label: "Design", checked: true },
    { value: "engineering", label: "Engineering", checked: false },
    { value: "marketing", label: "Marketing", checked: false },
    { value: "sales", label: "Sales", checked: false },
  ]
</script>

<div data-slot="stack">
  <fieldset>
    <legend>Topics you follow</legend>
    <div data-slot="row">
      {#each topics as topic (topic.value)}
        <Checkbox name="topics" value={topic.value} defaultChecked={topic.checked}>
          {#snippet render({ props, state })}
            <button {...props}>
              {#if state.checked}
                <Check />
              {:else}
                <Plus />
              {/if}
              {topic.label}
            </button>
          {/snippet}
        </Checkbox>
      {/each}
    </div>
  </fieldset>
  <label data-slot="label">
    <Checkbox>
      {#snippet render({ props })}
        <span {...props}>
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </span>
      {/snippet}
    </Checkbox>
    Notify me about new topics
  </label>
</div>
