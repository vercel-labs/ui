import "@ui-sdk/web/dialog"
import type { UiDialogElement } from "@ui-sdk/web/dialog"

type Invoice = { id: string; customer: string; amount: string; status: "Paid" | "Due" }

const invoices: Invoice[] = [
  { id: "INV-001", customer: "Acme", amount: "$250.00", status: "Paid" },
  { id: "INV-002", customer: "Globex", amount: "$150.00", status: "Due" },
  { id: "INV-003", customer: "Initech", amount: "$350.00", status: "Due" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ul data-slot="list"></ul>
    <button type="button" data-code>Open from code</button>
    <ui-dialog id="invoice-reminder">
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title></ui-dialog-title>
          <ui-dialog-description></ui-dialog-description>
        </div>
        <div data-slot="row">
          <ui-dialog-close><button>Cancel</button></ui-dialog-close>
          <ui-dialog-close value="send"><button data-variant="solid">Send reminder</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
    <output data-slot="output"></output>
  `
  const list = root.querySelector("ul")!
  const dialog = root.querySelector<UiDialogElement<Invoice>>("ui-dialog")!
  const output = root.querySelector("output")!
  for (const invoice of invoices) {
    const row = document.createElement("li")
    row.dataset.slot = "row"
    row.innerHTML = `${invoice.customer}<span data-slot="hint">${invoice.amount} · ${invoice.status}</span>`
    const trigger = Object.assign(document.createElement("ui-dialog-trigger"), { payload: invoice })
    trigger.setAttribute("for", "invoice-reminder")
    if (invoice.status === "Paid") trigger.setAttribute("disabled", "")
    trigger.innerHTML = `<button aria-label="Remind ${invoice.customer}">Remind</button>`
    row.append(trigger)
    list.append(row)
  }
  dialog.addEventListener("openchange", (event) => {
    const { value, returnValue } = event.detail
    if (!value) {
      if (returnValue === "send") output.textContent = "Reminder sent"
      return
    }
    const invoice = dialog.api.getPayload()
    root.querySelector("ui-dialog-title")!.textContent = `Remind ${invoice?.customer}`
    root.querySelector("ui-dialog-description")!.textContent =
      `${invoice?.id} for ${invoice?.amount} is due. We'll email the billing contact.`
  })
  root.querySelector("[data-code]")!.addEventListener("click", async () => {
    const { reason, returnValue } = await dialog.api.open({ payload: invoices[2] })
    output.textContent = returnValue === "send" ? "Reminder sent from code" : `Closed with ${reason}`
  })
}

export { mount }
