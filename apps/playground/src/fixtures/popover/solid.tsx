import { createPopoverController } from "@ui-sdk/core/popover"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  popoverContentOptions,
  popoverFixture,
  popoverOptions,
  popoverParts,
} from "tests/fixtures/popover.ts"

const controller = createPopoverController()

function Fixture() {
  // Read here, not at module level, so the server reads each request's URL.
  const parts = popoverParts()
  const [action, setAction] = createSignal("")
  const [triggerShown, setTriggerShown] = createSignal(true)
  const options = popoverOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Popover controller={controller} {...options}>
        <Show when={triggerShown()}>
          <PopoverTrigger
            shortcut={
              parts.shortcut ? popoverFixture.shortcut.trigger : undefined
            }
          >
            {popoverFixture.trigger}
            <Show when={parts.shortcut}>
              <PopoverShortcut />
            </Show>
          </PopoverTrigger>
        </Show>
        <PopoverContent
          class="popup"
          sideOffset={8}
          {...popoverContentOptions()}
        >
          <PopoverArrow class="arrow" />
          <Show when={parts.title}>
            <PopoverTitle class="title">{popoverFixture.title}</PopoverTitle>
          </Show>
          <PopoverDescription class="description">
            {popoverFixture.description}
          </PopoverDescription>
          <label class="field">
            {popoverFixture.field}
            <input value={popoverFixture.defaultValue} />
          </label>
          <div class="actions">
            <button onClick={() => setAction("save")}>
              {popoverFixture.action}
              <Show when={parts.shortcut}>
                <PopoverShortcut shortcut={popoverFixture.shortcut.save} />
              </Show>
            </button>
            <PopoverClose>{popoverFixture.close}</PopoverClose>
            <Show when={parts.removable}>
              <button onClick={() => setTriggerShown(false)}>
                {popoverFixture.remove}
              </button>
            </Show>
          </div>
          <Show when={parts.menu}>
            <Menu container={options.container} onAction={setAction}>
              <MenuTrigger>{popoverFixture.menu.trigger}</MenuTrigger>
              <MenuContent class="popup">
                <For each={popoverFixture.menu.items}>
                  {(item) => (
                    <MenuItem value={item.value} class="item">
                      {item.label}
                    </MenuItem>
                  )}
                </For>
              </MenuContent>
            </Menu>
          </Show>
          <Show when={parts.nested}>
            <Popover>
              <PopoverTrigger>{popoverFixture.nested.trigger}</PopoverTrigger>
              <PopoverContent class="popup">
                <PopoverTitle class="title">
                  {popoverFixture.nested.title}
                </PopoverTitle>
                <button onClick={() => setAction("archive")}>
                  {popoverFixture.nested.action}
                </button>
              </PopoverContent>
            </Popover>
          </Show>
        </PopoverContent>
      </Popover>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.open()}>Open with controller</button>
      <Show when={parts.shortcut}>
        <PopoverTrigger
          controller={controller}
          shortcut={popoverFixture.shortcut.remote.keys}
        >
          {popoverFixture.shortcut.remote.trigger}
          <PopoverShortcut />
        </PopoverTrigger>
      </Show>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
