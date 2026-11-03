"use client"

import {
  type TextEditorAdapter,
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
  textFieldAdapter,
} from "@ui-sdk/react/trigger-menu"
import * as React from "react"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function Example() {
  const [editor, setEditor] = React.useState<TextEditorAdapter>()
  return (
    <TriggerMenu editor={editor} triggers={[{ char: "@", items: people }]}>
      <textarea
        ref={(field) => {
          if (field && editor?.element !== field) {
            setEditor(textFieldAdapter(field))
          }
        }}
        aria-label="Notes"
        placeholder="A textarea you render yourself"
      />
      <TriggerMenuContent>
        <TriggerMenuList>
          {(state) =>
            (state.items as TriggerMenuDataItem[]).map((item) => (
              <TriggerMenuItem
                key={item.value}
                value={item.value}
                label={item.label}
                disabled={item.disabled}
              >
                {item.label}
              </TriggerMenuItem>
            ))
          }
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

export { Example }
