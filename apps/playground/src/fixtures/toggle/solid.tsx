import { Button } from "@ui-sdk/solid/button"
import { Separator } from "@ui-sdk/solid/separator"
import {
  Toggle,
  ToggleGroup,
  createToggleGroupController,
} from "@ui-sdk/solid/toggle"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { changedValue, toggleOptions } from "tests/fixtures/page.ts"
import {
  toggleAction,
  toggleFixture,
  type ToggleFixtureItem,
} from "tests/fixtures/toggle.ts"

const formatting = createToggleGroupController()

// A Promise and the buttons that settle it.
function createGate() {
  let settle: { resolve: () => void; reject: (reason: Error) => void } | null =
    null
  return {
    wait: () =>
      new Promise<void>((resolve, reject) => (settle = { resolve, reject })),
    resolve: () => settle?.resolve(),
    reject: () => settle?.reject(new Error("Offline")),
  }
}

function Fixture() {
  const [action, setAction] = createSignal("")
  const [pressedWith, setPressedWith] = createSignal("")
  const [submissions, setSubmissions] = createSignal(0)
  const { cancel, defaultPressed, disabled, alignment, ...groupOptions } =
    toggleOptions()
  const saving = createGate()
  const publishing = createGate()
  // Each group's value, to tell which toggle a change touches.
  const values: Record<string, string[]> = {
    alignment: alignment ? [alignment] : toggleFixture.alignment.defaultValue,
    formatting: toggleFixture.formatting.defaultValue,
  }

  const group = (
    { name, label, items }: typeof toggleFixture.alignment,
    props: {
      multiple?: boolean
      disabled?: boolean
      controller?: typeof formatting
    }
  ) => (
    <ToggleGroup
      class="toggle-group"
      aria-label={label}
      defaultValue={values[name]}
      {...groupOptions}
      {...props}
      onValueChange={(value, details) => {
        if (cancel && changedValue(values[name], value) === cancel) {
          return details.cancel()
        }
        values[name] = value
        setAction(toggleAction.group(name, value))
      }}
    >
      <For each={items}>
        {(item: ToggleFixtureItem) => (
          <Toggle class="toggle" value={item.value} disabled={item.disabled}>
            {item.label}
          </Toggle>
        )}
      </For>
    </ToggleGroup>
  )

  return (
    <div class="fixture">
      <button>Before</button>
      <Toggle
        class="toggle"
        defaultPressed={defaultPressed}
        onPressedChange={(pressed, details) => {
          if (cancel === toggleFixture.toggle.value) {
            return details.cancel()
          }
          setAction(toggleAction.toggle(pressed))
        }}
      >
        {toggleFixture.toggle.label}
      </Toggle>
      {group(toggleFixture.alignment, {})}
      <Separator class="rule" orientation="vertical" />
      {group(toggleFixture.formatting, {
        multiple: true,
        disabled,
        controller: formatting,
      })}
      <form
        aria-label={toggleFixture.form.label}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmissions((count) => count + 1)
        }}
      >
        <label>
          {toggleFixture.form.field}{" "}
          <input name="name" defaultValue={toggleFixture.form.defaultName} />
        </label>
        <Button class="button" type="submit" onClick={saving.wait}>
          Submit
        </Button>
        <Button class="button" type="reset">
          Reset
        </Button>
        <Button class="button" disabled onClick={() => setAction("delete")}>
          Delete
        </Button>
        <Button
          class="button"
          type="submit"
          disabled
          focusableWhenDisabled
          onClick={() => setAction("archive")}
        >
          Archive
        </Button>
      </form>
      <Button
        class="button"
        onClick={(_event, { source }) => {
          setAction("save")
          setPressedWith(source)
        }}
      >
        Save
      </Button>
      <Button
        class="button"
        onClick={async () => {
          setAction("publishing")
          await publishing.wait()
          setAction("published")
        }}
      >
        Publish
      </Button>
      <button onClick={() => formatting.setValue([])}>Clear formatting</button>
      <button onClick={saving.resolve}>Finish saving</button>
      <button onClick={publishing.resolve}>Finish publishing</button>
      <button onClick={publishing.reject}>Fail publishing</button>
      <Button
        class="button"
        render={(props) => <a {...props} href={toggleFixture.docs.href} />}
      >
        {toggleFixture.docs.label}
      </Button>
      <Button
        class="button"
        disabled
        render={(props) => <a {...props} href={toggleFixture.changelog.href} />}
      >
        {toggleFixture.changelog.label}
      </Button>
      <Separator class="rule" />
      <Separator class="rule" decorative />
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Submissions">{submissions()}</output>
      <output aria-label="Pressed with">{pressedWith()}</output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
