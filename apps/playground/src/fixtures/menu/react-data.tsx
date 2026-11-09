import { Menu, MenuTrigger } from "@ui-sdk/react/menu"
import { createMenuController } from "@ui-sdk/core/menu"
import * as React from "react"
import { menuOptions } from "tests/fixtures/page.ts"
import { createRoot } from "react-dom/client"
import { menuData } from "./data"

const controller = createMenuController()

// Counts React commits inside the menu, so specs can check highlight changes skip rendering.
const counter = { commits: 0 }
;(window as unknown as { __menuCommits: typeof counter }).__menuCommits =
  counter

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <React.Profiler id="menu" onRender={() => counter.commits++}>
        <Menu
          items={menuData}
          onAction={setAction}
          controller={controller}
          {...menuOptions()}
        >
          <MenuTrigger>File</MenuTrigger>
        </Menu>
      </React.Profiler>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.open({ focus: "first" })}>
        Open with controller
      </button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
