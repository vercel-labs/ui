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
} from "@ui-sdk/solid/drawer"
import { isServer, render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  drawerFixture,
  drawerOptions,
  drawerParts,
  exposeDrawerFixture,
  recordDrawer,
} from "tests/fixtures/drawer.ts"

const controller = createDrawerController()

function Fixture() {
  // Read here, not at module level, so the server reads each request's URL,
  // and the window is only touched where there is one.
  if (!isServer) {
    exposeDrawerFixture(controller)
  }
  const parts = drawerParts()
  const [action, setAction] = createSignal("")
  const [more, setMore] = createSignal(false)
  return (
    <div class="fixture">
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
        <Show when={parts.backdrop}>
          <DrawerBackdrop class="drawer-backdrop" />
        </Show>
        <DrawerContent class="drawer">
          <DrawerHandle class="handle" aria-label={drawerFixture.handle} />
          <DrawerTitle class="title">{drawerFixture.title}</DrawerTitle>
          <DrawerDescription class="description">
            {drawerFixture.description}
          </DrawerDescription>
          <Show when={parts.field}>
            <label class="field">
              {drawerFixture.field}
              <input />
            </label>
          </Show>
          <Show when={parts.scroll}>
            <ul
              class="scroll"
              aria-label={drawerFixture.scroll.label}
              tabindex={0}
            >
              <For each={drawerFixture.scroll.items}>
                {(item) => <li>{item}</li>}
              </For>
            </ul>
          </Show>
          <Show when={parts.grow}>
            <button onClick={() => setMore(true)}>
              {drawerFixture.grow.button}
            </button>
            <Show when={more()}>
              <p class="more">{drawerFixture.grow.text}</p>
            </Show>
          </Show>
          <div class="actions">
            <button onClick={() => setAction("submit")}>
              {drawerFixture.action}
            </button>
            <DrawerClose>{drawerFixture.close}</DrawerClose>
          </div>
          <Show when={parts.nested}>
            <Drawer
              onOpenChange={(open, details) =>
                recordDrawer(`nested:${open}:${details.reason}`)
              }
            >
              <DrawerTrigger>{drawerFixture.nested.trigger}</DrawerTrigger>
              <Show when={parts.backdrop}>
                <DrawerBackdrop class="drawer-backdrop" />
              </Show>
              <DrawerContent class="drawer">
                <DrawerTitle class="title">
                  {drawerFixture.nested.title}
                </DrawerTitle>
                <DrawerClose>{drawerFixture.nested.close}</DrawerClose>
              </DrawerContent>
            </Drawer>
          </Show>
        </DrawerContent>
      </Drawer>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.open()}>
        {drawerFixture.controller}
      </button>
      <button onClick={() => setAction("page")}>{drawerFixture.page}</button>
      <Show when={parts.shortcut}>
        <DrawerTrigger
          controller={controller}
          shortcut={drawerFixture.shortcut.keys}
        >
          {drawerFixture.shortcut.trigger} <DrawerShortcut />
        </DrawerTrigger>
      </Show>
      <Show when={parts.outlet}>
        <DrawerOutlet
          controller={controller}
          class="outlet"
          role="region"
          aria-label={drawerFixture.outlet.label}
          keyframes={drawerFixture.outlet.keyframes}
        />
      </Show>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
