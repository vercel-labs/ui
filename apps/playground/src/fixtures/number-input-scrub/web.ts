import { numberInputScrubFixture as f } from "tests/fixtures/number-input-scrub.ts"

// Web components have no render functions, so the table header cell is left
// out. The toolbar's scrub area names its number input with `for`.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <div role="toolbar" aria-label="${f.toolbarLabel}" class="row">
        <ui-number-input-scrub-area for="${f.id}" class="number-input-scrub">${f.toolbarScrub}</ui-number-input-scrub-area>
      </div>
      <ui-number-input id="${f.id}" default-value="${f.defaultValue}" min="${f.min}" max="${f.max}" locale="en-US">
        <ui-number-input-group class="number-input-group">
          <ui-number-input-scrub-area class="number-input-scrub">${f.letterScrub}</ui-number-input-scrub-area>
          <ui-number-input-control><input aria-label="${f.label}" class="number-input-control" /></ui-number-input-control>
        </ui-number-input-group>
        <div><div><div>
          <ui-number-input-scrub-area class="number-input-scrub">${f.nestedScrub}</ui-number-input-scrub-area>
        </div></div></div>
      </ui-number-input>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Committed"></output>
    </div>
  `
  await import("@ui-sdk/web/number-input")
  const action = root.querySelector<HTMLOutputElement>(
    'output[aria-label="Last action"]'
  )!
  const committed = root.querySelector<HTMLOutputElement>(
    'output[aria-label="Committed"]'
  )!
  root.addEventListener(
    "valuechange",
    (event) => {
      action.textContent = String(
        (event as CustomEvent<{ value: number | null }>).detail.value
      )
    },
    { capture: true }
  )
  root.addEventListener(
    "valuecommit",
    (event) => {
      const value = String(
        (event as CustomEvent<{ value: number | null }>).detail.value
      )
      committed.textContent = [committed.textContent, value]
        .filter(Boolean)
        .join(" ")
    },
    { capture: true }
  )
}

export { mount }
