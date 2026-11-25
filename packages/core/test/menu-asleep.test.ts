// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest"
import { menu } from "../src/components/menu/menu"
import { attrs, bind, handlers } from "../src/foundation/kernel/part"

Element.prototype.getAnimations ??= () => []
Element.prototype.scrollIntoView ??= () => {}

afterEach(() => document.body.replaceChildren())

function closedMenu(options: Partial<Parameters<typeof menu>[0]> = {}) {
  const instance = menu({ id: "file", ...options })
  const el = document.body.appendChild(document.createElement("button"))
  el.textContent = "File"
  const trigger = instance.part("trigger", { id: "file-trigger" })
  bind(trigger, el)
  return { instance, trigger, el }
}

const asleep = (instance: ReturnType<typeof menu>) =>
  (instance.part("trigger", { id: "file-trigger" }) as { api?: unknown })
    .api === undefined

describe("a closed menu", () => {
  test("renders its trigger and opens from a press, though it builds nothing until then", () => {
    const { instance, trigger } = closedMenu()
    expect(asleep(instance)).toBe(true)
    expect(attrs(trigger)).toMatchObject({
      "aria-haspopup": "menu",
      "aria-expanded": "false",
    })
    handlers(trigger).click!(new MouseEvent("click"))
    expect(asleep(instance)).toBe(false)
    expect(instance.get().open).toBe(true)
  })

  test("runs its trigger's shortcut and its items' shortcuts while it sleeps", () => {
    const onAction = vi.fn()
    const { instance, trigger } = closedMenu({
      items: [{ value: "save", label: "Save", shortcut: "mod+s" }],
      onAction,
    })
    trigger.props = { id: "file-trigger", shortcut: "mod+f" }
    const press = (key: string) =>
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key,
          code: `Key${key.toUpperCase()}`,
          ctrlKey: true,
        })
      )
    press("s")
    expect(onAction).toHaveBeenCalledTimes(1)
    press("f")
    expect(instance.get().open).toBe(true)
  })

  test("stays awake when it starts open", () => {
    expect(asleep(closedMenu({ defaultOpen: true }).instance)).toBe(false)
  })
})
