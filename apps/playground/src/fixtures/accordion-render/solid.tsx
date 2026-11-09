import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/solid/accordion"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { describeValue } from "tests/fixtures/accordion.ts"

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Accordion
        class="accordion"
        defaultValue={["overview"]}
        onValueChange={(value) => setAction(describeValue(value))}
      >
        <AccordionItem
          value="overview"
          class={(state) =>
            `accordion-item ${state.open ? "is-open" : "is-closed"}`
          }
        >
          <AccordionHeader
            class="accordion-header"
            render={(props) => <h2 {...props} />}
          >
            <AccordionTrigger
              class="accordion-trigger"
              render={(props, state) => (
                <button {...props}>
                  {props.children}
                  <span aria-hidden="true"> {state.open ? "−" : "+"}</span>
                  <span class="index" hidden>
                    {state.index}
                  </span>
                </button>
              )}
            >
              Overview
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel
            class="accordion-panel"
            render={(props) => <section {...props} />}
          >
            The overview panel.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="details" class="accordion-item">
          <AccordionHeader class="accordion-header">
            <AccordionTrigger
              class="accordion-trigger"
              render={(props) => <div {...props} />}
            >
              Details
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel class="accordion-panel">
            The details panel.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
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
