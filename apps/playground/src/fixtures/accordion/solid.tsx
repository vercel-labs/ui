import { createAccordionController } from "@ui-sdk/core/accordion"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/solid/accordion"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import { accordionFixture, describeValue } from "tests/fixtures/accordion.ts"
import { accordionOptions } from "tests/fixtures/page.ts"

const controller = createAccordionController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [complete, setComplete] = createSignal("")
  const [warrantyEnabled, setWarrantyEnabled] = createSignal(false)
  const { cancel, ...options } = accordionOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Accordion
        class="accordion"
        controller={controller}
        {...options}
        onValueChange={(value, details) => {
          if (
            cancel &&
            value.includes(cancel) &&
            !controller.getValue().includes(cancel)
          ) {
            return details.cancel()
          }
          setAction(describeValue(value))
        }}
      >
        <For each={accordionFixture.items}>
          {(item) => (
            <AccordionItem
              class="accordion-item"
              value={item.value}
              disabled={item.disabled && !warrantyEnabled()}
              onOpenChangeComplete={(open) =>
                setComplete(`${item.value} ${open ? "open" : "closed"}`)
              }
            >
              <AccordionHeader class="accordion-header">
                <AccordionTrigger class="accordion-trigger">
                  {item.label}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel class="accordion-panel">
                {item.content}
                <Show when={item.field}>
                  <label>
                    {" "}
                    {item.field} <input />
                  </label>
                </Show>
                <Show when={item.close}>
                  <button onClick={() => controller.close(item.value)}>
                    {item.close}
                  </button>
                </Show>
              </AccordionPanel>
            </AccordionItem>
          )}
        </For>
      </Accordion>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Last completed">{complete()}</output>
      <button onClick={() => controller.open("support")}>Show support</button>
      <button onClick={() => setWarrantyEnabled((enabled) => !enabled)}>
        Toggle warranty
      </button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
