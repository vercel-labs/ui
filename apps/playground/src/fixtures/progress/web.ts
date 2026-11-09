import "@ui-sdk/web/progress"
import { progressFixture } from "tests/fixtures/progress.ts"

const { upload, loading, files, disk } = progressFixture

const parts = (label: string) => `
  <ui-progress-label>${label}</ui-progress-label>
  <ui-progress-value class="gauge-value"></ui-progress-value>
  <ui-progress-track class="gauge-track"><ui-progress-indicator class="gauge-indicator"></ui-progress-indicator></ui-progress-track>
`

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-progress id="upload" class="gauge" value="${upload.value}">${parts(upload.label)}</ui-progress>
      <ui-progress class="gauge">${parts(loading.label)}</ui-progress>
      <ui-progress id="files" class="gauge" value="${files.value}" max="${files.max}">${parts(files.label)}</ui-progress>
      <ui-progress id="disk" class="gauge" value="${disk.value}" max="${disk.max}">${parts(disk.label)}</ui-progress>
      <button id="advance">Advance</button>
      <button id="restart">Restart</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  const element = (id: string) =>
    root.querySelector<HTMLElement & Record<string, unknown>>(`#${id}`)!
  element("files").getValueLabel = (value: number) => files.valueLabel(value)
  element("disk").format = disk.format
  const adjust = (id: string, change: (value: number) => number) => {
    const el = element(id)
    el.setAttribute("value", String(change(Number(el.getAttribute("value")))))
  }
  element("advance").addEventListener("click", () =>
    adjust("upload", (value) => Math.min(100, value + upload.step))
  )
  element("restart").addEventListener("click", () =>
    adjust("upload", () => upload.value)
  )
}

export { mount }
