import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOutlet,
  DrawerShortcut,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  drawerFixture,
  drawerOptions,
  drawerParts,
  exposeDrawerFixture,
  recordDrawer,
} from "tests/fixtures/drawer.ts"

const controller = createDrawerController()
exposeDrawerFixture(controller)

const parts = drawerParts()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [more, setMore] = React.useState(false)
  return (
    <div className="fixture">
      <button>Before</button>
      <Drawer
        controller={controller}
        {...drawerOptions()}
        onOpenChange={(open, details) =>
          recordDrawer(`drawer:${open}:${details.reason}`)
        }
        onSnapPointChange={(snapPoint, details) =>
          recordDrawer(`${snapPoint}:${details.reason}`)
        }
        onDismissAttempt={(details) =>
          recordDrawer(`attempt:${details.reason}`)
        }
      >
        <DrawerTrigger>{drawerFixture.trigger}</DrawerTrigger>
        {parts.backdrop && <DrawerBackdrop className="drawer-backdrop" />}
        <DrawerContent className="drawer">
          <DrawerHandle className="handle" aria-label={drawerFixture.handle} />
          <DrawerTitle className="title">{drawerFixture.title}</DrawerTitle>
          <DrawerDescription className="description">
            {drawerFixture.description}
          </DrawerDescription>
          {parts.field && (
            <label className="field">
              {drawerFixture.field}
              <input />
            </label>
          )}
          {parts.scroll && (
            <ul
              className="scroll"
              aria-label={drawerFixture.scroll.label}
              tabIndex={0}
            >
              {drawerFixture.scroll.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {parts.grow && (
            <>
              <button onClick={() => setMore(true)}>
                {drawerFixture.grow.button}
              </button>
              {more && <p className="more">{drawerFixture.grow.text}</p>}
            </>
          )}
          <div className="actions">
            <button onClick={() => setAction("submit")}>
              {drawerFixture.action}
            </button>
            <DrawerClose>{drawerFixture.close}</DrawerClose>
          </div>
          {parts.nested && (
            <Drawer
              onOpenChange={(open, details) =>
                recordDrawer(`nested:${open}:${details.reason}`)
              }
            >
              <DrawerTrigger>{drawerFixture.nested.trigger}</DrawerTrigger>
              {parts.backdrop && <DrawerBackdrop className="drawer-backdrop" />}
              <DrawerContent className="drawer">
                <DrawerTitle className="title">
                  {drawerFixture.nested.title}
                </DrawerTitle>
                <DrawerClose>{drawerFixture.nested.close}</DrawerClose>
              </DrawerContent>
            </Drawer>
          )}
        </DrawerContent>
      </Drawer>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.open()}>
        {drawerFixture.controller}
      </button>
      <button onClick={() => setAction("page")}>{drawerFixture.page}</button>
      {parts.shortcut && (
        <DrawerTrigger
          controller={controller}
          shortcut={drawerFixture.shortcut.keys}
        >
          {drawerFixture.shortcut.trigger} <DrawerShortcut />
        </DrawerTrigger>
      )}
      {parts.outlet && (
        <DrawerOutlet
          controller={controller}
          className="outlet"
          role="region"
          aria-label={drawerFixture.outlet.label}
          keyframes={drawerFixture.outlet.keyframes}
        />
      )}
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

export { Fixture, mount }
