import { createMenuController } from "@ui-sdk/core/menu"
import { Menu, MenuTrigger } from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { menuOptions } from "tests/fixtures/page.ts"
import { menuData } from "./data"

const controller = createMenuController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const options = menuOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu
        items={menuData}
        onAction={setAction}
        controller={controller}
        {...options}
      >
        <MenuTrigger>File</MenuTrigger>
      </Menu>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.open({ focus: "first" })}>
        Open with controller
      </button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
