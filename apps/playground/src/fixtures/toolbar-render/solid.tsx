import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/solid/toolbar"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

// How many times each item's content rendered, so specs can check that moving
// focus renders only the items whose tab stop moved. Solid renders content
// once and updates attributes in place, so the React-only check skips here.
const renders: Record<string, number> = {}
;(window as unknown as { __renders: typeof renders }).__renders = renders

const counted = (name: string) => () => {
  renders[name] = (renders[name] ?? 0) + 1
  return name
}

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Toolbar class="toolbar" aria-label="Tools">
        <ToolbarButton
          render={(props) => <span {...props} />}
          onClick={() => setAction("span")}
        >
          {counted("Span tool")}
        </ToolbarButton>
        <ToolbarButton onClick={() => setAction("cut")}>
          {counted("Cut")}
        </ToolbarButton>
        <ToolbarButton onClick={() => setAction("copy")}>
          {counted("Copy")}
        </ToolbarButton>
        <ToolbarSeparator class="rule" render={(props) => <hr {...props} />} />
        <ToolbarButton
          disabled
          class={(state) => (state.disabled ? "is-disabled" : "is-enabled")}
          render={(props) => <a {...props} href="#old" />}
        >
          Old docs
        </ToolbarButton>
      </Toolbar>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
