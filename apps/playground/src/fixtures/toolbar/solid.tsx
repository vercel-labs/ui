import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { NumberInput, NumberInputControl } from "@ui-sdk/solid/number-input"
import { Toggle, ToggleGroup } from "@ui-sdk/solid/toggle"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
  createToolbarController,
} from "@ui-sdk/solid/toolbar"
import { render } from "@solidjs/web"
import type { JSX } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  toolbarFixture as f,
  toolbarLocked,
  toolbarOptions,
} from "tests/fixtures/toolbar.ts"

const controller = createToolbarController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [locked, setLocked] = createSignal(toolbarLocked())
  // Wraps an item in a disabled group while locked, for ?locked.
  const lock = (label: string, item: () => JSX.Element) => (
    <Show when={toolbarLocked()} fallback={item()}>
      <ToolbarGroup aria-label={label} disabled={locked()}>
        {item()}
      </ToolbarGroup>
    </Show>
  )
  const group = (
    { label, defaultValue, items }: typeof f.style,
    multiple: boolean
  ) => (
    <ToggleGroup
      class="toggle-group"
      aria-label={label}
      multiple={multiple}
      defaultValue={defaultValue}
      onValueChange={(value) =>
        setAction(`${label}: ${value.join(", ") || "none"}`)
      }
    >
      <For each={items}>
        {(item: (typeof f.style.items)[number]) => (
          <Toggle
            class="toggle"
            value={item.value}
            disabled={"disabled" in item && item.disabled}
          >
            {item.label}
          </Toggle>
        )}
      </For>
    </ToggleGroup>
  )

  return (
    <div class="fixture">
      <button>Before</button>
      <Toolbar
        class="toolbar"
        aria-label={f.label}
        controller={controller}
        {...toolbarOptions()}
      >
        {lock("Locked style", () => group(f.style, true))}
        <ToolbarSeparator />
        {group(f.alignment, false)}
        <ToolbarSeparator />
        <Menu onAction={(value) => setAction(`font: ${value}`)}>
          <ToolbarButton render={(props) => <MenuTrigger {...props} />}>
            {f.font.trigger}
          </ToolbarButton>
          <MenuContent class="popup">
            <For each={f.font.items}>
              {(item) => (
                <MenuItem class="item" value={item}>
                  {item}
                </MenuItem>
              )}
            </For>
          </MenuContent>
        </Menu>
        <NumberInput
          defaultValue={f.size.defaultValue}
          onValueChange={(value) => setAction(`size: ${value}`)}
        >
          <ToolbarInput
            render={(props) => (
              <NumberInputControl {...props} aria-label={f.size.label} />
            )}
          />
        </NumberInput>
        <ToolbarInput
          aria-label={f.comment.label}
          value={f.comment.defaultValue}
        />
        <ToolbarGroup
          class="toolbar-group"
          aria-label={f.history.label}
          disabled={toolbarLocked() && locked()}
        >
          <For each={f.history.items}>
            {(item) => (
              <ToolbarButton
                disabled={"disabled" in item && item.disabled}
                onClick={() => setAction(item.label.toLowerCase())}
              >
                {item.label}
              </ToolbarButton>
            )}
          </For>
        </ToolbarGroup>
        {lock("Locked proofing", () => (
          <Toggle
            class="toggle"
            onPressedChange={(pressed) =>
              setAction(`spellcheck: ${pressed ? "on" : "off"}`)
            }
          >
            {f.spellcheck.label}
          </Toggle>
        ))}
        {lock("Locked help", () => (
          <ToolbarLink href={f.help.href}>{f.help.label}</ToolbarLink>
        ))}
      </Toolbar>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.focus()}>Focus toolbar</button>
      <button onClick={() => setLocked(false)}>Unlock</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
