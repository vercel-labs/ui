<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const methods = [
    { value: "standard", label: "Standard", detail: "Free, 5 to 7 days" },
    { value: "express", label: "Express", detail: "$9, 2 days" },
    { value: "overnight", label: "Overnight", detail: "$24, next day" },
  ]

  let submitted = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    submitted = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)))
  }

  const id = $props.id()
</script>

<div data-slot="stack">
  <RadioGroup
    aria-label="Shipping"
    name="shipping"
    form={`${id}-shipping-form`}
    required
    defaultValue="standard"
  >
    {#each methods as method (method.value)}
      <label data-slot="label">
        <Radio value={method.value}>
          <RadioIndicator />
        </Radio>
        {method.label} <span data-slot="hint">{method.detail}</span>
      </label>
    {/each}
  </RadioGroup>
  <form data-slot="row" id={`${id}-shipping-form`} onsubmit={submit} onreset={() => (submitted = "")}>
    <button type="submit">
      Submit
    </button>
    <button type="reset">
      Reset
    </button>
  </form>
  {#if submitted}
    <output data-slot="output">Submitted: {submitted}</output>
  {/if}
</div>
