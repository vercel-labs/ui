import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandPage,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
  type CommandData,
  type CommandDataItem,
} from "@ui-sdk/solid/command"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  commandData,
  commandFixture as f,
  commandOptions,
  runAction,
} from "tests/fixtures/command.ts"
import { longItems } from "tests/fixtures/select.ts"

function Fixture(props: { data?: boolean }) {
  const { slow, fail, long, highlight, unvalued, ...options } = commandOptions()
  const [action, setAction] = createSignal("")
  const [lastHighlight, setLastHighlight] = createSignal("")
  const items = long ? longItems() : props.data ? commandData() : undefined
  const onAction = (value: string) => {
    setAction(`action:${value}`)
    return runAction(slow, fail)
  }
  return (
    <div class="fixture">
      <button>Before</button>
      <Command
        {...options}
        class="command"
        items={items}
        onAction={onAction}
        onValueChange={(value, details) =>
          setLastHighlight(`${value}:${details.reason}`)
        }
      >
        <CommandInput class="input" aria-label={f.input} />
        <CommandEmpty class="empty">{f.empty}</CommandEmpty>
        <CommandStatus class="status">
          {(state) => (state.loading ? "Loading…" : "")}
        </CommandStatus>
        <CommandList class="command-list">
          {items ? (
            (state) => (
              <DataCommands items={state.items} highlight={highlight} />
            )
          ) : (
            <>
              <CommandPage>
                <For each={f.groups}>
                  {(group, index) => (
                    <>
                      <Show when={index() > 0}>
                        <CommandSeparator class="separator" />
                      </Show>
                      <CommandGroup>
                        <CommandGroupLabel class="label">
                          {group.label}
                        </CommandGroupLabel>
                        <For each={group.items}>
                          {(item) => (
                            <CommandItem
                              class="item"
                              value={unvalued ? undefined : item.value}
                              keywords={
                                "keywords" in item ? item.keywords : undefined
                              }
                              disabled={
                                "disabled" in item ? item.disabled : undefined
                              }
                              shortcut={
                                "shortcut" in item ? item.shortcut : undefined
                              }
                              page={"page" in item ? item.page : undefined}
                            >
                              {highlight ? (
                                <CommandItemText>{item.label}</CommandItemText>
                              ) : (
                                item.label
                              )}
                              {"shortcut" in item && (
                                <CommandShortcut class="shortcut" />
                              )}
                            </CommandItem>
                          )}
                        </For>
                      </CommandGroup>
                    </>
                  )}
                </For>
              </CommandPage>
              <CommandPage value="theme">
                <For each={f.theme}>
                  {(item) => (
                    <CommandItem class="item" value={item.value}>
                      {item.label}
                    </CommandItem>
                  )}
                </For>
              </CommandPage>
            </>
          )}
        </CommandList>
      </Command>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Last highlight">
        {lastHighlight()}
      </output>
    </div>
  )
}

// The data's commands, groups and separators, styled like the composed ones.
function DataCommands(props: { items: CommandData; highlight?: boolean }) {
  return (
    <For each={props.items}>
      {(entry) => {
        if (typeof entry !== "string" && "type" in entry) {
          if (entry.type === "separator") {
            return <CommandSeparator class="separator" />
          }
          return (
            <CommandGroup>
              <Show when={entry.label}>
                <CommandGroupLabel class="label">
                  {entry.label}
                </CommandGroupLabel>
              </Show>
              <DataCommands items={entry.items} highlight={props.highlight} />
            </CommandGroup>
          )
        }
        const command: CommandDataItem =
          typeof entry === "string" ? { value: entry, label: entry } : entry
        return (
          <CommandItem
            class="item"
            value={command.value}
            label={command.label}
            keywords={command.keywords}
            disabled={command.disabled}
            shortcut={command.shortcut}
          >
            {props.highlight ? (
              <CommandItemText>{command.label}</CommandItemText>
            ) : (
              command.label
            )}
            <Show when={command.shortcut}>
              <CommandShortcut class="shortcut" />
            </Show>
          </CommandItem>
        )
      }}
    </For>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
