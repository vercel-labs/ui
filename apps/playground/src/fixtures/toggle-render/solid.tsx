import { Button } from "@ui-sdk/solid/button"
import { Separator } from "@ui-sdk/solid/separator"
import { Toggle, ToggleGroup } from "@ui-sdk/solid/toggle"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Button
        class="button"
        render={(props) => <span {...props} />}
        onClick={() => setAction("span")}
      >
        Span button
      </Button>
      <Button
        class="button"
        disabled
        render={(props) => <a {...props} href="#old" />}
      >
        Old docs
      </Button>
      <Toggle
        class={(state) =>
          `toggle ${state.pressed ? "is-pressed" : "is-unpressed"}`
        }
        onPressedChange={(pressed) => setAction(pressed ? "star" : "unstar")}
      >
        {(state) => (
          <>
            <span aria-hidden="true">{state.pressed ? "★" : "☆"}</span> Star
          </>
        )}
      </Toggle>
      <ToggleGroup
        class="toggle-group"
        aria-label="View"
        defaultValue={["grid"]}
        onValueChange={(value) => setAction(value.join(", "))}
      >
        <Toggle
          class="toggle"
          value="grid"
          render={(props) => <span {...props} />}
        >
          Grid
        </Toggle>
        <Toggle
          class="toggle"
          value="list"
          render={(props) => <span {...props} />}
        >
          List
        </Toggle>
      </ToggleGroup>
      <Separator class="rule" render={(props) => <hr {...props} />} />
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
