import {
  createNumberInputController,
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
} from "@ui-sdk/react/number-input"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { numberInputScrubFixture as f } from "tests/fixtures/number-input-scrub.ts"

const controller = createNumberInputController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [commits, setCommits] = React.useState<string[]>([])
  return (
    <div className="fixture">
      <button>Before</button>
      <div role="toolbar" aria-label={f.toolbarLabel} className="row">
        <NumberInputScrubArea
          controller={controller}
          className="number-input-scrub"
        >
          {f.toolbarScrub}
        </NumberInputScrubArea>
      </div>
      <table>
        <thead>
          <tr>
            <NumberInputScrubArea
              controller={controller}
              render={<th />}
              className="number-input-scrub"
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
        <NumberInputGroup className="number-input-group">
          <NumberInputScrubArea className="number-input-scrub">
            {f.letterScrub}
          </NumberInputScrubArea>
          <NumberInputControl
            aria-label={f.label}
            className="number-input-control"
          />
        </NumberInputGroup>
        <div>
          <div>
            <div>
              <NumberInputScrubArea className="number-input-scrub">
                {f.nestedScrub}
              </NumberInputScrubArea>
            </div>
          </div>
        </div>
      </NumberInput>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Committed">
        {commits.join(" ")}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
