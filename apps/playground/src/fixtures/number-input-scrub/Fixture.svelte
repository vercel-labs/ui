<script lang="ts">
  import {
    createNumberInputController,
    NumberInput,
    NumberInputControl,
    NumberInputGroup,
    NumberInputScrubArea,
  } from "@ui-sdk/svelte"
  import { numberInputScrubFixture as f } from "tests/fixtures/number-input-scrub.ts"

  const controller = createNumberInputController()
  let action = $state("")
  let commits = $state<string[]>([])
</script>

<div class="fixture">
  <button>Before</button>
  <div role="toolbar" aria-label={f.toolbarLabel} class="row">
    <NumberInputScrubArea {controller} class="number-input-scrub"
      >{f.toolbarScrub}</NumberInputScrubArea
    >
  </div>
  <table>
    <thead>
      <tr>
        <NumberInputScrubArea {controller} class="number-input-scrub">
          {#snippet render({ props })}
            <th {...props}>{f.headerScrub}</th>
          {/snippet}
        </NumberInputScrubArea>
      </tr>
    </thead>
  </table>
  <NumberInput
    id={f.id}
    {controller}
    defaultValue={f.defaultValue}
    min={f.min}
    max={f.max}
    locale="en-US"
    onValueChange={(value) => (action = String(value))}
    onValueCommit={(value) => (commits = [...commits, String(value)])}
  >
    <NumberInputGroup class="number-input-group">
      <NumberInputScrubArea class="number-input-scrub"
        >{f.letterScrub}</NumberInputScrubArea
      >
      <NumberInputControl aria-label={f.label} class="number-input-control" />
    </NumberInputGroup>
    <div>
      <div>
        <div>
          <NumberInputScrubArea class="number-input-scrub"
            >{f.nestedScrub}</NumberInputScrubArea
          >
        </div>
      </div>
    </div>
  </NumberInput>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Committed">{commits.join(" ")}</output>
</div>
