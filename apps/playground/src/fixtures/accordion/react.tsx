import { createAccordionController } from "@ui-sdk/core/accordion"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { accordionFixture, describeValue } from "tests/fixtures/accordion.ts"
import { accordionOptions } from "tests/fixtures/page.ts"

const controller = createAccordionController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [complete, setComplete] = React.useState("")
  const [warrantyEnabled, setWarrantyEnabled] = React.useState(false)
  const { cancel, ...options } = accordionOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      <Accordion
        className="accordion"
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
        {accordionFixture.items.map((item) => (
          <AccordionItem
            key={item.value}
            className="accordion-item"
            value={item.value}
            disabled={item.disabled && !warrantyEnabled}
            onOpenChangeComplete={(open) =>
              setComplete(`${item.value} ${open ? "open" : "closed"}`)
            }
          >
            <AccordionHeader className="accordion-header">
              <AccordionTrigger className="accordion-trigger">
                {item.label}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel className="accordion-panel">
              {item.content}
              {item.field && (
                <label>
                  {" "}
                  {item.field} <input />
                </label>
              )}
              {item.close && (
                <button onClick={() => controller.close(item.value)}>
                  {item.close}
                </button>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Last completed">{complete}</output>
      <button onClick={() => controller.open("support")}>Show support</button>
      <button onClick={() => setWarrantyEnabled((enabled) => !enabled)}>
        Toggle warranty
      </button>
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
