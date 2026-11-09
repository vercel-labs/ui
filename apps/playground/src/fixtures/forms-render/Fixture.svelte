<script lang="ts">
  import {
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldControl,
    FieldLabel,
    Radio,
    RadioGroup,
    Switch,
    SwitchThumb,
  } from "@ui-sdk/svelte"

  let action = $state("")
  let nickname = $state("")

  function onNickname(event: Event) {
    nickname = (event.target as HTMLInputElement).value
  }

  function onSpan(checked: unknown) {
    action = `span:${String(checked)}`
  }

  function onSize(value: string | null) {
    action = `size:${value}`
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form
    class="form"
    aria-label="Rendering"
    onsubmit={(event) => event.preventDefault()}
  >
    <label>
      <Checkbox class="checkbox" onCheckedChange={onSpan}>
        {#snippet render({ props })}
          <span {...props}>
            <CheckboxIndicator class="checkbox-indicator" />
          </span>
        {/snippet}
      </Checkbox>
      Rendered as a span
    </label>
    <Checkbox aria-label="Render function">
      {#snippet render({ props, state })}
        <button {...props}>{state.checked ? "On" : "Off"}</button>
      {/snippet}
    </Checkbox>
    <Checkbox aria-label="Class from state">
      {#snippet children(state)}
        <span hidden data-class={state.checked}></span>
      {/snippet}
    </Checkbox>
    <label>
      <Switch class="switch" defaultChecked>
        <SwitchThumb>
          {#snippet children(state)}{state.checked ? "I" : "O"}{/snippet}
        </SwitchThumb>
      </Switch>
      Labelled thumb
    </label>
    <RadioGroup aria-label="Size" defaultValue="small" onValueChange={onSize}>
      {#each ["small", "large"] as value (value)}
        <label>
          <Radio class="radio" {value}>
            {#snippet render({ props })}
              <span {...props}></span>
            {/snippet}
          </Radio>
          {value === "small" ? "Small" : "Large"}
        </label>
      {/each}
    </RadioGroup>
    <Field>
      <FieldLabel>Nickname</FieldLabel>
      <FieldControl value={nickname} oninput={onNickname} />
    </Field>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
