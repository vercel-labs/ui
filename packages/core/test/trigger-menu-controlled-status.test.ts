import { afterEach, expect, test } from "vitest"
import {
  triggerMenu,
  type TriggerMenuOptions,
} from "../src/components/trigger-menu/trigger-menu"
import { setAnnouncer } from "../src/foundation/platform/announce"
import { fakeEditor } from "./fake-editor"
import { kept } from "./kept"

afterEach(() => setAnnouncer(undefined))

test("a menu with open controlled says nothing about suggestions as it closes", () => {
  const said: string[] = []
  setAnnouncer((text) => said.push(text))
  const editor = fakeEditor()
  const requested: boolean[] = []
  const options: TriggerMenuOptions & { id: string } = {
    id: "menu",
    editor,
    triggers: [{ char: "@", items: ["Ada", "Alan", "Bob"] }],
    open: false,
    onOpenChange: (open) => requested.push(open),
  }
  const instance = kept(triggerMenu(options))
  editor.type("@a")
  instance.setOptions({ ...options, open: true })
  editor.moveCaret(0)
  instance.setOptions({ ...options, open: false })
  expect(requested).toEqual([true, false])
  expect(said.filter(Boolean)).toEqual([])
})
