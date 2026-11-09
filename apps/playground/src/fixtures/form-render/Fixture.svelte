<script lang="ts">
  import {
    Field,
    FieldLabel,
    FieldLegend,
    FieldSet,
    Input,
    InputClear,
    InputGroup,
    Textarea,
  } from "@ui-sdk/svelte"

  let renders = $state(0)
</script>

<div class="fixture">
  <button>Before</button>
  <FieldSet class="form">
    <FieldLegend>
      {#snippet render({ props })}
        <div {...props}>Legend as a div</div>
      {/snippet}
    </FieldLegend>
    <Field>
      <FieldLabel>Render function</FieldLabel>
      <Input class="input">
        {#snippet render({ props, state })}
          <input {...props} data-state={state.filled ? "filled" : "empty"} />
        {/snippet}
      </Input>
    </Field>
    <Field>
      <FieldLabel>Class from state</FieldLabel>
      <Textarea autoResize class="textarea" />
    </Field>
    <InputGroup class="input-group">
      <Input class="input" aria-label="Search" />
      <InputClear role="button" tabindex={0} aria-label="Clear search">
        {#snippet render({ props })}
          <span {...props}>×</span>
        {/snippet}
      </InputClear>
    </InputGroup>
  </FieldSet>
  <button type="button" onclick={() => renders++}
    >Render again ({renders})</button
  >
  <button>After</button>
</div>
