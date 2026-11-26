// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { Field, FieldControl, FieldLabel } from "../src/field"
import {
  type TextEditorAdapter,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuList,
  TriggerMenuStatus,
  textFieldAdapter,
} from "../src/trigger-menu"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined
afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

function Example() {
  const [editor, setEditor] = React.useState<TextEditorAdapter>()
  return (
    <TriggerMenu editor={editor} triggers={[{ char: "@", items: [] }]}>
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <FieldControl
          render={
            <textarea
              ref={(field) => {
                if (field && editor?.element !== field) {
                  setEditor(textFieldAdapter(field))
                }
              }}
            />
          }
        />
      </Field>
      <TriggerMenuStatus />
      <TriggerMenuContent>
        <TriggerMenuList>{() => null}</TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

test("a trigger menu connected through its editor is named by that field", async () => {
  root = createRoot(document.body.appendChild(document.createElement("div")))
  await React.act(async () => root!.render(<Example />))
  const agent = createAgent()
  expect(agent.snapshot()).toContainEqual(
    expect.objectContaining({ component: "trigger-menu", label: "Notes" })
  )
})
