import "@ui-sdk/web/meter"
import { meterFixture } from "tests/fixtures/meter.ts"

const { storage, requests, disk, score } = meterFixture

const parts = (label: string) => `
  <ui-meter-label>${label}</ui-meter-label>
  <ui-meter-value class="gauge-value"></ui-meter-value>
  <ui-meter-track class="gauge-track"><ui-meter-indicator class="gauge-indicator"></ui-meter-indicator></ui-meter-track>
`

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-meter id="storage" class="gauge" value="${storage.value}">${parts(storage.label)}</ui-meter>
      <ui-meter id="requests" class="gauge" value="${requests.value}" max="${requests.max}">${parts(requests.label)}</ui-meter>
      <ui-meter id="disk" class="gauge" value="${disk.value}" max="${disk.max}">${parts(disk.label)}</ui-meter>
      <ui-meter class="gauge" value="${score.value}" min="${score.min}" max="${score.max}">${parts(score.label)}</ui-meter>
      <button id="fill">Fill</button>
      <button id="reset">Reset</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  const element = (id: string) =>
    root.querySelector<HTMLElementTagNameMap["ui-meter"]>(`#${id}`)!
  element("requests").getValueLabel = requests.valueLabel
  element("disk").format = disk.format
  const set = (value: number) =>
    element("storage").setAttribute("value", String(value))
  root
    .querySelector("#fill")!
    .addEventListener("click", () =>
      set(Number(element("storage").getAttribute("value")) + storage.step)
    )
  root
    .querySelector("#reset")!
    .addEventListener("click", () => set(storage.value))
}

export { mount }
