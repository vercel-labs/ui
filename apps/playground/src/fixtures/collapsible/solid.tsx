import { createCollapsibleController } from "@ui-sdk/core/collapsible"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/solid/collapsible"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { collapsibleFixture as fixture } from "tests/fixtures/collapsible.ts"
import { collapsibleOptions } from "tests/fixtures/page.ts"

const controller = createCollapsibleController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [reason, setReason] = createSignal("")
  const [source, setSource] = createSignal("")
  const [complete, setComplete] = createSignal("")
  const { cancel, keepMounted, hiddenUntilFound, ...options } =
    collapsibleOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Collapsible
        class="collapsible"
        controller={controller}
        {...options}
        onOpenChange={(open, details) => {
          if (cancel === (open ? "open" : "close")) {
            return details.cancel()
          }
          setAction(open ? "open" : "closed")
          setReason(details.reason)
          setSource(details.source)
        }}
        onOpenChangeComplete={(open) => setComplete(open ? "open" : "closed")}
      >
        <CollapsibleTrigger class="collapsible-trigger">
          {fixture.trigger}
        </CollapsibleTrigger>
        <CollapsiblePanel
          class="collapsible-panel"
          keepMounted={keepMounted}
          hiddenUntilFound={hiddenUntilFound}
        >
          <p>{fixture.content}</p>
          <label>
            {fixture.field} <input />
          </label>
          <button onClick={() => controller.close()}>{fixture.close}</button>
        </CollapsiblePanel>
      </Collapsible>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Last reason">{reason()}</output>
      <output aria-label="Last source">{source()}</output>
      <output aria-label="Last completed">{complete()}</output>
      <button onClick={() => controller.toggle()}>{fixture.controller}</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
