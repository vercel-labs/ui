import {
  createSegmentedControlController,
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/solid/segmented-control"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { segmentedControlOptions } from "tests/fixtures/page.ts"
import { segmentedControlFixture } from "tests/fixtures/segmented-control.ts"

const controller = createSegmentedControlController()

const entries = (form: HTMLFormElement) =>
  Array.from(new FormData(form), ([key, value]) => `${key}=${value}`).join("&")

function Fixture() {
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const { cancel, ...options } = segmentedControlOptions()
  return (
    <form
      class="fixture"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(entries(event.currentTarget))
      }}
    >
      <button type="button">Before</button>
      <SegmentedControl
        aria-label={segmentedControlFixture.label}
        name={segmentedControlFixture.name}
        controller={controller}
        {...options}
        onValueChange={(value, details) => {
          if (value === cancel) return details.cancel()
          setAction(`${value}:${details.reason}`)
        }}
      >
        <SegmentedControlIndicator />
        <For each={segmentedControlFixture.items}>
          {(item) => (
            <SegmentedControlItem value={item.value} disabled={item.disabled}>
              {item.label}
            </SegmentedControlItem>
          )}
        </For>
      </SegmentedControl>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" onClick={() => controller.setValue("calendar")}>
        Show calendar
      </button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Submitted">{submitted()}</output>
    </form>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
