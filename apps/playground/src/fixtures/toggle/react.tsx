import { Button } from "@ui-sdk/react/button"
import { Separator } from "@ui-sdk/react/separator"
import { Toggle, ToggleGroup, createToggleGroupController } from "@ui-sdk/react/toggle"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { changedValue, toggleOptions } from "tests/fixtures/page.ts"
import { toggleAction, toggleFixture, type ToggleFixtureItem } from "tests/fixtures/toggle.ts"

const formatting = createToggleGroupController()

// A Promise and the buttons that settle it.
function useGate() {
  const settle = React.useRef<{ resolve: () => void; reject: (reason: Error) => void } | null>(null)
  return {
    wait: () => new Promise<void>((resolve, reject) => (settle.current = { resolve, reject })),
    resolve: () => settle.current?.resolve(),
    reject: () => settle.current?.reject(new Error("Offline")),
  }
}

function Fixture() {
  const [action, setAction] = React.useState("")
  const [pressedWith, setPressedWith] = React.useState("")
  const [submissions, setSubmissions] = React.useState(0)
  const { cancel, defaultPressed, disabled, alignment, ...groupOptions } = toggleOptions()
  const saving = useGate()
  const publishing = useGate()
  // Each group's value, to tell which toggle a change touches.
  const values = React.useRef<Record<string, string[]>>({
    alignment: alignment ? [alignment] : toggleFixture.alignment.defaultValue,
    formatting: toggleFixture.formatting.defaultValue,
  })

  const group = (
    { name, label, items }: typeof toggleFixture.alignment,
    props: { multiple?: boolean; disabled?: boolean; controller?: typeof formatting },
  ) => (
    <ToggleGroup
      className="toggle-group"
      aria-label={label}
      defaultValue={values.current[name]}
      {...groupOptions}
      {...props}
      onValueChange={(value, details) => {
        if (cancel && changedValue(values.current[name], value) === cancel) return details.cancel()
        values.current[name] = value
        setAction(toggleAction.group(name, value))
      }}
    >
      {items.map((item: ToggleFixtureItem) => (
        <Toggle key={item.value} className="toggle" value={item.value} disabled={item.disabled}>
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )

  return (
    <div className="fixture">
      <button>Before</button>
      <Toggle
        className="toggle"
        defaultPressed={defaultPressed}
        onPressedChange={(pressed, details) => {
          if (cancel === toggleFixture.toggle.value) return details.cancel()
          setAction(toggleAction.toggle(pressed))
        }}
      >
        {toggleFixture.toggle.label}
      </Toggle>
      {group(toggleFixture.alignment, {})}
      <Separator className="rule" orientation="vertical" />
      {group(toggleFixture.formatting, { multiple: true, disabled, controller: formatting })}
      <form
        aria-label={toggleFixture.form.label}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmissions((count) => count + 1)
        }}
      >
        <label>
          {toggleFixture.form.field} <input name="name" defaultValue={toggleFixture.form.defaultName} />
        </label>
        <Button className="button" type="submit" onClick={saving.wait}>
          Submit
        </Button>
        <Button className="button" type="reset">
          Reset
        </Button>
        <Button className="button" disabled onClick={() => setAction("delete")}>
          Delete
        </Button>
        <Button
          className="button"
          type="submit"
          disabled
          focusableWhenDisabled
          onClick={() => setAction("archive")}
        >
          Archive
        </Button>
      </form>
      <Button
        className="button"
        onClick={(_event, { source }) => {
          setAction("save")
          setPressedWith(source)
        }}
      >
        Save
      </Button>
      <Button
        className="button"
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
      <Button className="button" render={<a href={toggleFixture.docs.href} />}>
        {toggleFixture.docs.label}
      </Button>
      <Button className="button" disabled render={<a href={toggleFixture.changelog.href} />}>
        {toggleFixture.changelog.label}
      </Button>
      <Separator className="rule" />
      <Separator className="rule" decorative />
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Submissions">{submissions}</output>
      <output aria-label="Pressed with">{pressedWith}</output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>,
  )
}

export { Fixture, mount }
