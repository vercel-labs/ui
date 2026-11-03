import * as React from "react"
import { createTypeahead, definePrimitive, elements, idPart, isTypeaheadKey, labelOf } from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type CommandListState = { command: string }

const commandList = definePrimitive({
  name: "command-list",
  state: (): CommandListState => ({ command: "copy" }),
  api: (context) => {
    const typeahead = createTypeahead()
    return {
      keydown(event: KeyboardEvent) {
        if (!isTypeaheadKey(event)) return
        const commands = elements(context, "command")
        const current = commands.findIndex((command) => command.key === context.store.get().command)
        const next = typeahead(
          event.key,
          commands.map((command) => labelOf(command.el)),
          current,
        )
        if (next === -1) return
        event.preventDefault()
        context.store.set({ command: commands[next].key })
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}>({
      attrs: (state, part) => ({
        role: "listbox",
        tabindex: "0",
        "aria-activedescendant": `${part.id}-${idPart(state.command)}`,
      }),
      on: { keydown: (event, { api }) => api.keydown(event) },
    }),
    command: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "option",
        id: `${part.id}-${idPart(part.key)}`,
        "aria-selected": String(state.command === part.key),
      }),
    }),
  }),
})

const parts = createParts(commandList, { root: "div", command: "div" })

const CommandList = parts.Root

const CommandListCommand = parts.Command

function Example() {
  return (
    <CommandList aria-label="Edit">
      <CommandListCommand value="copy">
        Copy{" "}
        <kbd aria-hidden="true" data-slot="kbd">
          ⌘C
        </kbd>
      </CommandListCommand>
      <CommandListCommand value="cut">
        Cut{" "}
        <kbd aria-hidden="true" data-slot="kbd">
          ⌘X
        </kbd>
      </CommandListCommand>
      <CommandListCommand value="paste">
        Paste{" "}
        <kbd aria-hidden="true" data-slot="kbd">
          ⌘V
        </kbd>
      </CommandListCommand>
      <CommandListCommand value="delete" aria-label="Delete">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" />
        </svg>
      </CommandListCommand>
    </CommandList>
  )
}

export { CommandList, CommandListCommand, commandList, type CommandListState, Example }
