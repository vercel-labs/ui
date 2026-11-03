import * as React from "react"
import { definePrimitive, isFocusFromKeyboard, sourceOf } from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type SaveBarState = { savedWith: string | null; hint: boolean }

const saveBar = definePrimitive({
  name: "save-bar",
  state: (): SaveBarState => ({ savedWith: null, hint: false }),
  api: (context) => ({
    save: (event?: Event) => context.store.set({ savedWith: sourceOf(event) }),
    focus: () => context.store.set({ hint: isFocusFromKeyboard() }),
    blur: () => context.store.set({ hint: false }),
  }),
  slots: (slot) => ({
    save: slot({
      attrs: () => ({ type: "button" }),
      press: ({ api }, event) => api.save(event),
      on: { focus: (_event, { api }) => api.focus(), blur: (_event, { api }) => api.blur() },
    }),
    hint: slot({ present: (state) => state.hint }),
    status: slot<{}, { savedWith: string | null }>({
      state: (state) => ({ savedWith: state.savedWith }),
      attrs: () => ({ role: "status" }),
    }),
  }),
})

const parts = createParts(saveBar, { save: "button", hint: "span", status: "p" })

const SaveBar = parts.Root

const SaveBarButton = parts.Save

const SaveBarHint = parts.Hint

const SaveBarStatus = parts.Status

function Example() {
  return (
    <SaveBar>
      <div data-slot="stack">
        <div data-slot="row">
          <SaveBarButton data-variant="solid">Save</SaveBarButton>
          <SaveBarHint>Enter or Space saves</SaveBarHint>
        </div>
        <SaveBarStatus>
          {({ savedWith }) =>
            savedWith ? `Saved with ${savedWith}` : "Click Save, or Tab to it and press Enter."
          }
        </SaveBarStatus>
      </div>
    </SaveBar>
  )
}

export { Example, saveBar, SaveBar, SaveBarButton, SaveBarHint, SaveBarStatus, type SaveBarState }
