import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
  createChronologyController,
  type ChronologyStatus,
} from "@ui-sdk/solid/chronology"
import { For, Show } from "solid-js"

const steps: {
  value: string
  title: string
  dateTime: string
  time: string
  description: string
  status: ChronologyStatus
}[] = [
  {
    value: "placed",
    title: "Order placed",
    dateTime: "2026-11-01",
    time: "Nov 1",
    description: "We received your order.",
    status: "complete",
  },
  {
    value: "packed",
    title: "Packed",
    dateTime: "2026-11-02",
    time: "Nov 2",
    description: "Your items left the shelf.",
    status: "complete",
  },
  {
    value: "shipped",
    title: "Shipped",
    dateTime: "2026-11-03",
    time: "Nov 3",
    description: "On its way with the carrier.",
    status: "current",
  },
  {
    value: "delivered",
    title: "Delivered",
    dateTime: "2026-11-05",
    time: "Nov 5",
    description: "Expected by Thursday.",
    status: "upcoming",
  },
]

const controller = createChronologyController()

function Example() {
  return (
    <div data-slot="stack">
      <div data-slot="controls">
        <button onClick={() => controller.focus("shipped")}>
          Go to Current Step
        </button>
      </div>
      <Chronology aria-label="Order status" controller={controller}>
        <For each={steps}>
          {(step) => (
            <ChronologyItem value={step.value} status={step.status}>
              <ChronologyMarker>
                <Show when={step.status === "complete"}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </Show>
              </ChronologyMarker>
              <ChronologyConnector />
              <ChronologyTitle>{step.title}</ChronologyTitle>
              <ChronologyTime datetime={step.dateTime}>
                {step.time}
              </ChronologyTime>
              <ChronologyDescription>{step.description}</ChronologyDescription>
            </ChronologyItem>
          )}
        </For>
      </Chronology>
    </div>
  )
}

export { Example }
