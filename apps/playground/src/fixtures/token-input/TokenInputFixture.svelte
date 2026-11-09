<script lang="ts">
  import {
    fromText,
    toText,
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenRemove,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuHint,
    TriggerMenuItem,
    TriggerMenuList,
    type TokenInputValue,
    type TriggerMenuDataItem,
    type TriggerMenuSelectDetails,
  } from "@ui-sdk/svelte"
  import {
    pendingSelect,
    tokenInputFixture as f,
    tokenInputOptions,
    tokenTriggers,
  } from "tests/fixtures/token-input.ts"

  const { value, pending, fail, form, otherForm, controlled, ...options } =
    tokenInputOptions()
  let action = $state("")
  let submitted = $state("")
  const triggers = tokenTriggers()
  const initial = fromText(value)
  let current = $state.raw<TokenInputValue>(initial)

  function onValueChange(next: TokenInputValue, details: { reason: string }) {
    current = next
    action = `${details.reason}:${toText(next)}`
  }

  function onSelect(
    _selected: unknown,
    details: TriggerMenuSelectDetails<unknown>
  ) {
    return pending && details.trigger === "@"
      ? pendingSelect({ fail })
      : undefined
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = String(
      new FormData(event.currentTarget as HTMLFormElement).get(f.name)
    )
  }

  function onOtherSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = `other:${new FormData(event.currentTarget as HTMLFormElement).get(f.name)}`
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="composer" aria-label={f.formLabel} onsubmit={onSubmit}>
    <TokenInput
      {...options}
      name={f.name}
      form={otherForm ? "other" : undefined}
      defaultValue={controlled ? undefined : initial}
      value={controlled ? current : undefined}
      {onValueChange}
      onSubmit={form ? undefined : (next) => (submitted = toText(next))}
    >
      <label class="label" id="prompt-label">{f.label}</label>
      <TokenInputEditor
        aria-labelledby="prompt-label"
        class="editor"
        placeholder={f.placeholder}
      />
      <TriggerMenu {triggers} {onSelect}>
        <TriggerMenuHint class="hint" />
        <TriggerMenuContent class="popup list-popup">
          <TriggerMenuList>
            {#snippet children(state)}
              {#each state.items as TriggerMenuDataItem[] as item (item.value)}
                <TriggerMenuItem
                  value={item.value}
                  label={item.label}
                  disabled={item.disabled}
                  class="item"
                >
                  {item.label}
                </TriggerMenuItem>
              {/each}
            {/snippet}
          </TriggerMenuList>
        </TriggerMenuContent>
      </TriggerMenu>
      {#snippet token(token)}
        <!-- Svelte trims a component's leading whitespace, so the space is an expression. -->
        <TokenInputToken class="token"
          >{token.label}<TokenInputTokenRemove>{" ×"}</TokenInputTokenRemove
          ></TokenInputToken
        >
      {/snippet}
    </TokenInput>
    <button type="submit">{f.submit}</button>
  </form>
  {#if otherForm}<form
      id="other"
      aria-label="Other"
      onsubmit={onOtherSubmit}
    ></form>{/if}
  <textarea aria-label={f.scratch}></textarea>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
