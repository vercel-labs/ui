import { numberInputFixture as f, numberInputOptions, serialize } from "tests/fixtures/number-input.ts"

function markup(options: ReturnType<typeof numberInputOptions>) {
  const shared = [
    options.wheel && " wheel",
    options.disabled && " disabled",
    options.readOnly && " read-only",
  ]
    .filter(Boolean)
    .join("")
  const quantity = options.quantity === null ? "" : ` default-value="${options.quantity}"`
  const amountMin = options.amountMin === undefined ? "" : ` min="${options.amountMin}"`
  const group = (item: { decrement: string; increment: string }, incrementDisabled = false) => {
    const onElement = incrementDisabled && !options.disabledIncrementButton ? " disabled" : ""
    const onButton = incrementDisabled && options.disabledIncrementButton ? " disabled" : ""
    return `
    <ui-number-input-group class="number-input-group">
      <ui-number-input-decrement><button aria-label="${item.decrement}">−</button></ui-number-input-decrement>
      <ui-number-input-control><input class="number-input-control" /></ui-number-input-control>
      <ui-number-input-increment${onElement}><button aria-label="${item.increment}"${onButton}>+</button></ui-number-input-increment>
    </ui-number-input-group>`
  }
  return `
    <div class="fixture">
      <button>Before</button>
      <form class="form" aria-label="${f.formLabel}">
        <ui-field name="${f.quantity.name}">
          <ui-field-label>${f.quantity.label}</ui-field-label>
          <ui-number-input min="${f.quantity.min}" max="${f.quantity.max}"${quantity}${shared}${options.required ? " required" : ""}>
            ${group(f.quantity, options.disabledIncrement)}
          </ui-number-input>
          <ui-field-description>${f.quantity.description}</ui-field-description>
        </ui-field>

        <ui-field>
          <ui-field-label>${f.amount.label}</ui-field-label>
          <ui-number-input id="amount" name="${f.amount.name}" default-value="${f.amount.defaultValue}" step="${f.amount.step}"${amountMin}${shared}>
            <ui-number-input-scrub-area class="number-input-scrub">${f.amount.scrub}</ui-number-input-scrub-area>
            ${group(f.amount)}
          </ui-number-input>
        </ui-field>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Committed"></output>
      <output role="status" aria-label="Submitted" id="submitted"></output>
    </div>
  `
}

async function mount(root: HTMLElement) {
  const options = numberInputOptions()
  const template = document.createElement("template")
  template.innerHTML = markup(options)
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  for (const input of template.content.querySelectorAll("ui-number-input"))
    input.setAttribute("locale", options.locale)
  root.replaceChildren(template.content)
  // Rich options are properties, set before the elements upgrade.
  const amount = root.querySelector("#amount") as HTMLElement & { format?: Intl.NumberFormatOptions }
  amount.format = { style: "currency", currency: f.amount.currency }
  await import("@ui-sdk/web/number-input")
  await import("@ui-sdk/web/field")

  const form = root.querySelector("form")!
  const action = root.querySelector<HTMLOutputElement>('output[aria-label="Last action"]')!
  const committed = root.querySelector<HTMLOutputElement>('output[aria-label="Committed"]')!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("#submitted")!.textContent = serialize(form)
  })

  // Callbacks are DOM events: valuechange as it changes, valuecommit when it settles.
  root.addEventListener(
    "valuechange",
    (event) => {
      const name = (event.target as HTMLElement).getAttribute("name") ?? ""
      if (options.cancel === name) return event.preventDefault()
      action.textContent = `${name}:${String((event as CustomEvent<{ value: number | null }>).detail.value)}`
    },
    { capture: true },
  )
  root.addEventListener(
    "valuecommit",
    (event) => {
      const name = (event.target as HTMLElement).getAttribute("name") ?? ""
      const value = String((event as CustomEvent<{ value: number | null }>).detail.value)
      committed.textContent = [committed.textContent, `${name}:${value}`].filter(Boolean).join(" ")
    },
    { capture: true },
  )
}

export { mount }
