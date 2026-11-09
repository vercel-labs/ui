import {
  createNumberInputController,
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
} from "@ui-sdk/solid/number-input"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { numberInputScrubFixture as f } from "tests/fixtures/number-input-scrub.ts"

const controller = createNumberInputController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [commits, setCommits] = createSignal<string[]>([])
  return (
    <div class="fixture">
      <button>Before</button>
      <div role="toolbar" aria-label={f.toolbarLabel} class="row">
        <NumberInputScrubArea
          controller={controller}
          class="number-input-scrub"
        >
          {f.toolbarScrub}
        </NumberInputScrubArea>
      </div>
      <table>
        <thead>
          <tr>
            <NumberInputScrubArea
              controller={controller}
              render={(props) => <th {...props} />}
              class="number-input-scrub"
            >
              {f.headerScrub}
            </NumberInputScrubArea>
          </tr>
        </thead>
      </table>
      <NumberInput
        id={f.id}
        controller={controller}
        defaultValue={f.defaultValue}
        min={f.min}
        max={f.max}
        locale="en-US"
        onValueChange={(value) => setAction(String(value))}
        onValueCommit={(value) =>
          setCommits((list) => [...list, String(value)])
        }
      >
        <NumberInputGroup class="number-input-group">
          <NumberInputScrubArea class="number-input-scrub">
            {f.letterScrub}
          </NumberInputScrubArea>
          <NumberInputControl
            aria-label={f.label}
            class="number-input-control"
          />
        </NumberInputGroup>
        <div>
          <div>
            <div>
              <NumberInputScrubArea class="number-input-scrub">
                {f.nestedScrub}
              </NumberInputScrubArea>
            </div>
          </div>
        </div>
      </NumberInput>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Committed">
        {commits().join(" ")}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
