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
} from "@ui-sdk/react/command"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  commandData,
  commandFixture as f,
  commandOptions,
  runAction,
} from "tests/fixtures/command.ts"
import { longItems } from "tests/fixtures/select.ts"

function Fixture({ data = false }: { data?: boolean }) {
  const { slow, fail, long, highlight, unvalued, ...options } = commandOptions()
  const [action, setAction] = React.useState("")
  const [lastHighlight, setLastHighlight] = React.useState("")
  const [items] = React.useState(() =>
    long ? longItems() : data ? commandData() : undefined
  )
  const onAction = (value: string) => {
    setAction(`action:${value}`)
    return runAction(slow, fail)
  }
  return (
    <div className="fixture">
      <button>Before</button>
      <Command
        {...options}
        className="command"
        items={items}
        onAction={onAction}
        onValueChange={(value, details) =>
          setLastHighlight(`${value}:${details.reason}`)
        }
      >
        <CommandInput className="input" aria-label={f.input} />
        <CommandEmpty className="empty">{f.empty}</CommandEmpty>
        <CommandStatus className="status">
          {(state) => (state.loading ? "Loading…" : "")}
        </CommandStatus>
        <CommandList className="command-list">
          {items ? (
            (state) => (
              <DataCommands items={state.items} highlight={highlight} />
            )
          ) : (
            <>
              <CommandPage>
                {f.groups.map((group, index) => (
                  <React.Fragment key={group.label}>
                    {index > 0 && <CommandSeparator className="separator" />}
                    <CommandGroup>
                      <CommandGroupLabel className="label">
                        {group.label}
                      </CommandGroupLabel>
                      {group.items.map((item) => (
                        <CommandItem
                          key={item.value}
                          className="item"
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
                            <CommandShortcut className="shortcut" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </React.Fragment>
                ))}
              </CommandPage>
              <CommandPage value="theme">
                {f.theme.map((item) => (
                  <CommandItem
                    key={item.value}
                    className="item"
                    value={item.value}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandPage>
            </>
          )}
        </CommandList>
      </Command>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Last highlight">
        {lastHighlight}
      </output>
    </div>
  )
}

// The data's commands, groups and separators, styled like the composed ones.
function DataCommands({
  items,
  highlight,
}: {
  items: CommandData
  highlight?: boolean
}) {
  return items.map((entry, index) => {
    if (typeof entry !== "string" && "type" in entry) {
      if (entry.type === "separator") {
        return (
          <CommandSeparator key={`separator-${index}`} className="separator" />
        )
      }
      return (
        <CommandGroup key={entry.label ?? index}>
          {entry.label && (
            <CommandGroupLabel className="label">
              {entry.label}
            </CommandGroupLabel>
          )}
          <DataCommands items={entry.items} highlight={highlight} />
        </CommandGroup>
      )
    }
    const command: CommandDataItem =
      typeof entry === "string" ? { value: entry, label: entry } : entry
    return (
      <CommandItem
        key={command.value}
        className="item"
        value={command.value}
        label={command.label}
        keywords={command.keywords}
        disabled={command.disabled}
        shortcut={command.shortcut}
      >
        {highlight ? (
          <CommandItemText>{command.label}</CommandItemText>
        ) : (
          command.label
        )}
        {command.shortcut && <CommandShortcut className="shortcut" />}
      </CommandItem>
    )
  })
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
