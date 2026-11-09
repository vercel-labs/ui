import { listboxAction, listboxFixture as f } from "tests/fixtures/listbox.ts"

// An item rendered as a link through as-child.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-listbox class="listbox" activation="manual" aria-label="${f.label}">
        <ui-listbox-item value="docs" as-child><a class="item" href="#docs">Docs</a></ui-listbox-item>
        <ui-listbox-item class="item" value="star">Star</ui-listbox-item>
        ${f.items
          .slice(0, 3)
          .map(
            (item) =>
              `<ui-listbox-item class="item" value="${item.value}">${item.label}</ui-listbox-item>`
          )
          .join("")}
      </ui-listbox>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>`
  root.querySelector("ui-listbox")!.addEventListener("valuechange", (event) => {
    root.querySelector("output")!.textContent = listboxAction(
      (event as CustomEvent<{ value: unknown }>).detail.value
    )
  })
  await import("@ui-sdk/web/listbox")
}

export { mount }
