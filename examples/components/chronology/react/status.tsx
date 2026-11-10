"use client"

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
} from "@ui-sdk/react/chronology"
import { CheckIcon } from "lucide-react"

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
        {steps.map((step) => (
          <ChronologyItem
            key={step.value}
            value={step.value}
            status={step.status}
          >
            <ChronologyMarker>
              {step.status === "complete" && <CheckIcon aria-hidden="true" />}
            </ChronologyMarker>
            <ChronologyConnector />
            <ChronologyTitle>{step.title}</ChronologyTitle>
            <ChronologyTime dateTime={step.dateTime}>
              {step.time}
            </ChronologyTime>
            <ChronologyDescription>{step.description}</ChronologyDescription>
          </ChronologyItem>
        ))}
      </Chronology>
    </div>
  )
}

export { Example }
