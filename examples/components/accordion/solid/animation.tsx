import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/solid/accordion"
import { createSignal, For } from "solid-js"

const items = [
  {
    value: "one",
    label: "Why animate the height?",
    content: "So the content below slides instead of jumping.",
  },
  {
    value: "two",
    label: "Where does the height come from?",
    content: "The panel measures itself and writes the result to a CSS variable while it animates.",
  },
  {
    value: "three",
    label: "Does it animate on first paint?",
    content: "No. Panels open on the server or on mount show at once.",
  },
]

function Example() {
  const [status, setStatus] = createSignal("")

  return (
    <div>
      <Accordion defaultValue={["one"]}>
        <For each={items}>
          {(item) => (
            <AccordionItem
              value={item.value}
              onOpenChangeComplete={(open) =>
                setStatus(`${open ? "Finished opening" : "Finished closing"} “${item.label}”`)
              }
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {item.label}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>{item.content}</AccordionPanel>
            </AccordionItem>
          )}
        </For>
      </Accordion>
      <output data-slot="output">{status() || "Open or close an item."}</output>
    </div>
  )
}

export { Example }
