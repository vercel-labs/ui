import { bindScrollPicker } from "@ui-sdk/core"
import "@ui-sdk/web/listbox"
import { pickerFixtures } from "tests/fixtures/listbox-picker.ts"

const picker = ({
  label,
  orientation,
  defaultValue,
  items,
}: (typeof pickerFixtures)[number]) => `
  <ui-listbox class="picker" aria-label="${label}" orientation="${orientation}" scroll-into-view="false" default-value="${defaultValue}">
    ${items
      .map(
        (item) =>
          `<ui-listbox-item class="picker-item" value="${item.value}"${item.disabled ? " disabled" : ""}>${item.value}</ui-listbox-item>`
      )
      .join("")}
  </ui-listbox>
  <output role="status" aria-label="${label} changes"></output>`

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      ${pickerFixtures.map(picker).join("")}
      <button>After</button>
    </div>`
  for (const fixture of pickerFixtures) {
    const listbox = root.querySelector<HTMLElement & { value: unknown }>(
      `ui-listbox[aria-label="${fixture.label}"]`
    )!
    const output = root.querySelector(
      `output[aria-label="${fixture.label} changes"]`
    )!
    const changes: string[] = []
    const log = (value: unknown) => {
      changes.push(String(value))
      output.textContent = changes.join(",")
    }
    listbox.addEventListener("valuechange", (event) =>
      log((event as CustomEvent<{ value: unknown }>).detail.value)
    )
    bindScrollPicker(listbox, {
      onSelect: (index) => {
        listbox.value = fixture.items[index].value
        log(listbox.value)
      },
    })
  }
}

export { mount }
