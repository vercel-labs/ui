import { commandFixture as f } from "tests/fixtures/command.ts"

// A command rendered as a link through as-child.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-command class="command">
        <ui-command-input><input class="input" aria-label="${f.input}" /></ui-command-input>
        <ui-command-list class="command-list">
          <ui-command-item value="docs" as-child><a class="item" href="#docs">Docs</a></ui-command-item>
          ${f.groups[0].items
            .slice(0, 2)
            .map(
              (item) =>
                `<ui-command-item class="item" value="${item.value}">${item.label}</ui-command-item>`
            )
            .join("")}
        </ui-command-list>
      </ui-command>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>`
  await import("@ui-sdk/web/command")
}

export { mount }
