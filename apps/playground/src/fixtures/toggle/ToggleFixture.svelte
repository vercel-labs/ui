<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    Button,
    Separator,
    Toggle,
    ToggleGroup,
    createToggleGroupController,
    type ButtonActionDetails,
  } from "@ui-sdk/svelte"
  import { changedValue, toggleOptions } from "tests/fixtures/page.ts"
  import { toggleAction, toggleFixture } from "tests/fixtures/toggle.ts"

  const { cancel, defaultPressed, disabled, alignment, ...groupOptions } =
    toggleOptions()
  const formatting = createToggleGroupController()
  let action = $state("")
  let pressedWith = $state("")
  let submissions = $state(0)

  // Each group's value, to tell which toggle a change touches.
  const values: Record<string, string[]> = {
    alignment: alignment ? [alignment] : toggleFixture.alignment.defaultValue,
    formatting: toggleFixture.formatting.defaultValue,
  }
  const groups = [
    {
      ...toggleFixture.alignment,
      multiple: false,
      disabled: false,
      controller: undefined,
    },
    {
      ...toggleFixture.formatting,
      multiple: true,
      disabled,
      controller: formatting,
    },
  ]

  function onValueChange(
    name: string,
    value: string[],
    details: { cancel: () => void }
  ) {
    if (cancel && changedValue(values[name], value) === cancel) {
      return details.cancel()
    }
    values[name] = value
    action = toggleAction.group(name, value)
  }

  function onPressedChange(pressed: boolean, details: ChangeDetails) {
    if (cancel === toggleFixture.toggle.value) {
      return details.cancel()
    }
    action = toggleAction.toggle(pressed)
  }

  // A Promise and the buttons that settle it.
  function gate() {
    let settle:
      { resolve: () => void; reject: (reason: Error) => void } | undefined
    return {
      wait: () =>
        new Promise<void>((resolve, reject) => (settle = { resolve, reject })),
      resolve: () => settle?.resolve(),
      reject: () => settle?.reject(new Error("Offline")),
    }
  }
  const saving = gate()
  const publishing = gate()

  function save(_event: MouseEvent, { source }: ButtonActionDetails) {
    action = "save"
    pressedWith = source
  }

  async function publish() {
    action = "publishing"
    await publishing.wait()
    action = "published"
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submissions++
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Toggle class="toggle" {defaultPressed} {onPressedChange}
    >{toggleFixture.toggle.label}</Toggle
  >
  {#each groups as group, index (group.name)}
    {#if index === 1}
      <Separator class="rule" orientation="vertical" />
    {/if}
    <ToggleGroup
      class="toggle-group"
      aria-label={group.label}
      defaultValue={values[group.name]}
      multiple={group.multiple}
      disabled={group.disabled}
      controller={group.controller}
      {...groupOptions}
      onValueChange={(value, details) =>
        onValueChange(group.name, value, details)}
    >
      {#each group.items as item (item.value)}
        <Toggle class="toggle" value={item.value} disabled={item.disabled}
          >{item.label}</Toggle
        >
      {/each}
    </ToggleGroup>
  {/each}
  <form aria-label={toggleFixture.form.label} onsubmit={onSubmit}>
    <label>
      {toggleFixture.form.field}
      <input name="name" defaultValue={toggleFixture.form.defaultName} />
    </label>
    <Button class="button" type="submit" onclick={saving.wait}>Submit</Button>
    <Button class="button" type="reset">Reset</Button>
    <Button class="button" disabled onclick={() => (action = "delete")}
      >Delete</Button
    >
    <Button
      class="button"
      type="submit"
      disabled
      focusableWhenDisabled
      onclick={() => (action = "archive")}
    >
      Archive
    </Button>
  </form>
  <Button class="button" onclick={save}>Save</Button>
  <Button class="button" onclick={publish}>Publish</Button>
  <button onclick={() => formatting.setValue([])}>Clear formatting</button>
  <button onclick={saving.resolve}>Finish saving</button>
  <button onclick={publishing.resolve}>Finish publishing</button>
  <button onclick={publishing.reject}>Fail publishing</button>
  <Button class="button" href={toggleFixture.docs.href}>
    {#snippet render({ props })}
      <a {...props}>{toggleFixture.docs.label}</a>
    {/snippet}
  </Button>
  <Button class="button" href={toggleFixture.changelog.href} disabled>
    {#snippet render({ props })}
      <a {...props}>{toggleFixture.changelog.label}</a>
    {/snippet}
  </Button>
  <Separator class="rule" />
  <Separator class="rule" decorative />
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Submissions">{submissions}</output>
  <output aria-label="Pressed with">{pressedWith}</output>
</div>
