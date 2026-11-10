import "@ui-sdk/web/chronology"
import { Check, createElement } from "lucide"

const steps = [
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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button">Go to Current Step</button>
      </div>
      <ui-chronology aria-label="Order status">
        ${steps
          .map(
            (step) => `
              <ui-chronology-item value="${step.value}" status="${step.status}">
                <ui-chronology-marker>${step.status === "complete" ? createElement(Check, { "aria-hidden": "true" }).outerHTML : ""}</ui-chronology-marker>
                <ui-chronology-connector></ui-chronology-connector>
                <ui-chronology-title>${step.title}</ui-chronology-title>
                <ui-chronology-time><time datetime="${step.dateTime}">${step.time}</time></ui-chronology-time>
                <ui-chronology-description>${step.description}</ui-chronology-description>
              </ui-chronology-item>`
          )
          .join("")}
      </ui-chronology>
    </div>
  `
  const chronology = root.querySelector("ui-chronology")!
  root
    .querySelector('[data-slot="controls"] button')!
    .addEventListener("click", () => chronology.api.focus("shipped"))
}

export { mount }
