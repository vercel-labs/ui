// @vitest-environment jsdom
// The agent bridge: what an agent sees of the page's components, and what its
// calls change, through the public entry. `bind` from the kernel stands in
// for an adapter.
import { afterEach, describe, expect, test, vi } from "vitest"
import { accordion } from "../src/components/accordion/accordion"
import { autocomplete } from "../src/components/autocomplete/autocomplete"
import {
  createAgent,
  registerTools,
  type AgentComponent,
  type AgentStep,
} from "../src/page/agent/agent"
import { button } from "../src/components/button/button"
import { checkbox } from "../src/components/checkbox/checkbox"
import { collapsible } from "../src/components/collapsible/collapsible"
import { combobox } from "../src/components/combobox/combobox"
import { dateInput } from "../src/components/date-input/date-input"
import type { DateInputState } from "../src/components/date-input/date-input-parts"
import { datePicker } from "../src/components/date-picker/date-picker"
import { dialog } from "../src/components/dialog/dialog"
import { input, inputGroup, textarea } from "../src/components/input/input"
import { listbox } from "../src/components/listbox/listbox-root"
import { menu } from "../src/components/menu/menu"
import { numberInput } from "../src/components/number-input/number-input"
import { pagination } from "../src/components/pagination/pagination"
import { passwordInput } from "../src/components/password-input/password-input"
import { progress } from "../src/components/progress/progress"
import { attrs, bind, partState } from "../src/foundation/kernel/part"
import { definePrimitive } from "../src/foundation/kernel/primitive"
import { select } from "../src/components/select/select"
import { separator } from "../src/components/separator/separator"
import { slider } from "../src/components/slider/slider"
import { tabs } from "../src/components/tabs/tabs"
import { tokenInput } from "../src/components/token-input/token-input"
import { toastRegion } from "../src/components/toast/toast"
import { createToaster } from "../src/components/toast/toaster"
import { toolbar } from "../src/components/toolbar/toolbar"
import { createOverlays } from "../src/page/overlays/overlays"
import { tree } from "../src/components/tree/tree"
import { triggerMenu } from "../src/components/trigger-menu/trigger-menu"
import { tooltip } from "../src/components/tooltip/tooltip"

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

// A checkbox in a label, bound the way an adapter binds it.
function mountCheckbox(
  options: Parameters<typeof checkbox>[0],
  text = "Accept the terms"
) {
  const instance = checkbox(options)
  const label = document.createElement("label")
  const el = document.createElement("button")
  label.append(el, text)
  document.body.append(label)
  const unbind = bind(instance.part("root"), el)
  cleanups.push(() => {
    unbind()
    instance.destroy()
  })
  return instance
}

describe("agent", () => {
  test("lists the components on the page with their label, state and actions", () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms" })
    // Made and never mounted, like a render a framework threw away.
    checkbox({ id: "spare" })
    const screen = agent.snapshot()
    expect(screen).toHaveLength(1)
    expect(screen[0]).toMatchObject({
      component: "checkbox",
      label: "Accept the terms",
      checked: false,
    })
    expect(screen[0].actions).toContain("setChecked")
    expect(screen[0].actions).not.toContain("focus")
  })

  test("a step changes the component, reports the source agent and returns what changed", async () => {
    const agent = createAgent()
    const onCheckedChange = vi.fn()
    mountCheckbox({ id: "terms", onCheckedChange })
    const [{ ref }] = agent.snapshot()
    const outcome = await agent.act({
      steps: [{ ref, action: "setChecked", args: [true] }],
    })
    expect(onCheckedChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ source: "agent" })
    )
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        {
          ref,
          changes: [
            {
              component: "checkbox",
              label: "Accept the terms",
              key: "checked",
              value: true,
            },
          ],
        },
      ],
      values: { [`${ref} Accept the terms`]: true },
    })
  })

  test("a step whose value the option's kind doesn't take fails and changes nothing", async () => {
    const agent = createAgent()
    const instance = mountCheckbox({ id: "terms" })
    const outcome = await agent.act({
      steps: [
        {
          ref: "Accept the terms",
          action: "setChecked",
          args: ["not-a-boolean"],
        },
      ],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: {
        message: expect.stringContaining(
          'takes true or false, not "not-a-boolean"'
        ),
      },
    })
    expect(instance.get().checked).toBe(false)
  })

  test("a value its parent takes a moment later did take", async () => {
    const agent = createAgent()
    const options = { id: "terms", checked: false }
    const instance = mountCheckbox({
      ...options,
      onCheckedChange: (checked) =>
        setTimeout(() => instance.setOptions({ ...options, checked }), 100),
    })
    const outcome = await agent.act({
      steps: [{ ref: "Accept the terms", action: "setChecked", args: [true] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().checked).toBe(true)
  })

  test("a number option given text takes the number", async () => {
    const agent = createAgent()
    const instance = pagination({ id: "pages", pageCount: 10 })
    const root = document.createElement("nav")
    root.setAttribute("aria-label", "Results")
    document.body.append(root)
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    await agent.act({
      steps: [{ ref: "Results", action: "setPage", args: ["3"] }],
    })
    expect(instance.get().page).toBe(3)
  })

  test("the app can refuse a step in its change callback, since it knows the agent asked", async () => {
    const agent = createAgent()
    mountCheckbox({
      id: "terms",
      onCheckedChange: (_checked, details) => {
        if (details.source === "agent") {
          details.cancel()
        }
      },
    })
    const saved = mountCheckbox({ id: "saved" }, "Saved")
    const [{ ref }] = agent.snapshot()
    const outcome = await agent.act({
      steps: [
        { ref, action: "setChecked", args: [true] },
        { ref: "Saved", action: "setChecked", args: [true] },
      ],
    })
    expect(outcome.error).toMatchObject({
      step: 0,
      message: expect.stringMatching(
        /^setChecked on Accept the terms \(c\d+\) didn't take: it is still false\./
      ),
    })
    expect(saved.get().checked).toBe(false)
  })

  test("a set whose component unmounts in its change callback takes", async () => {
    const agent = createAgent()
    let unmount = () => {}
    const instance = checkbox({
      id: "todo",
      checked: false,
      onCheckedChange: () => queueMicrotask(unmount),
    })
    const label = document.createElement("label")
    const el = document.createElement("button")
    label.append(el, "Water the plants")
    document.body.append(label)
    const unbind = bind(instance.part("root"), el)
    unmount = () => {
      unmount = () => {}
      unbind()
      instance.destroy()
      label.remove()
    }
    cleanups.push(() => unmount())
    const outcome = await agent.act({
      steps: [{ ref: "Water the plants", action: "setChecked", args: [true] }],
    })
    expect(outcome.error).toBeUndefined()
  })

  test("a set to the value a field already holds, or one it formats, takes", async () => {
    const agent = createAgent()
    const instance = input({
      id: "code",
      defaultValue: "ATLAS",
      onValueChange: (_value, details) => details.cancel(),
    })
    const el = document.createElement("input")
    el.setAttribute("aria-label", "Code")
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Code", action: "setValue", args: ["atlas "] }],
    })
    expect(outcome.ok).toBe(true)
  })

  test("an empty field lists its placeholder, and a filled one doesn't", async () => {
    const agent = createAgent()
    const instance = input({ id: "invite" })
    const el = document.createElement("input")
    el.setAttribute("aria-label", "Invite")
    el.setAttribute("placeholder", "Name or email")
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const field = () =>
      agent.snapshot().find((component) => component.label === "Invite")
    expect(field()).toMatchObject({ placeholder: "Name or email" })
    await agent.act({
      steps: [
        { ref: "Invite", action: "setValue", args: ["jane@example.com"] },
      ],
    })
    expect(field()).toMatchObject({ value: "jane@example.com" })
    expect(field()).not.toHaveProperty("placeholder")
  })

  test("an empty date field's segment dashes aren't its placeholder", () => {
    const agent = createAgent()
    const instance = dateInput({ id: "due" })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Due")
    const { segments } = partState(instance.part("root")) as DateInputState
    cleanups.push(
      bind(instance.part("root"), root),
      ...segments
        .filter((segment) => segment.editable)
        .map((segment) => {
          const part = instance.part("segment", { segment, id: segment.key })
          const el = root.appendChild(document.createElement("input"))
          el.placeholder = String(attrs(part).placeholder)
          return bind(part, el)
        }),
      () => instance.destroy(),
      () => root.remove()
    )
    const due = agent.snapshot().find((component) => component.label === "Due")
    expect(root.querySelector("input")?.placeholder).toBe("––")
    expect(due).toBeDefined()
    expect(due).not.toHaveProperty("placeholder")
  })

  test("a step on what an open modal covers is refused, with what is open", async () => {
    const agent = createAgent()
    const terms = mountCheckbox({ id: "terms" })
    const main = document.body.appendChild(document.createElement("main"))
    main.append(document.querySelector("label")!)
    main.setAttribute("inert", "")
    const outcome = await agent.act({
      steps: [{ ref: "Accept the terms", action: "setChecked", args: [true] }],
    })
    expect(outcome.error?.message).toMatch(
      /^Accept the terms \(c\d+\) is behind what is open\. Finish that or close it first\.$/
    )
    expect(terms.get().checked).toBe(false)
  })

  test("allow refuses an action before it runs", async () => {
    const allow = vi.fn(() => false)
    const agent = createAgent({ allow })
    const onCheckedChange = vi.fn()
    mountCheckbox({ id: "terms", onCheckedChange })
    const [{ ref }] = agent.snapshot()
    const outcome = await agent.act({
      steps: [{ ref, action: "setChecked", args: [true] }],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: { step: 0, message: `The app refused setChecked on ${ref}.` },
    })
    expect(allow).toHaveBeenCalledWith(
      {
        ref,
        component: "checkbox",
        label: "Accept the terms",
        action: "setChecked",
        args: [true],
      },
      { signal: expect.any(AbortSignal) }
    )
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  test("a disabled component takes no actions, and a call says what it takes", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms", disabled: true })
    const [component] = agent.snapshot()
    expect(component).toMatchObject({ disabled: true, actions: [] })
    const outcome = await agent.act({
      steps: [{ ref: component.ref, action: "setChecked", args: [true] }],
    })
    expect(outcome.error?.message).toContain("takes no setChecked now")
  })

  test("a component inside a disabled fieldset takes no actions", async () => {
    const agent = createAgent()
    const instance = select({ id: "visibility", items: ["Private", "Public"] })
    const fieldset = document.createElement("fieldset")
    fieldset.disabled = true
    const trigger = document.createElement("button")
    trigger.setAttribute("aria-label", "Visibility")
    const input = document.createElement("input")
    fieldset.append(trigger, input)
    document.body.append(fieldset)
    cleanups.push(
      bind(instance.part("trigger"), trigger),
      bind(instance.part("form-input"), input),
      () => instance.destroy()
    )
    await Promise.resolve()
    const [component] = agent.snapshot()
    expect(component).toMatchObject({
      label: "Visibility",
      disabled: true,
      actions: [],
    })
    const outcome = await agent.act({
      steps: [{ ref: "Visibility", action: "setValue", args: ["Public"] }],
    })
    expect(outcome.error?.message).toContain("takes no setValue now")
  })

  test.each([
    ["input", input],
    ["textarea", textarea],
  ] as const)(
    "a %s inside a disabled fieldset takes no actions",
    async (tag, make) => {
      const agent = createAgent()
      const instance = make({ id: "note" })
      const fieldset = document.createElement("fieldset")
      fieldset.disabled = true
      const el = document.createElement(tag)
      el.setAttribute("aria-label", "Note")
      fieldset.append(el)
      document.body.append(fieldset)
      cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
      await Promise.resolve()
      const [component] = agent.snapshot()
      expect(component).toMatchObject({
        label: "Note",
        disabled: true,
        actions: [],
      })
      const outcome = await agent.act({
        steps: [{ ref: "Note", action: "setValue", args: ["Changed"] }],
      })
      expect(outcome.error?.message).toContain("takes no setValue now")
      expect(instance.get().value).not.toBe("Changed")
    }
  )

  test.each([
    ["input", input],
    ["textarea", textarea],
  ] as const)(
    "a read-only %s takes no actions, and a required one says so",
    async (tag, make) => {
      const agent = createAgent()
      const instance = make({ id: "note", defaultValue: "Kept" })
      const el = document.createElement(tag)
      el.setAttribute("aria-label", "Note")
      document.body.append(el)
      cleanups.push(
        bind(instance.part("root", { readOnly: true, required: true }), el),
        () => instance.destroy()
      )
      const [component] = agent.snapshot()
      expect(component).toMatchObject({
        label: "Note",
        disabled: true,
        required: true,
        actions: [],
      })
      const outcome = await agent.act({
        steps: [{ ref: "Note", action: "setValue", args: ["Changed"] }],
      })
      expect(outcome.error?.message).toContain("takes no setValue now")
      expect(instance.get().value).toBe("Kept")
    }
  )

  test("a date picker whose input a disabled fieldset disables takes no actions", async () => {
    const agent = createAgent()
    const instance = datePicker({ id: "due", defaultMonth: "2026-11" })
    const fieldset = document.body.appendChild(
      document.createElement("fieldset")
    )
    fieldset.disabled = true
    const input = fieldset.appendChild(document.createElement("input"))
    input.setAttribute("aria-label", "Due")
    cleanups.push(bind(instance.part("input"), input), () => instance.destroy())
    await Promise.resolve()
    const component = agent
      .snapshot()
      .find((found) => found.component === "date-picker")
    expect(component).toMatchObject({
      label: "Due",
      disabled: true,
      actions: [],
    })
    const outcome = await agent.act({
      steps: [{ ref: "Due", action: "setValue", args: ["2030-01-02"] }],
    })
    expect(outcome.error?.message).toContain("takes no setValue now")
  })

  test("a date picker whose keyed input a disabled fieldset disables takes no actions, as adapters bind it", async () => {
    const agent = createAgent()
    const instance = datePicker({ id: "start-date", defaultMonth: "2026-11" })
    const fieldset = document.body.appendChild(
      document.createElement("fieldset")
    )
    fieldset.disabled = true
    const input = fieldset.appendChild(document.createElement("input"))
    input.setAttribute("aria-label", "Start")
    cleanups.push(
      bind(instance.part("input", { id: "start", end: false }), input),
      () => instance.destroy()
    )
    await Promise.resolve()
    const component = agent
      .snapshot()
      .find((found) => found.component === "date-picker")
    expect(component).toMatchObject({
      label: "Start",
      disabled: true,
      actions: [],
    })
  })

  test("a number input at its max still takes actions, though its increment button is disabled", async () => {
    const agent = createAgent()
    const instance = numberInput({ id: "seats", defaultValue: 10, max: 10 })
    const field = document.body.appendChild(document.createElement("input"))
    field.setAttribute("aria-label", "Seats")
    const increment = document.body.appendChild(
      document.createElement("button")
    )
    cleanups.push(
      bind(instance.part("control"), field),
      bind(instance.part("increment"), increment),
      () => instance.destroy()
    )
    await Promise.resolve()
    increment.disabled = true
    const component = agent.snapshot().find((found) => found.label === "Seats")
    expect(component?.disabled).toBeUndefined()
    expect(component?.actions).toContain("setValue")
  })

  test("a number input takes its field's name, not the name of a step button before it", async () => {
    const agent = createAgent()
    const instance = numberInput({ id: "people", defaultValue: 2 })
    const label = document.body.appendChild(document.createElement("label"))
    label.id = "people-label"
    label.textContent = "People"
    const decrement = document.body.appendChild(
      document.createElement("button")
    )
    decrement.setAttribute("aria-label", "One fewer person")
    const field = document.body.appendChild(document.createElement("input"))
    field.setAttribute("aria-labelledby", "people-label")
    cleanups.push(
      bind(instance.part("decrement"), decrement),
      bind(instance.part("control"), field),
      () => instance.destroy()
    )
    const shown = agent.snapshot().filter((found) => !found.offPage)
    expect(shown.map((found) => found.label)).toEqual(["People"])
    const outcome = await agent.act({
      steps: [{ ref: "People", action: "setValue", args: [4] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toBe(4)
  })

  test("a component that leaves the page stays in the snapshot as off the page, with the state it had", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms", defaultChecked: true }, "Send a weekly digest")
    const [{ ref }] = agent.snapshot()
    cleanups.forEach((cleanup) => cleanup())
    cleanups = []
    expect(agent.snapshot().find((component) => component.ref === ref)).toEqual(
      {
        ref,
        component: "checkbox",
        offPage: true,
        label: "Send a weekly digest",
        checked: true,
        actions: [],
      }
    )
    const outcome = await agent.act({
      steps: [{ ref, action: "setChecked", args: [true] }],
    })
    expect(outcome.error?.message).toContain("No component")
  })

  test("a password field isn't kept once it leaves the page", () => {
    const agent = createAgent()
    const instance = input({ id: "password", defaultValue: "hunter2" })
    const el = document.createElement("input")
    el.type = "password"
    el.setAttribute("aria-label", "Password")
    document.body.append(el)
    const unbind = bind(instance.part("root"), el)
    const password = () =>
      agent.snapshot().filter((component) => component.label === "Password")
    expect(password()).toHaveLength(1)
    unbind()
    instance.destroy()
    expect(password()).toEqual([])
  })

  test("a toast's action and close are pressed by their text, a link action too", async () => {
    // jsdom has neither, and a toast measures itself as it binds.
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      }
    )
    Element.prototype.getAnimations ??= () => []
    cleanups.push(() => vi.unstubAllGlobals())
    const agent = createAgent()
    const toaster = createToaster({ overlays: createOverlays() })
    const region = toastRegion({ id: "toasts", toaster })
    cleanups.push(region.api.internal.connect(), () => region.destroy())
    const undone: string[] = []
    // Shows a toast, presses one of its buttons by text, and takes it off the page.
    async function pressed(title: string, text: string, href?: string) {
      const id = toaster(title, { duration: Infinity })
      const root = document.body.appendChild(document.createElement("div"))
      const unbinds = [bind(region.part("root", { id }), root)]
      for (const slot of ["action", "close"] as const) {
        const link = slot === "action" && href
        const el = root.appendChild(
          document.createElement(link ? "a" : "button")
        )
        el.textContent = slot === "action" ? "Undo" : "Dismiss"
        if (link) {
          el.setAttribute("href", href)
        }
        const part = region.part(slot, {
          id: `${id}-${slot}`,
          toast: id,
          ...(slot === "action" && { onAction: () => undone.push(title) }),
        })
        unbinds.push(bind(part, el))
      }
      const seen = agent.snapshot().find((found) => found.component === "toast")
      await agent.act({
        steps: [{ ref: "toast", action: "press", args: [text] }],
      })
      unbinds.forEach((unbind) => unbind())
      root.remove()
      return seen
    }
    expect(await pressed("Deleted", "Undo")).toMatchObject({
      buttons: ["Undo", "Dismiss"],
      actions: ["pause", "press"],
    })
    expect(await pressed("Archived", "Undo", "#archive")).toMatchObject({
      buttons: ["Undo", "Dismiss"],
    })
    expect(undone).toEqual(["Deleted", "Archived"])
    await pressed("Saved", "Dismiss")
    expect(undone).toEqual(["Deleted", "Archived"])
    expect(toaster.toasts()).toEqual([])
  })

  test("a toolbar's buttons are pressed by their text", async () => {
    const agent = createAgent()
    const instance = toolbar({ id: "format" })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Format")
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    const pressed: string[] = []
    for (const text of ["Bold", "Italic"]) {
      const button = root.appendChild(document.createElement("button"))
      button.textContent = text
      button.addEventListener("click", () => pressed.push(text))
      cleanups.push(bind(instance.part("button", { id: text }), button))
    }
    const component = agent.snapshot().find((found) => found.label === "Format")
    expect(component).toMatchObject({
      buttons: ["Bold", "Italic"],
      actions: ["press"],
    })
    const outcome = await agent.act({
      steps: [{ ref: "Format", action: "press", args: ["Italic"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(pressed).toEqual(["Italic"])
  })

  test("a password's value never reaches the agent, even while it's shown", async () => {
    const agent = createAgent()
    const instance = passwordInput({ id: "secret", defaultVisible: true })
    const root = document.createElement("div")
    const el = document.createElement("input")
    el.setAttribute("aria-label", "Password")
    root.append(el)
    document.body.append(root)
    cleanups.push(
      bind(instance.part("root"), root),
      bind(instance.part("control"), el),
      () => instance.destroy()
    )
    expect(el.type).toBe("text")
    const [component] = agent.snapshot()
    const outcome = await agent.act({
      steps: [{ ref: component.ref, action: "setValue", args: ["swordfish"] }],
    })
    expect(instance.get().value).toBe("swordfish")
    expect(JSON.stringify(outcome)).not.toContain("swordfish")
    const guess = await agent.act({
      steps: [{ ref: component.ref, action: "expect", args: ["swordfish"] }],
    })
    expect(guess.error?.message).toMatch(
      / is private, so expect can't check it\.$/
    )
    expect(agent.snapshot()[0]).toMatchObject({
      component: "password-input",
      value: "[redacted]",
    })
  })

  test("how a private field shows isn't redacted: a password's visible and a list's open", async () => {
    const agent = createAgent()
    const password = passwordInput({ id: "secret", defaultValue: "hunter2" })
    const root = document.body.appendChild(document.createElement("div"))
    const el = root.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", "Password")
    const plan = select({ id: "plan", items: ["Free", "Pro"] })
    const region = document.body.appendChild(document.createElement("div"))
    region.setAttribute("data-agent-secret", "")
    const trigger = region.appendChild(document.createElement("button"))
    trigger.setAttribute("aria-label", "Plan")
    cleanups.push(
      bind(password.part("root"), root),
      bind(password.part("control"), el),
      bind(plan.part("trigger"), trigger),
      () => password.destroy(),
      () => plan.destroy(),
      () => root.remove(),
      () => region.remove()
    )
    const read = (label: string) =>
      agent.snapshot().find((component) => component.label === label)
    expect(read("Password")).toMatchObject({
      value: "[redacted]",
      visible: false,
    })
    expect(read("Plan")).toMatchObject({ open: false })
    const outcome = await agent.act({
      steps: [
        { ref: "Password", action: "setVisible", args: [true] },
        { ref: "Plan", action: "setOpen", args: [true] },
      ],
    })
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        { changes: [{ key: "visible", value: true }] },
        { changes: [{ key: "open", value: true }] },
      ],
    })
    expect(read("Password")).toMatchObject({
      value: "[redacted]",
      visible: true,
    })
    expect(read("Plan")).toMatchObject({ open: true })
    expect(JSON.stringify(outcome)).not.toContain("hunter2")
  })

  test("registerTools registers the three methods as WebMCP tools, and unregisters them", async () => {
    const tools = new Map<
      string,
      { annotations: object; execute: (input: object) => unknown }
    >()
    const registerTool = vi.fn(
      async (
        tool: {
          name: string
          annotations: object
          execute: (input: object) => unknown
        },
        { signal }: { signal: AbortSignal }
      ) => {
        tools.set(tool.name, tool)
        signal.addEventListener("abort", () => tools.delete(tool.name))
      }
    )
    Object.assign(document, { modelContext: { registerTool } })
    const agent = createAgent()
    const instance = mountCheckbox({ id: "digest" }, "Weekly digest")
    const asked: string[] = []
    const remove = registerTools(agent, {
      allow: (step) => {
        asked.push(`${step.action} ${step.args[0]}`)
        return step.args[0] !== false
      },
    })
    expect([...tools.keys()]).toEqual(["act", "query", "snapshot"])
    expect(tools.get("snapshot")?.annotations).toEqual({
      readOnlyHint: true,
      untrustedContentHint: true,
      consequentialHint: false,
    })
    expect(tools.get("act")?.annotations).toEqual({
      readOnlyHint: false,
      untrustedContentHint: true,
      consequentialHint: true,
    })
    await tools.get("act")?.execute({
      steps: [{ ref: "Weekly digest", action: "setChecked", args: [true] }],
    })
    expect(instance.get().checked).toBe(true)
    // Its `allow` decides every step the browser's agent asks for.
    expect(
      await tools.get("act")?.execute({
        steps: [{ ref: "Weekly digest", action: "setChecked", args: [false] }],
      })
    ).toMatchObject({
      ok: false,
      error: { message: expect.stringContaining("The app refused setChecked") },
    })
    expect(instance.get().checked).toBe(true)
    expect(asked).toEqual(["setChecked true", "setChecked false"])
    // The agent's own calls don't ask it.
    await agent.act({
      steps: [{ ref: "Weekly digest", action: "setChecked", args: [false] }],
    })
    expect(instance.get().checked).toBe(false)
    expect(asked).toHaveLength(2)
    // Without one, it refuses to register.
    expect(() => registerTools(agent, {} as never)).toThrow(
      "registerTools needs an `allow`"
    )
    // Each tool is the method of the same name.
    expect(await tools.get("snapshot")?.execute({})).toEqual(agent.snapshot())
    expect(await tools.get("query")?.execute({ within: "Nothing" })).toEqual({
      error: expect.stringContaining('No component "Nothing"'),
    })
    remove()
    expect(tools.size).toBe(0)
    delete (document as { modelContext?: unknown }).modelContext
    // Without WebMCP it does nothing.
    expect(() => registerTools(agent, { allow: () => true })()).not.toThrow()
  })

  function mountRegion(
    items: { value: string; label: string; disabled?: boolean }[],
    onValueChange = vi.fn()
  ) {
    const instance = select({ id: "region", items, onValueChange })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Region")
    document.body.append(el)
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    return instance
  }

  test("an expect step checks a value or its item's label, changes nothing, and stops the call when it differs", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    const region = mountRegion(
      [
        { value: "fra", label: "Frankfurt" },
        { value: "sin", label: "Singapore" },
      ],
      onValueChange
    )
    const outcome = await agent.act({
      steps: [
        { ref: "Region", action: "setValue", args: ["Singapore"] },
        { ref: "Region", action: "expect", args: ["Singapore"] },
        { ref: "Region", action: "expect", args: ["sin"] },
        { ref: "Region", action: "expect", args: ["Frankfurt"] },
        { ref: "Region", action: "setValue", args: ["Frankfurt"] },
      ],
    })
    expect(outcome.error?.step).toBe(3)
    expect(outcome.error?.message).toMatch(
      /^Region \(c\d+\) is "sin", not "Frankfurt"\. The steps before this one stay done\. Send it again with the step after it, 2 steps in one call\.$/
    )
    expect(region.get().value).toBe("sin")
    expect(onValueChange).toHaveBeenCalledTimes(1)
    const unsaid = await agent.act({
      steps: [{ ref: "Region", action: "expect" }],
    })
    expect(unsaid.error?.message).toMatch(
      /^expect on "Region" needs what to check, as "args": \[value\]\. No step ran\.$/
    )
  })

  test("setValue refuses an item a select doesn't have, and lists its items", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    mountRegion(
      [
        { value: "fra", label: "Frankfurt" },
        { value: "sin", label: "Singapore" },
      ],
      onValueChange
    )
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Tokyo"] }],
    })
    expect(outcome.error?.message).toMatch(
      /^No item "Tokyo" in Region \(c\d+\)\. Its items: Frankfurt, Singapore\.$/
    )
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test("setValue names an item of a select whose values are numbers by its label", async () => {
    const agent = createAgent()
    const instance = select({
      id: "project",
      items: [
        { value: 1, label: "Mobile app" },
        { value: 2, label: "Website" },
      ],
      defaultValue: 1,
    })
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Project")
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const byLabel = await agent.act({
      steps: [{ ref: "Project", action: "setValue", args: ["Website"] }],
    })
    expect(byLabel.ok).toBe(true)
    expect(instance.get().value).toBe(2)
    await agent.act({
      steps: [{ ref: "Project", action: "setValue", args: ["1"] }],
    })
    expect(instance.get().value).toBe(1)
  })

  test("setValue by a label sets that item's own value, not a disabled item's number that reads like it", async () => {
    const agent = createAgent()
    const instance = select({
      id: "seats",
      items: [
        { value: 1, label: "One seat" },
        { value: "02", label: "Two seats" },
        { value: 2, label: "Two seats, sold out", disabled: true },
      ],
      defaultValue: 1,
    })
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Seats")
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Seats", action: "setValue", args: ["Two seats"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toBe("02")
  })

  test("setValue by a label sets that item's own value when the values are objects", async () => {
    const agent = createAgent()
    const ada = { id: 1, name: "Ada" }
    const grace = { id: 2, name: "Grace" }
    const instance = select({
      id: "owner",
      items: [
        { value: ada, label: "Ada" },
        { value: grace, label: "Grace" },
      ],
    })
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Owner")
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Owner", action: "setValue", args: ["Ada"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toBe(ada)
  })

  test("setValue by a label refuses a disabled item of a select with its own keys", async () => {
    const agent = createAgent()
    const instance = select({
      id: "plan",
      items: [
        { value: 1, label: "Free" },
        { value: 2, label: "Pro" },
        { value: 3, label: "Team", disabled: true },
      ],
      itemToValue: (value: number) => `plan-${value}`,
      defaultValue: 1,
    })
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Plan")
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const disabled = await agent.act({
      steps: [{ ref: "Plan", action: "setValue", args: ["Team"] }],
    })
    expect(disabled.error?.message).toMatch(
      / in Plan \(c\d+\) is disabled now\.$/
    )
    expect(instance.get().value).toBe(1)
    const enabled = await agent.act({
      steps: [{ ref: "Plan", action: "setValue", args: ["Pro"] }],
    })
    expect(enabled.ok, enabled.error?.message).toBe(true)
    expect(instance.get().value).toBe(2)
  })

  function mountCombobox(
    options: Parameters<typeof combobox>[0],
    label: string
  ) {
    const instance = combobox(options)
    const el = document.body.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", label)
    cleanups.push(bind(instance.part("input"), el), () => instance.destroy())
    return instance
  }

  test("a combobox refuses a value that isn't in its list, unless it allows custom values", async () => {
    const agent = createAgent()
    const items = [
      { value: "fra", label: "Frankfurt" },
      { value: "sin", label: "Singapore" },
    ]
    const region = mountCombobox({ id: "region", items }, "Region")
    const refused = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Tokyo"] }],
    })
    expect(refused.error?.message).toMatch(
      /^No item "Tokyo" in Region \(c\d+\)\. Its items: Frankfurt, Singapore\.$/
    )
    expect(region.get().value).toBeNull()

    const city = mountCombobox(
      { id: "city", items, allowCustomValue: true },
      "City"
    )
    const custom = await agent.act({
      steps: [{ ref: "City", action: "setValue", args: ["Tokyo"] }],
    })
    expect(custom.ok, custom.error?.message).toBe(true)
    expect(city.get().value).toBe("Tokyo")

    const stops = mountCombobox(
      { id: "stops", items, multiple: true, defaultValue: ["ber"] },
      "Stops"
    )
    const kept = await agent.act({
      steps: [{ ref: "Stops", action: "setValue", args: [["ber", "sin"]] }],
    })
    expect(kept.ok, kept.error?.message).toBe(true)
    expect(stops.get().value).toEqual(["ber", "sin"])
    const unknown = await agent.act({
      steps: [{ ref: "Stops", action: "setValue", args: [["ber", "tok"]] }],
    })
    expect(unknown.error?.message).toMatch(/^No item "tok" in Stops/)
  })

  test("a combobox takes an item it shows while its query is empty, by its value or its label", async () => {
    const agent = createAgent()
    const region = mountCombobox(
      {
        id: "region",
        items: [{ value: "fra", label: "Frankfurt" }],
        emptyItems: [
          { value: "fra", label: "Frankfurt" },
          { value: "tok", label: "Tokyo" },
        ],
      },
      "Region"
    )
    const [found] = (await agent.query({ within: "Region" })) as {
      items: unknown[]
    }[]
    expect(found.items).toEqual([
      { value: "fra", label: "Frankfurt" },
      { value: "tok", label: "Tokyo" },
    ])
    for (const text of ["tok", "fra", "Tokyo"]) {
      const outcome = await agent.act({
        steps: [{ ref: "Region", action: "setValue", args: [text] }],
      })
      expect(outcome.ok, outcome.error?.message).toBe(true)
    }
    expect(region.get().value).toBe("tok")
  })

  test("a combobox or select whose data has no items refuses any value", async () => {
    const agent = createAgent()
    const region = mountCombobox(
      { id: "region", items: [], filter: false },
      "Region"
    )
    const stops = mountCombobox(
      { id: "stops", items: [], multiple: true },
      "Stops"
    )
    const plan = select({ id: "plan", items: [] })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.setAttribute("aria-label", "Plan")
    cleanups.push(bind(plan.part("trigger"), trigger), () => plan.destroy())
    for (const [ref, value] of [
      ["Region", "Tokyo"],
      ["Stops", ["tok"]],
      ["Plan", "Pro"],
    ] as const) {
      const outcome = await agent.act({
        steps: [{ ref, action: "setValue", args: [value] }],
      })
      expect(outcome.error?.message).toMatch(
        new RegExp(`^No item "${value}" in ${ref} `)
      )
    }
    expect(region.get().value).toBeNull()
    expect(stops.get().value).toEqual([])
    expect(plan.get().value).toBeNull()
  })

  test("a combobox that renders its own items and shows none refuses a value, unless it allows custom values", async () => {
    const agent = createAgent()
    const region = mountCombobox({ id: "region", defaultOpen: true }, "Region")
    const refused = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Tokyo"] }],
    })
    expect(refused.error?.message).toMatch(
      /^No item "Tokyo" in Region \(c\d+\)\. Its items: none\.$/
    )
    expect(region.get().value).toBeNull()
    const stops = mountCombobox(
      { id: "stops", defaultOpen: true, multiple: true },
      "Stops"
    )
    const list = await agent.act({
      steps: [{ ref: "Stops", action: "setValue", args: [["tok"]] }],
    })
    expect(list.error?.message).toMatch(/^No item "tok" in Stops /)
    expect(stops.get().value).toEqual([])
    const city = mountCombobox(
      { id: "city", defaultOpen: true, allowCustomValue: true },
      "City"
    )
    const taken = await agent.act({
      steps: [{ ref: "City", action: "setValue", args: ["Tokyo"] }],
    })
    expect(taken.ok, taken.error?.message).toBe(true)
    expect(city.get().value).toBe("Tokyo")
  })

  test("a combobox takes the value it holds, even one its list no longer has", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    const region = mountCombobox(
      {
        id: "region",
        items: [{ value: "fra", label: "Frankfurt" }],
        defaultValue: "ber",
        onValueChange,
      },
      "Region"
    )
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["ber"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(region.get().value).toBe("ber")
    const other = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["tok"] }],
    })
    expect(other.error?.message).toMatch(/^No item "tok" in Region/)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test("setValue takes labels in a list of values, like a multiple combobox's", async () => {
    const agent = createAgent()
    const instance = combobox({
      id: "watchers",
      multiple: true,
      items: [
        { value: "theo", label: "Theo Laurent" },
        { value: "ana", label: "Ana Ruiz" },
      ],
    })
    const el = document.body.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", "Watchers")
    cleanups.push(bind(instance.part("input"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [
        {
          ref: "Watchers",
          action: "setValue",
          args: [["Theo Laurent", "ana"]],
        },
      ],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toEqual(["theo", "ana"])
  })

  test("setValue takes one value or label for a list, like a multiple combobox's", async () => {
    const agent = createAgent()
    const instance = combobox({
      id: "watchers",
      multiple: true,
      items: [
        { value: "theo", label: "Theo Laurent" },
        { value: "ana", label: "Ana Ruiz" },
      ],
    })
    const el = document.body.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", "Watchers")
    cleanups.push(bind(instance.part("input"), el), () => instance.destroy())
    for (const [text, value] of [
      ["ana", ["ana"]],
      ["Theo Laurent", ["theo"]],
    ] as const) {
      const outcome = await agent.act({
        steps: [{ ref: "Watchers", action: "setValue", args: [text] }],
      })
      expect(outcome.ok, outcome.error?.message).toBe(true)
      expect(instance.get().value).toEqual(value)
    }
  })

  test("setValue reads a token input's text as tokens, not as a list of one", async () => {
    const agent = createAgent()
    const instance = tokenInput({ id: "prompt" })
    const el = document.body.appendChild(document.createElement("div"))
    el.setAttribute("aria-label", "Prompt")
    cleanups.push(bind(instance.part("editor"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [
        {
          ref: "Prompt",
          action: "setValue",
          args: ["Ask [@Ada](mention:ada)"],
        },
      ],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.api.getValue()).toMatchObject([
      "Ask ",
      { type: "mention", label: "Ada" },
    ])
  })

  test("setValue refuses a disabled item, by its label or its value, as a person can't choose it", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    mountRegion(
      [
        { value: "fra", label: "Frankfurt", disabled: true },
        { value: "sin", label: "Singapore" },
      ],
      onValueChange
    )
    for (const args of [["Frankfurt"], ["fra"]]) {
      const outcome = await agent.act({
        steps: [{ ref: "Region", action: "setValue", args }],
      })
      expect(outcome.error?.message).toMatch(
        /^"Frankfurt" in Region \(c\d+\) is disabled now\.$/
      )
    }
    expect(onValueChange).not.toHaveBeenCalled()
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Singapore"] }],
    })
    expect(outcome.ok).toBe(true)
  })

  test("setValue compares object values by their contents, not as text", async () => {
    const agent = createAgent()
    const instance = select({
      id: "city",
      items: [
        { value: { id: "fra" }, label: "Frankfurt", disabled: true },
        { value: { id: "tyo" }, label: "Tokyo" },
      ],
      itemToValue: (value: { id: string }) => value.id,
    })
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "City")
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const enabled = await agent.act({
      steps: [{ ref: "City", action: "setValue", args: [{ id: "tyo" }] }],
    })
    expect(enabled.ok).toBe(true)
    expect(instance.get().value).toEqual({ id: "tyo" })
    const refused = await agent.act({
      steps: [{ ref: "City", action: "setValue", args: [{ id: "fra" }] }],
    })
    expect(refused.ok).toBe(false)
    expect(instance.get().value).toEqual({ id: "tyo" })
  })

  test("setValue keys object values the way the select does, so other fields can't pass a disabled item", async () => {
    const agent = createAgent()
    const instance = select({
      id: "city",
      items: [
        { value: { id: 2, name: "B" }, label: "B", disabled: true },
        { value: { id: 1, name: "A" }, label: "A" },
      ],
      itemToValue: (value: { id: number }) => String(value.id),
    })
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "City")
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [
        { ref: "City", action: "setValue", args: [{ id: 2, name: "x" }] },
      ],
    })
    expect(outcome.ok).toBe(false)
    expect(instance.get().value).toBeNull()
  })

  const methods = [
    { id: "standard", name: "Standard" },
    { id: "express", name: "Express" },
  ]
  const methodKey = (method: { id: string }) => method.id

  // Items with object values, keyed the way an adapter keys them.
  function mountMethods(
    instance: {
      api: { internal: { keyOf: (value: unknown) => string } }
      part: (slot: "item", props: { id: string; value: unknown }) => unknown
    },
    parent: Element = document.body
  ) {
    for (const method of methods) {
      const item = parent.appendChild(document.createElement("div"))
      item.textContent = method.name
      cleanups.push(
        bind(
          instance.part("item", {
            id: instance.api.internal.keyOf(method),
            value: method,
          }) as Parameters<typeof bind>[0],
          item
        )
      )
    }
  }

  test("setValue by an item's key or label sets the item's own object value in a select", async () => {
    const agent = createAgent()
    const instance = select({ id: "shipping", itemToValue: methodKey })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.setAttribute("aria-label", "Shipping")
    cleanups.push(bind(instance.part("trigger"), trigger), () =>
      instance.destroy()
    )
    mountMethods(instance)
    for (const [named, held] of [
      ["express", methods[1]],
      ["Standard", methods[0]],
    ] as const) {
      const outcome = await agent.act({
        steps: [{ ref: "Shipping", action: "setValue", args: [named] }],
      })
      expect(outcome.ok, outcome.error?.message).toBe(true)
      expect(instance.get().value).toBe(held)
    }
  })

  test("setValue by an item's key sets the item's own object value in a combobox", async () => {
    const agent = createAgent()
    const instance = combobox({
      id: "method",
      itemToValue: methodKey,
      itemToLabel: (method: { name: string }) => method.name,
    })
    const field = document.body.appendChild(document.createElement("input"))
    field.setAttribute("aria-label", "Method")
    cleanups.push(bind(instance.part("input"), field), () => instance.destroy())
    mountMethods(instance)
    const outcome = await agent.act({
      steps: [{ ref: "Method", action: "setValue", args: ["express"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toBe(methods[1])
    expect(field.value).toBe("Express")
  })

  test("setValue by keys and labels sets each item's own object value in a multiple listbox", async () => {
    const agent = createAgent()
    const instance = listbox({
      id: "methods",
      multiple: true,
      itemToValue: methodKey,
    })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Methods")
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    mountMethods(instance, root)
    expect(
      agent.snapshot().find(({ label }) => label === "Methods")?.items
    ).toEqual([
      { value: "standard", label: "Standard" },
      { value: "express", label: "Express" },
    ])
    const outcome = await agent.act({
      steps: [
        { ref: "Methods", action: "setValue", args: [["express", "Standard"]] },
      ],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toEqual([methods[1], methods[0]])
  })

  test("a list whose data holds object values lists each by its key, and setValue by that key sets the object", async () => {
    const agent = createAgent()
    const instance = select({
      id: "carrier",
      items: methods.map((method) => ({ value: method, label: method.name })),
      itemToValue: methodKey,
    })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.setAttribute("aria-label", "Carrier")
    cleanups.push(bind(instance.part("trigger"), trigger), () =>
      instance.destroy()
    )
    expect(
      agent.snapshot().find(({ label }) => label === "Carrier")?.items
    ).toEqual([
      { value: "standard", label: "Standard" },
      { value: "express", label: "Express" },
    ])
    const outcome = await agent.act({
      steps: [{ ref: "Carrier", action: "setValue", args: ["express"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toBe(methods[1])
  })

  test("an item's label puts a space between its blocks, as it reads on the page", async () => {
    const agent = createAgent()
    const instance = listbox({ id: "plan" })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Plan")
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    for (const [value, html] of [
      ["starter", "<div>Starter</div><div>$12</div>"],
      ["team", "<span>Team</span><div><b>$2</b>4</div><span>per seat</span>"],
      ["business", "<span>Busi</span><span>ness</span>"],
    ]) {
      const item = root.appendChild(document.createElement("div"))
      item.innerHTML = html
      cleanups.push(bind(instance.part("item", { value }), item))
    }
    expect(
      agent.snapshot().find(({ label }) => label === "Plan")?.items
    ).toEqual([
      { value: "starter", label: "Starter $12" },
      { value: "team", label: "Team $24 per seat" },
      { value: "business", label: "Business" },
    ])
    const outcome = await agent.act({
      steps: [{ ref: "Plan", action: "setValue", args: ["Starter $12"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toBe("starter")
  })

  test("setValue refuses a disabled option that renders only while its select is open", async () => {
    const agent = createAgent()
    const content = document.body.appendChild(document.createElement("div"))
    const unbindItems: (() => void)[] = []
    const instance: ReturnType<typeof select> = select({
      id: "region",
      onOpenChange: (open) => {
        unbindItems.splice(0).forEach((unbind) => unbind())
        content.replaceChildren()
        if (!open) {
          return
        }
        for (const [value, label, disabled] of [
          ["fra", "Frankfurt", true],
          ["tyo", "Tokyo", false],
        ] as const) {
          const item = content.appendChild(document.createElement("div"))
          item.textContent = label
          unbindItems.push(
            bind(instance.part("item", { value, disabled }), item)
          )
        }
      },
    })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.setAttribute("aria-label", "Region")
    cleanups.push(bind(instance.part("trigger"), trigger), () => {
      unbindItems.forEach((unbind) => unbind())
      instance.destroy()
    })
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Frankfurt"] }],
    })
    expect(outcome.ok).toBe(false)
    expect(instance.get().value).toBeNull()
  })

  function mountRegionWhileOpen(options: { multiple?: boolean } = {}) {
    const content = document.body.appendChild(document.createElement("div"))
    const unbindItems: (() => void)[] = []
    const disabled = { fra: true }
    const instance: ReturnType<typeof select> = select({
      id: "region",
      ...options,
      onOpenChange: (open) => {
        unbindItems.splice(0).forEach((unbind) => unbind())
        content.replaceChildren()
        if (!open) {
          return
        }
        for (const [value, label] of [
          ["fra", "Frankfurt"],
          ["tyo", "Tokyo"],
        ] as const) {
          const item = content.appendChild(document.createElement("div"))
          item.textContent = label
          unbindItems.push(
            bind(
              instance.part("item", {
                value,
                disabled: value === "fra" && disabled.fra,
              }),
              item
            )
          )
        }
      },
    })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.setAttribute("aria-label", "Region")
    cleanups.push(bind(instance.part("trigger"), trigger), () => {
      unbindItems.forEach((unbind) => unbind())
      instance.destroy()
    })
    return { instance, disabled }
  }

  test("setValue refuses a list of values holding a disabled option that renders only while open", async () => {
    const agent = createAgent()
    const { instance } = mountRegionWhileOpen({ multiple: true })
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: [["fra"]] }],
    })
    expect(outcome.ok).toBe(false)
    expect(instance.get().value).toEqual([])
  })

  test("an item enabled after a failed step can be chosen, since disabled items are read anew each step", async () => {
    const agent = createAgent()
    const { instance, disabled } = mountRegionWhileOpen()
    expect(
      (
        await agent.act({
          steps: [{ ref: "Region", action: "setValue", args: ["Nowhere"] }],
        })
      ).ok
    ).toBe(false)
    disabled.fra = false
    instance.api.setOpen(true)
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Frankfurt"] }],
    })
    expect(outcome.error).toBeUndefined()
    expect(instance.get().value).toBe("fra")
  })

  test("opening a select names no item, so a disabled empty placeholder doesn't stop it", async () => {
    const agent = createAgent()
    const instance = mountRegion([
      { value: "", label: "Choose a region", disabled: true },
      { value: "tyo", label: "Tokyo" },
    ])
    expect(
      (
        await agent.act({
          steps: [{ ref: "Region", action: "setValue", args: ["Tokyo"] }],
        })
      ).ok
    ).toBe(true)
    for (const action of ["open", "toggle"]) {
      if (
        typeof (instance.api as Record<string, unknown>)[action] !== "function"
      ) {
        continue
      }
      const outcome = await agent.act({ steps: [{ ref: "Region", action }] })
      expect([action, outcome.error]).toEqual([action, undefined])
      instance.api.setOpen(false)
    }
  })

  test("opening a dialog with a payload opens it once, since a payload names no item", async () => {
    const agent = createAgent()
    const onOpenChange = vi.fn()
    const instance = dialog({ id: "settings", onOpenChange })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.textContent = "Settings"
    cleanups.push(bind(instance.part("trigger"), trigger), () =>
      instance.destroy()
    )
    const outcome = await agent.act({
      steps: [
        { ref: "Settings", action: "open", args: [{ payload: { id: 1 } }] },
      ],
    })
    expect(outcome.error).toBeUndefined()
    expect(onOpenChange.mock.calls.map(([open]) => open)).toEqual([true])
  })

  test("setValue refuses a disabled object-valued option named by its label", async () => {
    const agent = createAgent()
    const instance = select({
      id: "region",
      itemToValue: (value: { id: string }) => value.id,
    })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.setAttribute("aria-label", "Region")
    cleanups.push(bind(instance.part("trigger"), trigger), () =>
      instance.destroy()
    )
    for (const [id, label, disabled] of [
      ["fra", "Frankfurt", true],
      ["tyo", "Tokyo", false],
    ] as const) {
      const item = document.body.appendChild(document.createElement("div"))
      item.textContent = label
      cleanups.push(
        bind(instance.part("item", { value: { id }, disabled }), item)
      )
    }
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Frankfurt"] }],
    })
    expect(outcome.ok).toBe(false)
    expect(instance.get().value).toBeNull()
  })

  test("setValue takes text that matches a disabled suggestion in an autocomplete, as a person can type it", async () => {
    const agent = createAgent()
    const instance = autocomplete({
      id: "city",
      items: ["Berlin", { value: "Cherry", label: "Cherry", disabled: true }],
    })
    const el = document.createElement("input")
    el.setAttribute("aria-label", "City")
    document.body.append(el)
    cleanups.push(bind(instance.part("input"), el), () => instance.destroy())
    await Promise.resolve()
    const outcome = await agent.act({
      steps: [{ ref: "City", action: "setValue", args: ["Cherry"] }],
    })
    expect(outcome.error).toBeUndefined()
    expect(instance.get().value).toBe("Cherry")
  })

  test("setValue takes an item's label ignoring accents and case", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    const instance = mountRegion(
      [{ value: "de", label: "Allemagne" }],
      onValueChange
    )
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["allemagne"] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toBe("de")
  })

  test("a label two items share is refused, with their values", async () => {
    const agent = createAgent()
    mountRegion([
      { value: "fra-1", label: "Frankfurt" },
      { value: "fra-2", label: "Frankfurt" },
    ])
    const outcome = await agent.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Frankfurt"] }],
    })
    expect(outcome.error?.message).toMatch(
      /"Frankfurt" names 2 items in Region \(c\d+\): fra-1, fra-2\./
    )
  })

  test("a name two closed sections share is refused, with the sections, and opening one first finds it", async () => {
    const agent = createAgent()
    // Each open section mounts its own Deploy failures switch, as adapters render an open panel.
    const mounted = new Map<string, ReturnType<typeof mountCheckbox>>()
    const instance = accordion({
      id: "channels",
      onValueChange: (value) => {
        for (const [section, checkbox] of mounted) {
          if (!value.includes(section)) {
            checkbox.destroy()
            mounted.delete(section)
          }
        }
        for (const section of value) {
          if (!mounted.has(section)) {
            mounted.set(
              section,
              mountCheckbox({ id: section }, "Deploy failures")
            )
          }
        }
      },
    })
    for (const [value, text] of [
      ["email", "Email"],
      ["slack", "Slack"],
    ]) {
      const item = document.createElement("div")
      const trigger = document.createElement("button")
      trigger.textContent = text
      item.append(trigger)
      document.body.append(item)
      cleanups.push(
        bind(instance.part("item", { value }), item),
        bind(instance.part("trigger", { value }), trigger)
      )
    }
    cleanups.push(() => instance.destroy())
    const step = { ref: "Deploy failures", action: "setChecked", args: [true] }
    const refused = await agent.act({ steps: [step] })
    expect(refused.error?.message).toBe(
      '"Deploy failures" is in 2 closed sections: Email, Slack. Put the one you mean first, like "Email > Deploy failures".'
    )
    expect(instance.get().value).toEqual([])
    const outcome = await agent.act({
      steps: [{ ref: "accordion", action: "open", args: ["Slack"] }, step],
    })
    expect(outcome.ok).toBe(true)
    expect(mounted.get("slack")?.get().checked).toBe(true)
  })

  test("act finishes in a hidden tab, where the browser runs no frames", async () => {
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true)
    const frame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 0)
    const agent = createAgent()
    mountCheckbox({ id: "terms" })
    const outcome = await agent.act({
      steps: [{ ref: "Accept the terms", action: "setChecked", args: [true] }],
    })
    expect(outcome.ok).toBe(true)
    expect(frame).not.toHaveBeenCalled()
    hidden.mockRestore()
    frame.mockRestore()
  })

  test("registerTools warns when a tool name is taken, and not when the page turns WebMCP off", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const refuse = (name: string) =>
      vi.fn(async () => {
        throw new DOMException("Refused.", name)
      })
    Object.assign(document, {
      modelContext: { registerTool: refuse("InvalidStateError") },
    })
    registerTools(createAgent(), { allow: () => true })
    await vi.waitFor(() => expect(warn).toHaveBeenCalledTimes(3))
    expect(warn.mock.calls[0][0]).toContain(
      "registerTools couldn't register act."
    )
    warn.mockClear()
    const registerTool = refuse("NotAllowedError")
    Object.assign(document, { modelContext: { registerTool } })
    registerTools(createAgent(), { allow: () => true })
    await vi.waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3))
    await new Promise((resolve) => setTimeout(resolve))
    expect(warn).not.toHaveBeenCalled()
    delete (document as { modelContext?: unknown }).modelContext
    warn.mockRestore()
  })
  test("acts run one at a time, so one can't answer the confirm another waits on", async () => {
    let answer = (_yes: boolean) => {}
    const agent = createAgent({
      allow: (step) =>
        step.ref !== "c1" ||
        new Promise<boolean>((resolve) => (answer = resolve)),
    })
    const first = mountCheckbox({ id: "terms" })
    const second = mountCheckbox({ id: "digest" }, "Send a weekly digest")
    const waiting = agent.act({
      steps: [{ ref: "Accept the terms", action: "setChecked", args: [true] }],
    })
    const next = agent.act({
      steps: [
        { ref: "Send a weekly digest", action: "setChecked", args: [true] },
      ],
    })
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(second.get().checked).toBe(false)
    answer(true)
    expect(await waiting).toMatchObject({ ok: true })
    expect(await next).toMatchObject({ ok: true })
    expect([first.get().checked, second.get().checked]).toEqual([true, true])
  })

  test("a tree's items reach inside collapsed branches, and come from paths too", async () => {
    const agent = createAgent()
    const mount = (options: Parameters<typeof tree>[0]) => {
      const instance = tree(options)
      const el = document.createElement("div")
      el.setAttribute("aria-label", options.id)
      document.body.append(el)
      cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
      return instance
    }
    const nested = mount({
      id: "Files",
      items: [
        {
          value: "src",
          label: "src",
          children: [{ value: "src/index.ts", label: "index.ts" }],
        },
        { value: "README.md", label: "README.md" },
      ],
    })
    mount({ id: "Paths", paths: ["src/agent.ts", "README.md"] })
    expect(await agent.query({ within: "Files", text: "index" })).toEqual([
      expect.objectContaining({
        label: "Files",
        items: [{ value: "src/index.ts", label: "index.ts" }],
      }),
    ])
    expect(await agent.query({ within: "Paths", text: "agent" })).toEqual([
      expect.objectContaining({
        items: [expect.objectContaining({ label: "agent.ts" })],
      }),
    ])
    // A label inside a collapsed branch names its node.
    await agent.act({
      steps: [{ ref: "Files", action: "setValue", args: ["index.ts"] }],
    })
    expect(nested.get().value).toBe("src/index.ts")
    // Text that names no node is refused, not stored as a value.
    const refused = await agent.act({
      steps: [{ ref: "Files", action: "setValue", args: ["index"] }],
    })
    expect(refused.error?.message).toContain('No item "index" in Files')
    expect(nested.get().value).toBe("src/index.ts")
  })

  test("a component whose elements are all hidden, like one in a closed dialog, isn't on the page", async () => {
    const agent = createAgent()
    const shown = mountCheckbox({ id: "status-shown" }, "Status")
    mountCheckbox({ id: "status-closed" }, "Status")
    const closed = document.body.appendChild(document.createElement("div"))
    closed.hidden = true
    closed.append(document.body.querySelectorAll("label")[1])
    expect(
      agent.snapshot().filter((component) => component.label === "Status")
    ).toHaveLength(1)
    await agent.act({
      steps: [{ ref: "Status", action: "setChecked", args: [true] }],
    })
    expect(shown.get().checked).toBe(true)
  })

  test("a component in a popup that's animating out, like a menu after a choice, isn't on the page", async () => {
    const agent = createAgent()
    const shown = mountCheckbox({ id: "notes-shown" }, "Release notes")
    mountCheckbox({ id: "notes-leaving" }, "Release notes")
    const leaving = document.body.appendChild(document.createElement("div"))
    leaving.setAttribute("data-ending-style", "")
    leaving.append(document.body.querySelectorAll("label")[1])
    expect(
      agent
        .snapshot()
        .filter((component) => component.label === "Release notes")
    ).toHaveLength(1)
    await agent.act({
      steps: [{ ref: "Release notes", action: "setChecked", args: [true] }],
    })
    expect(shown.get().checked).toBe(true)
  })

  test("a component inside aria-hidden isn't on the page", () => {
    const agent = createAgent()
    mountCheckbox({ id: "shown" }, "Shown")
    mountCheckbox({ id: "decorative" }, "Decorative")
    const hidden = document.body.appendChild(document.createElement("div"))
    hidden.setAttribute("aria-hidden", "true")
    hidden.append(document.body.querySelectorAll("label")[1])
    expect(
      agent
        .snapshot()
        .filter((component) => !component.offPage)
        .map((component) => component.label)
    ).toEqual(["Shown"])
  })

  test("a reading, like a progress bar's value, is in the snapshot", () => {
    const agent = createAgent()
    const instance = progress({ id: "upload", value: 2, max: 4 })
    const el = document.body.appendChild(document.createElement("div"))
    el.setAttribute("aria-label", "Upload")
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    expect(
      agent.snapshot().find((component) => component.label === "Upload")
    ).toMatchObject({
      value: 2,
      max: 4,
    })
  })

  test("a step without a ref or an action fails with a message the model can act on", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms" })
    const noRef = await agent.act({
      steps: [{ action: "press" } as unknown as AgentStep],
    })
    expect(noRef.error).toEqual({
      step: 0,
      message:
        "steps[0] needs a ref: a component's ref from snapshot, or its label. No step ran.",
    })
    const noAction = await agent.act({
      steps: [{ ref: "Accept the terms" } as unknown as AgentStep],
    })
    expect(noAction.error?.message).toBe(
      'steps[0], on "Accept the terms", needs an action, like "press". No step ran.'
    )
  })

  test("a call that isn't { steps } fails before anything runs, and says what act takes", async () => {
    const agent = createAgent()
    const terms = mountCheckbox({ id: "terms" })
    const step = { ref: "Accept the terms", action: "setChecked", args: [true] }
    const act = (input: unknown) => agent.act(input as { steps: AgentStep[] })
    const shape =
      'act takes { "steps": [{ "ref": "…", "action": "…", "args": […] }] }'
    expect(await act(step)).toMatchObject({
      ok: false,
      steps: [],
      error: {
        step: 0,
        message: `${shape}, not a step on its own. No step ran.`,
      },
    })
    expect((await act([step])).error?.message).toBe(
      `${shape}, not a list on its own. No step ran.`
    )
    expect((await act({ actions: [] })).error?.message).toBe(
      `${shape}, not {"actions":[]}. No step ran.`
    )
    expect((await act(null)).error?.message).toBe(
      `${shape}, not null. No step ran.`
    )
    expect((await act({ steps: [] })).error?.message).toBe(
      `${shape}, not {"steps":[]}. No step ran.`
    )
    expect((await act({ steps: [step], dryRun: true })).error?.message).toBe(
      'act takes "steps" and nothing else, not "dryRun". No step ran.'
    )
    expect(terms.get().checked).toBe(false)
  })

  test("a step with a key it doesn't take, or args that aren't a list, fails before any step runs", async () => {
    const agent = createAgent()
    const terms = mountCheckbox({ id: "terms" })
    const instance = input({ id: "workspace", defaultValue: "Atlashh" })
    const el = document.body.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", "Workspace name")
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const check = {
      ref: "Accept the terms",
      action: "setChecked",
      args: [true],
    }
    const act = (...steps: unknown[]) =>
      agent.act({ steps } as { steps: AgentStep[] })
    expect(
      await act(check, {
        ref: "Workspace name",
        action: "setValue",
        value: "Atlas",
      })
    ).toMatchObject({
      ok: false,
      steps: [],
      error: {
        step: 1,
        message:
          'steps[1] has "value", which a step doesn\'t take: a step is { "ref": "…", "action": "…", "args": […] }. A value goes in "args", like "args": ["Atlas"]. No step ran.',
      },
    })
    expect(
      (
        await act(check, {
          ref: "Workspace name",
          action: "setValue",
          args: ["Atlas"],
          note: "rename",
        })
      ).error?.message
    ).toBe(
      'steps[1] has "note", which a step doesn\'t take: a step is { "ref": "…", "action": "…", "args": […] }. No step ran.'
    )
    expect(
      (
        await act(check, {
          ref: "Workspace name",
          action: "setValue",
          args: "Atlas",
        })
      ).error?.message
    ).toBe(
      'steps[1] takes "args" as a list, like "args": ["Atlas"], not "Atlas". No step ran.'
    )
    expect((await act(check, null)).error?.message).toBe(
      'steps[1] is null, not { "ref": "…", "action": "…", "args": […] }. No step ran.'
    )
    expect(
      (await act(check, { ref: "Workspace name", action: "setValue" })).error
        ?.message
    ).toBe(
      'setValue on "Workspace name" needs its value, as "args": [value]. No step ran.'
    )
    expect(terms.get().checked).toBe(false)
    expect(instance.get().value).toBe("Atlashh")
  })

  test("a number past a slider's range is refused, not clamped, and one off its steps fails the step", async () => {
    const agent = createAgent()
    const instance = slider({ id: "seats", min: 1, max: 20, defaultValue: 12 })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Seats")
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    const set = (value: unknown) =>
      agent.act({
        steps: [{ ref: "Seats", action: "setValue", args: [value] }],
      })
    expect((await set(25)).error?.message).toMatch(
      /^setValue on Seats \(c\d+\) takes a number from 1 to 20, not 25\.$/
    )
    expect((await set("0")).error?.message).toMatch(
      /takes a number from 1 to 20, not 0\.$/
    )
    expect(instance.get().value).toBe(12)
    expect((await set(2.5)).error?.message).toMatch(
      /^setValue on Seats \(c\d+\) took 3, not 2\.5: it moves in steps of 1\. It is 3 now\.$/
    )
    expect(await set(2)).toMatchObject({ ok: true })
    expect(instance.get().value).toBe(2)
    expect((await set(2.4)).error?.message).toMatch(
      /didn't take: it is still 2, and it moves in steps of 1\.$/
    )
  })

  test("a range slider's numbers that moved fail the step too", async () => {
    const agent = createAgent()
    const instance = slider({
      id: "price",
      min: 0,
      max: 10,
      defaultValue: [1, 9],
    })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Price")
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    const set = (value: number[]) =>
      agent.act({
        steps: [{ ref: "Price", action: "setValue", args: [value] }],
      })
    expect((await set([2.4, 7.6])).error?.message).toMatch(
      /^setValue on Price \(c\d+\) took \[2,8\], not \[2\.4,7\.6\]: it moves in steps of 1\. It is \[2,8\] now\.$/
    )
    expect(await set([3, 7])).toMatchObject({ ok: true })
    expect(instance.get().value).toEqual([3, 7])
  })

  test("a private field a callback keeps as it is passes a right guess and a wrong one alike", async () => {
    const agent = createAgent()
    const instance = input({
      id: "pin",
      defaultValue: "4821",
      onValueChange: (_value, details) => details.cancel(),
    })
    const region = document.body.appendChild(document.createElement("div"))
    region.setAttribute("data-agent-secret", "")
    const el = region.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", "PIN")
    cleanups.push(
      bind(instance.part("root"), el),
      () => instance.destroy(),
      () => region.remove()
    )
    const guess = (value: string) =>
      agent.act({ steps: [{ ref: "PIN", action: "setValue", args: [value] }] })
    const right = await guess("4821")
    const wrong = await guess("0000")
    expect(wrong).toEqual(right)
    expect(instance.get().value).toBe("4821")
  })

  test("a number field with only a max says so", async () => {
    const agent = createAgent()
    const instance = numberInput({ id: "seats", defaultValue: 10, max: 10 })
    const field = document.body.appendChild(document.createElement("input"))
    field.setAttribute("aria-label", "Seats")
    cleanups.push(bind(instance.part("control"), field), () =>
      instance.destroy()
    )
    const outcome = await agent.act({
      steps: [{ ref: "Seats", action: "setValue", args: [11] }],
    })
    expect(outcome.error?.message).toMatch(
      /^setValue on Seats \(c\d+\) takes a number of 10 or less, not 11\.$/
    )
    expect(instance.get().value).toBe(10)
  })

  test("a number is text to a field that holds text", async () => {
    const agent = createAgent()
    const instance = input({ id: "zip", defaultValue: "" })
    const el = document.body.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", "Zip code")
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Zip code", action: "setValue", args: [94107] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toBe("94107")
  })

  test("a file input takes no text, so a set fails and its value stays as it was", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    const instance = input({ id: "photo", onValueChange })
    const el = document.body.appendChild(document.createElement("input"))
    el.type = "file"
    el.setAttribute("aria-label", "Photo")
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Photo", action: "setValue", args: ["photo.png"] }],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: {
        step: 0,
        message: expect.stringContaining('didn\'t take: it is still ""'),
      },
    })
    const photo = agent.snapshot().find((each) => each.label === "Photo")!
    expect(outcome.values[`${photo.ref} Photo`]).toBe("")
    expect(photo.value).toBe("")
    expect(instance.get()).toMatchObject({ value: "", filled: false })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test("a number is text to a list of text with nothing chosen, and a number to a list of numbers", async () => {
    const agent = createAgent()
    const choose = async (
      label: string,
      items: Parameters<typeof select>[0]["items"]
    ) => {
      const instance = select({ id: label.toLowerCase(), items })
      const el = document.body.appendChild(document.createElement("button"))
      el.setAttribute("aria-label", label)
      cleanups.push(bind(instance.part("trigger"), el), () =>
        instance.destroy()
      )
      const outcome = await agent.act({
        steps: [{ ref: label, action: "setValue", args: [2] }],
      })
      expect(outcome.ok).toBe(true)
      return instance.get().value
    }
    expect(await choose("Seats", ["1", "2", "3"])).toBe("2")
    expect(
      await choose("Project", [
        { value: 1, label: "Mobile app" },
        { value: 2, label: "Website" },
      ])
    ).toBe(2)
  })

  test("the bridge carries its tools, for an agent that finds it on the page", () => {
    const agent = createAgent()
    expect(agent.tools.map((tool) => tool.name)).toEqual([
      "act",
      "query",
      "snapshot",
    ])
    expect(agent.tools[0].inputSchema).toMatchObject({
      required: ["steps"],
      additionalProperties: false,
    })
  })

  test("a reading inside data-agent-secret is redacted", () => {
    const agent = createAgent()
    const instance = progress({ id: "score", value: 3, max: 4 })
    const region = document.body.appendChild(document.createElement("div"))
    region.setAttribute("data-agent-secret", "")
    const el = region.appendChild(document.createElement("div"))
    el.setAttribute("aria-label", "Credit score")
    cleanups.push(
      bind(instance.part("root"), el),
      () => instance.destroy(),
      () => region.remove()
    )
    expect(
      agent.snapshot().find((component) => component.label === "Credit score")
    ).toMatchObject({
      value: "[redacted]",
    })
  })

  test("a date picker takes a date without opening its calendar to look for an item", async () => {
    const agent = createAgent()
    const instance = datePicker({ id: "start" })
    const label = document.body.appendChild(document.createElement("label"))
    label.textContent = "Start date"
    const input = label.appendChild(document.createElement("input"))
    cleanups.push(bind(instance.part("input"), input), () => instance.destroy())
    const opened = vi.fn()
    instance.subscribe(() => instance.get().open && opened())
    const outcome = await agent.act({
      steps: [{ ref: "Start date", action: "setValue", args: ["2026-12-01"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(instance.get().value).toBe("2026-12-01")
    expect(opened).not.toHaveBeenCalled()
  })

  test("a date picker is named by its input's label, not by the month its calendar shows", () => {
    const agent = createAgent()
    const instance = datePicker({ id: "due", defaultMonth: "2026-11" })
    const label = document.body.appendChild(document.createElement("label"))
    label.textContent = "Due date"
    const input = label.appendChild(document.createElement("input"))
    const heading = document.body.appendChild(document.createElement("h2"))
    heading.textContent = "November 2026"
    cleanups.push(
      bind(instance.part("input"), input),
      bind(instance.part("heading"), heading),
      () => instance.destroy()
    )
    expect(
      agent
        .snapshot()
        .find((component) => component.component === "date-picker")?.label
    ).toBe("Due date")
  })

  test("a select keeps its trigger's name when its popup's search field mounts", () => {
    const agent = createAgent()
    const instance = select({ id: "fruit", items: ["Apple", "Pear"] })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.textContent = "Fruit"
    const content = document.body.appendChild(document.createElement("div"))
    const search = content.appendChild(document.createElement("input"))
    search.setAttribute("aria-label", "Search fruit")
    cleanups.push(
      bind(instance.part("trigger"), trigger),
      bind(instance.part("content"), content),
      bind(instance.part("input"), search),
      () => instance.destroy()
    )
    expect(
      agent.snapshot().find((component) => component.component === "select")
        ?.label
    ).toBe("Fruit")
  })

  test("item labels read as text: spaces collapsed, and without a nested item's text", () => {
    const agent = createAgent()
    const views = tabs({ id: "views" })
    const list = document.body.appendChild(document.createElement("div"))
    list.setAttribute("aria-label", "Views")
    cleanups.push(bind(views.part("root"), list), () => views.destroy())
    for (const [value, count] of [
      ["active", 12],
      ["activity", 2],
    ] as const) {
      const tab = list.appendChild(document.createElement("button"))
      tab.innerHTML = `\n  ${value}\n  <span>${count}</span>\n`
      cleanups.push(bind(views.part("tab", { value }), tab))
    }
    const files = tree({ id: "files" })
    const root = document.body.appendChild(document.createElement("ul"))
    root.setAttribute("aria-label", "Files")
    cleanups.push(bind(files.part("root"), root), () => files.destroy())
    const branch = root.appendChild(document.createElement("li"))
    branch.append("src")
    const group = branch.appendChild(document.createElement("ul"))
    const leaf = group.appendChild(document.createElement("li"))
    leaf.textContent = "index.ts"
    cleanups.push(
      bind(files.part("item", { value: "src" }), branch),
      bind(files.part("item", { value: "src/index.ts" }), leaf)
    )
    const screen = agent.snapshot()
    expect(
      screen.find((component) => component.label === "Views")?.items
    ).toEqual([
      { value: "active", label: "active 12" },
      { value: "activity", label: "activity 2" },
    ])
    expect(
      screen.find((component) => component.label === "Files")?.items
    ).toEqual([
      { value: "src", label: "src" },
      { value: "src/index.ts", label: "index.ts" },
    ])
  })

  test("a single tab doesn't name its tabs over the list's label", () => {
    const agent = createAgent()
    const files = tabs({ id: "open-files" })
    const root = document.body.appendChild(document.createElement("div"))
    const list = root.appendChild(document.createElement("div"))
    list.setAttribute("aria-label", "Open files")
    const tab = list.appendChild(document.createElement("button"))
    tab.textContent = "index.ts"
    // React binds a child before its parent.
    cleanups.push(
      bind(files.part("tab", { value: "index" }), tab),
      bind(files.part("list"), list),
      bind(files.part("root"), root),
      () => files.destroy()
    )
    expect(
      agent
        .snapshot()
        .find(
          (component) => component.component === "tabs" && !component.offPage
        )?.label
    ).toBe("Open files")
  })

  test("an item's label leaves out text a screen reader skips, like its check mark", async () => {
    const agent = createAgent()
    const people = listbox({ id: "people", multiple: true })
    const list = document.body.appendChild(document.createElement("div"))
    list.setAttribute("aria-label", "People")
    cleanups.push(bind(people.part("root"), list), () => people.destroy())
    for (const name of ["Ada Lovelace", "Alan Turing"]) {
      const item = list.appendChild(document.createElement("div"))
      // The indicator's attributes, as an adapter renders them.
      const mark = item.appendChild(document.createElement("span"))
      for (const [key, value] of Object.entries(
        attrs(people.part("item-indicator", { item: name }))
      )) {
        if (typeof value === "string") {
          mark.setAttribute(key, value)
        }
      }
      mark.textContent = "✓"
      item.append(name)
      cleanups.push(
        bind(people.part("item", { value: name }), item),
        bind(
          people.part("item-indicator", { item: name, keepMounted: true }),
          mark
        )
      )
    }
    expect(
      agent.snapshot().find((component) => component.label === "People")?.items
    ).toEqual([
      { value: "Ada Lovelace", label: "Ada Lovelace" },
      { value: "Alan Turing", label: "Alan Turing" },
    ])
    const outcome = await agent.act({
      steps: [{ ref: "People", action: "setValue", args: [["Ada Lovelace"]] }],
    })
    expect(outcome.ok).toBe(true)
  })

  test("a button whose text a screen reader skips is pressed by its name", async () => {
    const agent = createAgent()
    const instance = dialog({ id: "invite", defaultOpen: true })
    const popup = document.body.appendChild(
      Object.assign(document.createElement("div"), { getAnimations: () => [] })
    )
    popup.setAttribute("aria-label", "Invite")
    const close = popup.appendChild(document.createElement("button"))
    close.setAttribute("aria-label", "Close")
    close.innerHTML = `<span aria-hidden="true">×</span>`
    cleanups.push(
      bind(instance.part("content"), popup),
      bind(instance.part("close"), close),
      () => instance.destroy()
    )
    expect(
      agent.snapshot().find((component) => component.component === "dialog")
        ?.buttons
    ).toEqual(["Close"])
    const outcome = await agent.act({
      steps: [{ ref: "Invite", action: "press", args: ["Close"] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().open).toBe(false)
  })

  test("a button with no text but what's off-limits isn't named by it", () => {
    const agent = createAgent()
    const instance = dialog({ id: "token", defaultOpen: true })
    const popup = document.body.appendChild(
      Object.assign(document.createElement("div"), { getAnimations: () => [] })
    )
    popup.setAttribute("aria-label", "Token")
    const copy = popup.appendChild(document.createElement("button"))
    copy.innerHTML = `<span data-agent-hidden>sk-123</span>`
    cleanups.push(
      bind(instance.part("content"), popup),
      bind(instance.part("close"), copy),
      () => instance.destroy()
    )
    expect(
      agent.snapshot().find((component) => component.component === "dialog")
        ?.buttons
    ).toEqual([""])
  })

  test("of two components on one field, the step goes to the one that takes its action", async () => {
    const agent = createAgent()
    const message = textarea({ id: "message" })
    const mentions = triggerMenu({
      id: "mentions",
      triggers: [{ char: "@", items: [] }],
    })
    const field = document.body.appendChild(document.createElement("textarea"))
    field.setAttribute("aria-label", "Message")
    cleanups.push(
      bind(message.part("root"), field),
      bind(mentions.part("input"), field),
      () => message.destroy(),
      () => mentions.destroy()
    )
    const named = agent
      .snapshot()
      .filter((component) => component.label === "Message")
    expect(named.map((component) => component.component).sort()).toEqual([
      "textarea",
      "trigger-menu",
    ])
    const outcome = await agent.act({
      steps: [{ ref: "Message", action: "setValue", args: ["Hello"] }],
    })
    expect(outcome.ok).toBe(true)
    expect(message.get().value).toBe("Hello")
  })

  test("a press waits for the button's action, and a failed action fails the step", async () => {
    const agent = createAgent()
    let fail = false
    const instance = button({
      id: "save",
      action: () =>
        new Promise((resolve, reject) =>
          setTimeout(
            () => (fail ? reject(new Error("Network down")) : resolve(null)),
            120
          )
        ),
    } as Parameters<typeof button>[0])
    const el = document.createElement("button")
    el.textContent = "Save"
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const saved = await agent.act({ steps: [{ ref: "Save", action: "press" }] })
    expect(saved).toMatchObject({
      ok: true,
      steps: [{ result: 'Pressed "Save".' }],
    })
    expect(instance.get().pending).toBe(false)
    fail = true
    const failed = await agent.act({
      steps: [{ ref: "Save", action: "press" }],
    })
    expect(failed).toMatchObject({
      ok: false,
      error: {
        step: 0,
        message: 'Pressed "Save", and its action failed: Network down',
      },
    })
    expect(agent.snapshot()[0]).toMatchObject({
      component: "button",
      error: "Network down",
    })
  })

  test("a button rendered as a link lists press and takes it", async () => {
    const agent = createAgent()
    const instance = button({ id: "start" } as Parameters<typeof button>[0])
    const el = document.createElement("a")
    el.href = "#docs"
    el.textContent = "Get started"
    const onClick = vi.fn((event: Event) => event.preventDefault())
    el.addEventListener("click", onClick)
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    expect(agent.snapshot()[0]).toMatchObject({
      component: "button",
      label: "Get started",
      actions: ["press"],
    })
    const pressed = await agent.act({
      steps: [{ ref: "Get started", action: "press" }],
    })
    expect(pressed).toMatchObject({
      ok: true,
      steps: [{ result: 'Pressed "Get started".' }],
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("a press takes a button's own text", async () => {
    const agent = createAgent()
    const action = vi.fn()
    const instance = button({ id: "save", action } as Parameters<
      typeof button
    >[0])
    const el = document.createElement("button")
    el.textContent = "Save settings"
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const saved = await agent.act({
      steps: [
        { ref: "Save settings", action: "press", args: ["Save settings"] },
      ],
    })
    expect(saved).toMatchObject({
      ok: true,
      steps: [{ result: 'Pressed "Save settings".' }],
    })
    expect(action).toHaveBeenCalledTimes(1)
    const missed = await agent.act({
      steps: [{ ref: "Save settings", action: "press", args: ["Publish"] }],
    })
    expect(missed).toMatchObject({
      ok: false,
      error: { message: expect.stringContaining("Buttons: Save settings.") },
    })
    expect(action).toHaveBeenCalledTimes(1)
  })

  test("a closed select's items come from its data, without opening it", async () => {
    const agent = createAgent()
    const onOpenChange = vi.fn()
    const instance = select({
      id: "region",
      items: [
        {
          type: "group",
          label: "Europe",
          items: [{ value: "fra", label: "Frankfurt" }],
        },
        "Tokyo",
      ],
      onOpenChange,
    })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Region")
    document.body.append(el)
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const [{ ref }] = agent.snapshot()
    expect(await agent.query({ within: ref })).toEqual([
      expect.objectContaining({
        ref,
        items: [
          { value: "fra", label: "Frankfurt" },
          { value: "Tokyo", label: "Tokyo" },
        ],
      }),
    ])
    expect(await agent.query({ within: ref, text: "frank" })).toEqual([
      expect.objectContaining({
        items: [{ value: "fra", label: "Frankfurt" }],
      }),
    ])
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})

describe("agent query", () => {
  // A Button with its text, bound the way an adapter binds it.
  const mountButton = (text: string) => {
    const instance = button({ id: text })
    const el = document.createElement("button")
    el.textContent = text
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
  }

  // A closed select with these items, labelled `label`.
  const mountSelect = (
    label: string,
    items: string[],
    options: { defaultOpen?: boolean } = {}
  ) => {
    const instance = select({ id: label, items, ...options })
    const el = document.createElement("button")
    el.setAttribute("aria-label", label)
    document.body.append(el)
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
  }

  test("finds components by the words of their label, and lists with matching items under them", async () => {
    const agent = createAgent()
    mountButton("Save draft")
    mountButton("Saved replies")
    mountSelect("Timezone", ["Europe/Paris", "Asia/Tokyo", "America/Toronto"])
    expect(await agent.query({ text: "save" })).toEqual([
      expect.objectContaining({ label: "Save draft" }),
    ])
    expect(await agent.query({ text: "to" })).toEqual([
      expect.objectContaining({
        label: "Timezone",
        items: [
          { value: "Asia/Tokyo", label: "Asia/Tokyo" },
          { value: "America/Toronto", label: "America/Toronto" },
        ],
      }),
    ])
  })

  test("kind keeps one kind of component, and a query needs something to look for", async () => {
    const agent = createAgent()
    mountButton("Save")
    mountSelect("Region", ["Tokyo"])
    // Earlier tests' selects follow with offPage, like any component that left the page.
    const selects = (await agent.query({ kind: "select" })) as AgentComponent[]
    expect(
      selects
        .filter((component) => !component.offPage)
        .map((component) => component.label)
    ).toEqual(["Region"])
    expect(selects.every((component) => component.component === "select")).toBe(
      true
    )
    expect(await agent.query({})).toEqual({
      error:
        "query takes text, within, kind or closed. snapshot lists what is on the page.",
    })
  })

  test("a long list's items stop at 50 and say how many more there were", async () => {
    const agent = createAgent()
    mountSelect(
      "Country",
      Array.from({ length: 70 }, (_, index) => `Country ${index + 1}`)
    )
    const [country] = (await agent.query({
      within: "Country",
    })) as AgentComponent[]
    expect(country.items).toHaveLength(50)
    expect(country.more).toBe(20)
  })

  test("from skips items, so a long list reads past its first 50", async () => {
    const agent = createAgent()
    mountSelect(
      "Country",
      Array.from({ length: 70 }, (_, index) => `Country ${index + 1}`)
    )
    const [next] = (await agent.query({
      within: "Country",
      from: 10,
    })) as AgentComponent[]
    expect(next.items![0].label).toBe("Country 11")
    expect(next.items).toHaveLength(50)
    expect(next.more).toBe(10)
    const [last] = (await agent.query({
      within: "Country",
      from: 50,
    })) as AgentComponent[]
    expect(last.items!.map((item) => item.label)).toEqual(
      Array.from({ length: 20 }, (_, index) => `Country ${index + 51}`)
    )
    expect("more" in last).toBe(false)
    const [matched] = (await agent.query({
      within: "Country",
      text: "Country 6",
      from: 1,
    })) as AgentComponent[]
    expect(matched.items!.map((item) => item.label)).toEqual(
      Array.from({ length: 10 }, (_, index) => `Country ${index + 60}`)
    )
  })

  test("from needs within and a count of items to skip", async () => {
    const agent = createAgent()
    mountSelect("Country", ["France"])
    const error = {
      error:
        'from goes with within and counts the items to skip, like { "within": "Country", "from": 50 }.',
    }
    expect(await agent.query({ text: "Country", from: 50 })).toEqual(error)
    expect(await agent.query({ within: "Country", from: -1 })).toEqual(error)
    expect(await agent.query({ within: "Country", from: 1.5 })).toEqual(error)
  })

  test("a list with more items than a snapshot lists says how many it has", async () => {
    const agent = createAgent()
    mountSelect(
      "Timezone",
      Array.from({ length: 10 }, (_, index) => `Zone ${index + 1}`)
    )
    mountSelect(
      "Country",
      Array.from({ length: 12 }, (_, index) => `Country ${index + 1}`)
    )
    const named = (label: string) =>
      agent
        .snapshot()
        .find((component) => component.label === label && !component.offPage)!
    expect(named("Timezone").items).toHaveLength(10)
    expect("more" in named("Timezone")).toBe(false)
    expect("items" in named("Country")).toBe(false)
    expect(named("Country").more).toBe(12)
    const [country] = (await agent.query({
      within: "Country",
    })) as AgentComponent[]
    expect(country.items).toHaveLength(12)
    expect("more" in country).toBe(false)
  })

  test("a long page's snapshot stops at 100, keeps what's open and ends with how many were left out", () => {
    const agent = createAgent()
    for (let index = 1; index <= 120; index++) {
      mountButton(`Row ${index}`)
    }
    mountSelect("Status", ["Open", "Closed"], { defaultOpen: true })
    const screen = agent.snapshot()
    expect(screen).toHaveLength(101)
    expect(screen).toContainEqual(
      expect.objectContaining({ label: "Status", open: true })
    )
    expect(screen.at(-1)).toEqual({
      ref: "more",
      component: "more",
      more: expect.any(Number),
      use: "query",
      actions: [],
    })
    expect(screen.at(-1)!.more).toBeGreaterThanOrEqual(21)
  })
})

describe("agent press", () => {
  test("presses the button a component is, and a button inside an open one", async () => {
    const agent = createAgent()
    const { button } = await import("../src/components/button/button")
    const instance = button({ id: "save" })
    const el = document.createElement("button")
    el.textContent = "Save"
    const onClick = vi.fn()
    el.addEventListener("click", onClick)
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const [component] = agent.snapshot()
    expect(component).toMatchObject({
      component: "button",
      label: "Save",
      actions: ["press"],
    })
    await agent.act({ steps: [{ ref: component.ref, action: "press" }] })
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe("agent rows", () => {
  // A checkbox on a row of its own, beside the row's text.
  function mountRow(name: string) {
    const instance = checkbox({ id: `pick-${name}` })
    const row = document.createElement("li")
    const text = document.createElement("span")
    text.textContent = `${name} Admin`
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Select")
    row.append(text, el)
    document.body.append(row)
    const unbind = bind(instance.part("root"), el)
    return () => {
      unbind()
      instance.destroy()
      row.remove()
    }
  }

  test("a component on a row carries the row's text, so rows with the same controls differ", () => {
    const agent = createAgent()
    cleanups.push(mountRow("Priya Shah"), mountRow("Tom Becker"))
    const shown = agent.snapshot().filter((component) => !component.offPage)
    expect(shown.map((component) => component.row)).toEqual([
      "Priya Shah Admin",
      "Tom Becker Admin",
    ])
  })

  test("a row's text is whole on its first component and brief on the next, and a press with the row's name and a button's text is on that button", async () => {
    const agent = createAgent()
    const row = document.createElement("li")
    const about = `1042 Walnut standing desk, 160 by 80 cm, oiled finish, shipped from Leeds on 2026-12-04 by freight, assembly and removal of the old desk included, $912`
    row.append(about)
    document.body.append(row)
    const pressed: string[] = []
    for (const text of ["Notes (2)", "Refund 1042"]) {
      const el = row.appendChild(document.createElement("button"))
      el.textContent = text
      el.addEventListener("click", () => pressed.push(text))
      const instance = button({ id: text })
      cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    }
    cleanups.push(() => row.remove())
    const shown = agent.snapshot().filter((component) => !component.offPage)
    expect(shown.map((component) => component.row)).toEqual([
      `${about} Refund 1042`,
      `${about} Notes (2)`.slice(0, 80),
    ])
    expect(
      await agent.act({
        steps: [{ ref: "1042", action: "press", args: ["Notes"] }],
      })
    ).toMatchObject({ ok: true })
    expect(pressed).toEqual(["Notes (2)"])
    const both = await agent.act({ steps: [{ ref: "1042", action: "press" }] })
    expect(both.error?.message).toContain('"1042" names 2 components')
    expect(
      await agent.act({ steps: [{ ref: "Refund 1042", action: "press" }] })
    ).toMatchObject({ ok: true })
    expect(pressed).toEqual(["Notes (2)", "Refund 1042"])
  })

  test("a table's header row adds no row text, so a header button is found by its label", async () => {
    const agent = createAgent()
    const table = document.createElement("table")
    table.innerHTML =
      "<thead><tr><th><button>Email</button></th><th><button>Status</button></th></tr></thead>" +
      "<tbody><tr><th>Row</th><td><button>Edit</button></td></tr></tbody>"
    document.body.append(table)
    const pressed: string[] = []
    for (const el of table.querySelectorAll("button")) {
      const instance = button({ id: el.textContent! })
      el.addEventListener("click", () => pressed.push(el.textContent!))
      cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    }
    const rows = Object.fromEntries(
      agent
        .snapshot()
        .filter((component) => !component.offPage)
        .map((component) => [component.label, component.row])
    )
    expect(rows).toEqual({ Email: undefined, Status: undefined, Edit: "Row" })
    expect(
      await agent.act({ steps: [{ ref: "Email", action: "press" }] })
    ).toMatchObject({ ok: true })
    expect(pressed).toEqual(["Email"])
  })

  test("an expect step checks a row's text and a checked state", async () => {
    const agent = createAgent()
    cleanups.push(mountRow("Priya Shah"))
    const outcome = await agent.act({
      steps: [
        { ref: "Priya Shah", action: "expect", args: ["Admin"] },
        { ref: "Priya Shah", action: "expect", args: [false] },
        { ref: "Priya Shah", action: "expect", args: ["Member"] },
      ],
    })
    expect(outcome.steps).toHaveLength(2)
    expect(outcome.error?.message).toMatch(
      /^Select \(c\d+\) is "Priya Shah Admin", not "Member"\. The steps before this one stay done\.$/
    )
  })

  test("a component that leaves and comes back, like a tab's, keeps its ref", () => {
    const agent = createAgent()
    const unmount = mountRow("Priya Shah")
    const [{ ref }] = agent.snapshot()
    unmount()
    expect(
      agent.snapshot().find((component) => component.ref === ref)?.offPage
    ).toBe(true)
    cleanups.push(mountRow("Priya Shah"))
    const back = agent.snapshot().filter((component) => component.ref === ref)
    expect(back).toHaveLength(1)
    expect(back[0].offPage).toBeUndefined()
  })
})

describe("agent refs", () => {
  // A checkbox in a label, optionally on a row, that can leave the page early.
  function mountLabeled(
    options: Parameters<typeof checkbox>[0],
    text: string,
    row?: string
  ) {
    const instance = checkbox(options)
    const label = document.createElement("label")
    const el = document.createElement("button")
    label.append(el, text)
    const host = row ? document.createElement("li") : label
    if (row) {
      host.append(row, label)
    }
    document.body.append(host)
    const unbind = bind(instance.part("root"), el)
    let mounted = true
    const unmount = () => {
      if (!mounted) {
        return
      }
      mounted = false
      unbind()
      instance.destroy()
      host.remove()
    }
    cleanups.push(unmount)
    return { instance, unmount }
  }

  test("twins with the same label that leave and come back keep their own refs, with no off-page copy left", async () => {
    const agent = createAgent()
    const a = mountLabeled({ id: "twin-a", defaultChecked: true }, "Notify me")
    const b = mountLabeled({ id: "twin-b" }, "Notify me")
    const [refA, refB] = agent.snapshot().map((component) => component.ref)
    a.unmount()
    b.unmount()
    const a2 = mountLabeled(
      { id: "twin-a2", defaultChecked: true },
      "Notify me"
    )
    const b2 = mountLabeled({ id: "twin-b2" }, "Notify me")
    const twins = agent
      .snapshot()
      .filter((component) => component.label === "Notify me")
    expect(twins).toEqual([
      expect.objectContaining({ ref: refA, checked: true }),
      expect.objectContaining({ ref: refB, checked: false }),
    ])
    expect(twins.some((component) => component.offPage)).toBe(false)
    await agent.act({
      steps: [{ ref: refB, action: "setChecked", args: [true] }],
    })
    expect(a2.instance.get().checked).toBe(true)
    expect(b2.instance.get().checked).toBe(true)
  })

  test("only the last 500 labels that left keep a ref for when they come back", () => {
    const agent = createAgent()
    // A text field named by `aria-label`, which the agent reads quickly.
    const mountField = (label: string) => {
      const instance = input({ id: label })
      const el = document.createElement("input")
      el.setAttribute("aria-label", label)
      document.body.append(el)
      const unbind = bind(instance.part("root"), el)
      const ref = agent
        .snapshot()
        .find(
          (component) => component.label === label && !component.offPage
        )?.ref
      const unmount = () => {
        unbind()
        instance.destroy()
        el.remove()
      }
      return { ref, unmount }
    }
    const first = mountField("Note 0")
    first.unmount()
    let last = first
    for (let index = 1; index <= 500; index++) {
      last = mountField(`Note ${index}`)
      last.unmount()
    }
    const again = mountField("Note 0")
    const lastAgain = mountField("Note 500")
    cleanups.push(again.unmount, lastAgain.unmount)
    expect(again.ref).not.toBe(first.ref)
    expect(lastAgain.ref).toBe(last.ref)
  })

  test("a row's text leaves out the component's own label", () => {
    const agent = createAgent()
    mountLabeled({ id: "row-alice" }, "Make admin", "Alice")
    expect(
      agent.snapshot().find((component) => component.label === "Make admin")
        ?.row
    ).toBe("Alice")
  })

  test("a component keeps its ref when its row's text changed before it left", () => {
    const agent = createAgent()
    const instance = checkbox({ id: "pick" })
    const row = document.createElement("li")
    const text = document.createElement("span")
    text.textContent = "Priya Shah Member"
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Select")
    row.append(text, el)
    document.body.append(row)
    const unbind = bind(instance.part("root"), el)
    const [{ ref }] = agent.snapshot()
    text.textContent = "Priya Shah Admin"
    agent.snapshot()
    unbind()
    instance.destroy()
    const again = checkbox({ id: "pick-again" })
    cleanups.push(bind(again.part("root"), el), () => again.destroy())
    expect(
      agent
        .snapshot()
        .filter((component) => !component.offPage)
        .map((component) => component.ref)
    ).toEqual([ref])
  })
})

describe("agent act", () => {
  test("runs several steps in order, finds components by label or row text, and reports what they changed", async () => {
    const agent = createAgent()
    const onCheckedChange = vi.fn()
    mountCheckbox({ id: "terms", onCheckedChange })
    mountCheckbox({ id: "digest" }, "Send a weekly digest")
    const outcome = await agent.act({
      steps: [
        { ref: "Accept the terms", action: "setChecked", args: [true] },
        { ref: "weekly", action: "setChecked", args: [true] },
      ],
    })
    expect(onCheckedChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ source: "agent" })
    )
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        {
          step: 0,
          changes: [{ label: "Accept the terms", key: "checked", value: true }],
        },
        {
          step: 1,
          changes: [
            { label: "Send a weekly digest", key: "checked", value: true },
          ],
        },
      ],
    })
    expect(Object.entries(outcome.values)).toEqual(
      expect.arrayContaining([
        [expect.stringContaining("Accept the terms"), true],
        [expect.stringContaining("Send a weekly digest"), true],
      ])
    )
  })

  test("names a component by whole words of its label, so part of a word matches nothing", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "username" }, "Username")
    const missed = await agent.act({
      steps: [{ ref: "Name", action: "setChecked", args: [true] }],
    })
    expect(missed.ok).toBe(false)
    expect(missed.error?.message).toContain('No component "Name"')
    const display = mountCheckbox({ id: "display-name" }, "Display name")
    const found = await agent.act({
      steps: [{ ref: "name", action: "setChecked", args: [true] }],
    })
    expect(found.ok).toBe(true)
    expect(display.get().checked).toBe(true)
  })

  test("names a component ignoring accents and case", async () => {
    const agent = createAgent()
    const region = mountCheckbox({ id: "fold-region" }, "Région")
    const city = mountCheckbox({ id: "fold-city" }, "İl")
    const street = mountCheckbox({ id: "fold-street" }, "Straße")
    const town = mountCheckbox({ id: "fold-town" }, "Łódź")
    const company = mountCheckbox({ id: "fold-company" }, "Ørsted")
    const outcome = await agent.act({
      steps: [
        { ref: "Region", action: "setChecked", args: [true] },
        { ref: "il", action: "setChecked", args: [true] },
        { ref: "STRASSE", action: "setChecked", args: [true] },
        { ref: "lodz", action: "setChecked", args: [true] },
        { ref: "orsted", action: "setChecked", args: [true] },
      ],
    })
    expect(outcome.ok).toBe(true)
    expect(
      [region, city, street, town, company].map(
        (instance) => instance.get().checked
      )
    ).toEqual([true, true, true, true, true])
  })

  test("labels that differ only by an accent name both components, with their refs", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "fold-resume" }, "Résumé")
    mountCheckbox({ id: "fold-resume-plain" }, "Resume")
    const refs = agent
      .snapshot()
      .filter(
        (component) =>
          !component.offPage && /^r[eé]sum[eé]$/i.test(component.label ?? "")
      )
      .map((component) => `${component.ref} ${component.label}`)
    const outcome = await agent.act({
      steps: [{ ref: "resume", action: "setChecked", args: [true] }],
    })
    expect(outcome.error?.message).toBe(
      `"resume" names 2 components: ${refs.join(", ")}. Use a ref. A page tells them apart with a word in one label the other lacks, like a verb or the row's name.`
    )
  })

  test("an exact label doesn't beat a row that holds the same words, since page text can be anyone's", async () => {
    const agent = createAgent()
    const row = (html: string, id: string) => {
      const instance = checkbox({ id })
      const el = document.createElement("div")
      el.setAttribute("role", "row")
      el.innerHTML = html
      document.body.append(el)
      cleanups.push(
        bind(instance.part("root"), el.querySelector("button")!),
        () => instance.destroy()
      )
      return instance
    }
    const jane = row(
      `<span>Jane Doe</span> <span>jane@acme.com</span><button aria-label="Admin"></button>`,
      "jane"
    )
    const other = row(`<button aria-label="Jane Doe"></button>`, "other")
    const outcome = await agent.act({
      steps: [{ ref: "Jane Doe", action: "setChecked", args: [true] }],
    })
    expect(outcome.error?.message).toMatch(
      /"Jane Doe" names 2 components: c\d+ Admin \(Jane Doe jane@acme\.com\), c\d+ Jane Doe\. Use a ref\. A page tells them apart with a word in one label the other lacks, like a verb or the row's name\./
    )
    expect([jane.get().checked, other.get().checked]).toEqual([false, false])
  })

  test("an open component whose label only holds the words doesn't beat the exact label", async () => {
    const agent = createAgent()
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "System"
    const pressed = vi.fn()
    el.addEventListener("click", pressed)
    const own = button({ id: "system" })
    const row = collapsible({ id: "tool-call", defaultOpen: true })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Read live-system.png")
    const trigger = root.appendChild(document.createElement("button"))
    trigger.textContent = "read live-system.png"
    const panel = root.appendChild(
      Object.assign(document.createElement("div"), {
        textContent: "image",
        getAnimations: () => [],
      })
    )
    cleanups.push(
      bind(own.part("root"), el),
      bind(row.part("root"), root),
      bind(row.part("trigger"), trigger),
      bind(row.part("panel"), panel),
      () => [own, row].forEach((instance) => instance.destroy())
    )
    const outcome = await agent.act({
      steps: [{ ref: "System", action: "press" }],
    })
    expect(outcome.error?.message).toMatch(/"System" names 2 components/)
    expect(pressed).not.toHaveBeenCalled()
    expect(row.get().open).toBe(true)
  })

  test("a label that matches exactly still wins when nothing else holds its words", async () => {
    const agent = createAgent()
    const name = mountCheckbox({ id: "name" }, "Name")
    mountCheckbox({ id: "email" }, "Email")
    const outcome = await agent.act({
      steps: [{ ref: "name", action: "setChecked", args: [true] }],
    })
    expect(outcome.ok).toBe(true)
    expect(name.get().checked).toBe(true)
  })

  test("stops at the first step that fails and says which", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms" })
    mountCheckbox({ id: "digest" }, "Send a weekly digest")
    const outcome = await agent.act({
      steps: [
        { ref: "Accept the terms", action: "setChecked", args: [true] },
        { ref: "Send", action: "setValue", args: ["x"] },
        { ref: "Send a weekly digest", action: "setChecked", args: [true] },
      ],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: { step: 1, message: expect.stringContaining("takes no setValue") },
    })
    expect(outcome.steps).toHaveLength(1)
  })

  test("a label that names two components is refused, with their refs", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "a" }, "Deploy failures")
    mountCheckbox({ id: "b" }, "Deploy failures")
    const outcome = await agent.act({
      steps: [{ ref: "Deploy failures", action: "setChecked", args: [true] }],
    })
    expect(outcome.error?.message).toMatch(/names 2 components/)
  })

  test("a press by label on a Button that opens a tooltip and a menu presses the Button", async () => {
    const agent = createAgent()
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Account")
    const clicked = vi.fn()
    el.addEventListener("click", clicked)
    const own = button({ id: "account" })
    const hint = tooltip({ id: "account-hint" })
    const actions = menu({ id: "account-menu" })
    cleanups.push(
      bind(own.part("root"), el),
      bind(hint.part("trigger"), el),
      bind(actions.part("trigger"), el),
      () => [own, hint, actions].forEach((instance) => instance.destroy())
    )
    const outcome = await agent.act({
      steps: [{ ref: "Account", action: "press" }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(clicked).toHaveBeenCalledTimes(1)
  })

  test("the snapshot leaves out a closed tooltip whose trigger is a listed Button", () => {
    const agent = createAgent()
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Account")
    const plain = document.body.appendChild(document.createElement("button"))
    plain.setAttribute("aria-label", "Help")
    const own = button({ id: "account" })
    const hint = tooltip({ id: "account-hint" })
    const help = tooltip({ id: "help-hint" })
    cleanups.push(
      bind(own.part("root"), el),
      bind(hint.part("trigger"), el),
      bind(help.part("trigger"), plain),
      () => [own, hint, help].forEach((instance) => instance.destroy())
    )
    expect(
      agent
        .snapshot()
        .filter((component) => !component.offPage)
        .map(({ component, label }) => [component, label])
    ).toEqual([
      ["button", "Account"],
      ["tooltip", "Help"],
    ])
  })

  test("a press with the text of a button in the dialog a Button opens is on the dialog", async () => {
    const agent = createAgent()
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "Delete project"
    const content = document.body.appendChild(document.createElement("div"))
    const remove = content.appendChild(document.createElement("button"))
    remove.textContent = "Delete forever"
    const clicked = vi.fn()
    remove.addEventListener("click", clicked)
    const own = button({ id: "delete" })
    const confirm = dialog({ id: "delete-dialog" })
    cleanups.push(
      bind(own.part("root"), el),
      bind(confirm.part("trigger"), el),
      bind(confirm.part("content"), content),
      () => [own, confirm].forEach((instance) => instance.destroy())
    )
    const outcome = await agent.act({
      steps: [
        { ref: "Delete project", action: "press", args: ["Delete forever"] },
      ],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(clicked).toHaveBeenCalledTimes(1)
  })

  test("setValue takes an item's label as well as its value", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    const instance = select({
      id: "region",
      items: [{ value: "fra", label: "Germany (Frankfurt)" }],
      onValueChange,
    })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Region")
    document.body.append(el)
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    await agent.act({
      steps: [
        { ref: "Region", action: "setValue", args: ["germany (frankfurt)"] },
      ],
    })
    expect(onValueChange).toHaveBeenCalledWith(
      "fra",
      expect.objectContaining({ source: "agent" })
    )
  })

  test("an accordion's open takes a section's label, and \"dialog\" names an alert dialog", async () => {
    const agent = createAgent()
    const instance = accordion({ id: "notifications" })
    for (const [value, text] of [
      ["email", "Email"],
      ["slack", "Slack"],
    ]) {
      const item = document.createElement("div")
      const trigger = document.createElement("button")
      trigger.textContent = text
      item.append(trigger)
      document.body.append(item)
      cleanups.push(
        bind(instance.part("item", { value }), item),
        bind(instance.part("trigger", { value }), trigger)
      )
    }
    cleanups.push(() => instance.destroy())
    const behind = await agent.act({
      steps: [{ ref: "Deploy failures", action: "setChecked", args: [true] }],
    })
    expect(behind.error?.message).toMatch(
      /behind one of these.*accordion \(c\d+\): Email, Slack/
    )
    const outcome = await agent.act({
      steps: [{ ref: "Email", action: "open", args: ["Email"] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toEqual(["email"])
    const missing = await agent.act({
      steps: [{ ref: "dialog", action: "press", args: ["Remove"] }],
    })
    expect(missing.error?.message).toMatch(/No component "dialog"/)
  })

  test("a step finds a component inside a closed accordion section and opens it", async () => {
    const agent = createAgent()
    // The section's switch mounts once Email opens, as adapters render a closed panel.
    let unmount: (() => void) | undefined
    const instance = accordion({
      id: "channels",
      onValueChange: (value) => {
        unmount?.()
        unmount = undefined
        if (value.includes("email")) {
          const checkbox = mountCheckbox({ id: "deploys" }, "Deploy failures")
          unmount = () => checkbox.destroy()
        }
      },
    })
    for (const [value, text] of [
      ["slack", "Slack"],
      ["email", "Email"],
    ]) {
      const item = document.createElement("div")
      const trigger = document.createElement("button")
      trigger.textContent = text
      item.append(trigger)
      document.body.append(item)
      cleanups.push(
        bind(instance.part("item", { value }), item),
        bind(instance.part("trigger", { value }), trigger)
      )
    }
    cleanups.push(() => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Deploy failures", action: "setChecked", args: [true] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toEqual(["email"])
    expect(Object.entries(outcome.values)).toContainEqual([
      expect.stringContaining("Deploy failures"),
      true,
    ])
  })

  test("a step's change commits once, like a drag that ended or text typed and left", async () => {
    const agent = createAgent()
    const onSeats = vi.fn()
    const seats = slider({
      id: "seats",
      defaultValue: 70,
      onValueCommit: onSeats,
    })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Seats")
    const onPrice = vi.fn()
    const price = numberInput({
      id: "price",
      defaultValue: 70,
      onValueCommit: onPrice,
    })
    const field = document.body.appendChild(document.createElement("input"))
    field.setAttribute("aria-label", "Price")
    cleanups.push(
      bind(seats.part("root"), root),
      bind(price.part("control"), field),
      () => seats.destroy(),
      () => price.destroy()
    )
    const heard: unknown[] = []
    cleanups.push(
      agent.subscribe((change) => heard.push([change.label, change.value]))
    )
    const outcome = await agent.act({
      steps: [
        { ref: "Seats", action: "setValue", args: [30] },
        { ref: "Price", action: "setValue", args: [30] },
        { ref: "Price", action: "increment" },
      ],
    })
    expect(outcome.ok).toBe(true)
    expect(onSeats.mock.calls).toEqual([
      [30, { reason: "imperative", source: "agent", thumb: null }],
    ])
    expect(onPrice.mock.calls).toEqual([
      [30, { reason: "imperative", source: "agent" }],
      [31, { reason: "imperative", source: "agent" }],
    ])
    expect(heard).toEqual([
      ["Seats", 30],
      ["Price", 30],
      ["Price", 31],
    ])
  })

  test("a change that didn't take, or one code makes, commits nothing", async () => {
    const agent = createAgent()
    const onValueCommit = vi.fn()
    const instance = slider({ id: "seats", value: 70, onValueCommit })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Seats")
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Seats", action: "setValue", args: [30] }],
    })
    expect(outcome.error?.message).toMatch(/didn't take: it is still 70/)
    instance.setOptions({ id: "seats", onValueCommit })
    instance.api.setValue(40)
    expect(instance.get().value).toBe(40)
    expect(onValueCommit).not.toHaveBeenCalled()
    const price = numberInput({ id: "price", value: 70, onValueCommit })
    const field = document.body.appendChild(document.createElement("input"))
    field.setAttribute("aria-label", "Price")
    cleanups.push(bind(price.part("control"), field), () => price.destroy())
    await agent.act({ steps: [{ ref: "Price", action: "increment" }] })
    expect(price.get().value).toBe(70)
    expect(onValueCommit).not.toHaveBeenCalled()
  })

  test("what a private field's commit throws reads redacted, and a public field's reads as it is", async () => {
    const agent = createAgent()
    const mount = (label: string, parent: Element) => {
      const instance = numberInput({
        id: label.toLowerCase(),
        defaultValue: 1,
        onValueCommit: () => {
          throw new Error(`${label} 4242 was refused`)
        },
      })
      const field = parent.appendChild(document.createElement("input"))
      field.setAttribute("aria-label", label)
      cleanups.push(bind(instance.part("control"), field), () =>
        instance.destroy()
      )
      return instance
    }
    const region = document.body.appendChild(document.createElement("div"))
    region.setAttribute("data-agent-secret", "")
    cleanups.push(() => region.remove())
    const pin = mount("Pin", region)
    const seats = mount("Seats", document.body)
    const set = (ref: string) =>
      agent.act({ steps: [{ ref, action: "setValue", args: [2] }] })
    const secret = await set("Pin")
    expect(secret.error?.message).toMatch(
      /^The commit of Pin \(c\d+\) failed: \[redacted\]$/
    )
    expect(JSON.stringify(secret)).not.toContain("4242")
    expect(pin.get().value).toBe(2)
    expect((await set("Seats")).error?.message).toBe("Seats 4242 was refused")
    expect(seats.get().value).toBe(2)
  })

  test("only the component a step names commits, so a private one its callback mounts and changes commits nothing", async () => {
    const agent = createAgent()
    const region = document.body.appendChild(document.createElement("div"))
    region.setAttribute("data-agent-secret", "")
    cleanups.push(() => region.remove())
    const onLimitCommit = vi.fn(() => {
      throw new Error("Limit 4242 was refused")
    })
    let limit: ReturnType<typeof numberInput> | undefined
    const mountLimit = () => {
      const instance = numberInput({
        id: "limit",
        defaultValue: 1,
        onValueCommit: onLimitCommit,
      })
      const field = region.appendChild(document.createElement("input"))
      field.setAttribute("aria-label", "Limit")
      cleanups.push(bind(instance.part("control"), field), () =>
        instance.destroy()
      )
      return instance
    }
    const onValueCommit = vi.fn()
    const seats = slider({
      id: "seats",
      defaultValue: 1,
      onValueCommit,
      onValueChange: (value) => {
        limit ??= mountLimit()
        limit.api.setValue((value as number) * 10)
      },
    })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Seats")
    cleanups.push(bind(seats.part("root"), root), () => seats.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Seats", action: "setValue", args: [2] }],
    })
    expect(JSON.stringify(outcome)).not.toContain("4242")
    expect(outcome.ok).toBe(true)
    expect(limit!.get().value).toBe(20)
    expect(onLimitCommit).not.toHaveBeenCalled()
    expect(onValueCommit).toHaveBeenCalledTimes(1)
  })

  test("a step that fails after it moved the value still commits where it landed", async () => {
    const agent = createAgent()
    const onValueCommit = vi.fn()
    const instance = slider({ id: "seats", defaultValue: 12, onValueCommit })
    const root = document.body.appendChild(document.createElement("div"))
    root.setAttribute("aria-label", "Seats")
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Seats", action: "setValue", args: [2.5] }],
    })
    expect(outcome.error?.message).toMatch(/took 3, not 2\.5/)
    expect(onValueCommit.mock.calls).toEqual([
      [3, { reason: "imperative", source: "agent", thumb: null }],
    ])
  })

  test("a slider given text takes the number in it", async () => {
    const agent = createAgent()
    const instance = slider({
      id: "retention",
      min: 30,
      max: 365,
      defaultValue: 30,
    })
    const root = document.createElement("div")
    root.setAttribute("aria-label", "Data retention")
    document.body.append(root)
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    await agent.act({
      steps: [{ ref: "Data retention", action: "setValue", args: ["90 days"] }],
    })
    expect(instance.get().value).toBe(90)
    const outcome = await agent.act({
      steps: [{ ref: "Data retention", action: "setValue", args: ["a lot"] }],
    })
    expect(outcome.error?.message).toMatch(/takes a number/)
  })

  test("a number field refuses text with grouped digits, which would read as the first group", async () => {
    const agent = createAgent()
    const instance = numberInput({ id: "price", defaultValue: 10 })
    const el = document.body.appendChild(document.createElement("input"))
    el.setAttribute("aria-label", "Price")
    cleanups.push(bind(instance.part("control"), el), () => instance.destroy())
    for (const text of ["1,499.5", "1 499", "1.499,5"]) {
      const outcome = await agent.act({
        steps: [{ ref: "Price", action: "setValue", args: [text] }],
      })
      expect(outcome.error?.message).toMatch(/takes a number/)
    }
    expect(instance.get().value).toBe(10)
    await agent.act({
      steps: [{ ref: "Price", action: "setValue", args: ["1499"] }],
    })
    expect(instance.get().value).toBe(1499)
  })

  test("a select with a few items shows them", () => {
    const agent = createAgent()
    const instance = select({
      id: "visibility",
      items: ["Private", "Internal", "Public"],
    })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Visibility")
    document.body.append(el)
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const visibility = agent
      .snapshot()
      .find((component) => component.label === "Visibility")
    expect(visibility?.items).toEqual([
      { value: "Private", label: "Private" },
      { value: "Internal", label: "Internal" },
      { value: "Public", label: "Public" },
    ])
  })

  // A row's actions popover whose Remove button renders once it opens, the
  // way an adapter renders its content, and every open change it hears.
  async function mountActions({
    confirm,
    disabled,
    ariaDisabled,
    inDisabledFieldset,
    triggerId,
  }: {
    confirm?: string
    disabled?: boolean
    ariaDisabled?: boolean
    inDisabledFieldset?: boolean
    triggerId?: string
  } = {}) {
    const { popover } = await import("../src/components/popover/popover")
    const onClick = vi.fn()
    const changes: [boolean, string][] = []
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    const instance = popover({
      id: "actions",
      onOpenChange: (open, details) => {
        changes.push([open, details.source])
        if (!open) {
          return content.replaceChildren()
        }
        const remove = document.createElement("button")
        remove.textContent = "Remove"
        if (confirm) {
          remove.setAttribute("data-agent-confirm", confirm)
        }
        remove.disabled = !!disabled
        if (ariaDisabled) {
          remove.setAttribute("aria-disabled", "true")
        }
        remove.addEventListener("click", onClick)
        if (inDisabledFieldset) {
          const fieldset = content.appendChild(
            document.createElement("fieldset")
          )
          fieldset.disabled = true
          fieldset.append(remove)
        } else {
          content.append(remove)
        }
      },
    })
    const trigger = document.createElement("button")
    trigger.setAttribute("aria-label", "Actions for Tom Becker")
    document.body.append(trigger, content)
    cleanups.push(
      bind(
        instance.part("trigger", triggerId ? { id: triggerId } : undefined),
        trigger
      ),
      bind(instance.part("content"), content),
      () => instance.destroy()
    )
    return { instance, onClick, changes }
  }

  test("press opens a closed popup to press a button inside it", async () => {
    const agent = createAgent()
    const { onClick } = await mountActions()
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["remove"] }],
    })
    // The popover stays open here, since its button doesn't close it, and the step says what it pressed.
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        {
          result: expect.stringMatching(
            /^Pressed "Remove", after opening c\d+\.$/
          ),
        },
      ],
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("press takes a button whose words the text holds in order from its first, and refuses any other near miss", async () => {
    const agent = createAgent()
    const { popover } = await import("../src/components/popover/popover")
    const pressed: string[] = []
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    const instance = popover({ id: "row-actions", defaultOpen: true })
    for (const text of ["Edit", "Mark paid", "Archive"]) {
      const el = content.appendChild(document.createElement("button"))
      el.textContent = text
      el.addEventListener("click", () => pressed.push(text))
    }
    content.setAttribute("aria-label", "Actions for Noor Rahman")
    document.body.append(content)
    cleanups.push(bind(instance.part("content"), content), () =>
      instance.destroy()
    )
    const press = (text: string) =>
      agent.act({
        steps: [{ ref: "Noor Rahman", action: "press", args: [text] }],
      })
    expect((await press("Mark as paid")).ok).toBe(true)
    expect((await press("Mark it paid now")).ok).toBe(true)
    expect(pressed).toEqual(["Mark paid", "Mark paid"])
    for (const text of ["Paid mark", "Do not mark paid", "Archive order"]) {
      expect((await press(text)).error?.message).toContain(
        `No button "${text}"`
      )
    }
    expect(pressed).toHaveLength(2)
  })

  test("press with no text clicks a closed popup's trigger, which opens it", async () => {
    const agent = createAgent()
    const { instance } = await mountActions()
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press" }],
    })
    expect(outcome).toMatchObject({ ok: true })
    expect(instance.get().open).toBe(true)
  })

  test("press with no text opens a popup whose one trigger has a key, like a web component's id", async () => {
    const agent = createAgent()
    const { instance } = await mountActions({ triggerId: "auto-1" })
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press" }],
    })
    expect(outcome).toMatchObject({ ok: true })
    expect(instance.get().open).toBe(true)
  })

  test("a press on a disabled button fails, and closes the popup it opened", async () => {
    const agent = createAgent()
    const { instance, onClick } = await mountActions({ disabled: true })
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: { message: expect.stringContaining('"Remove"') },
    })
    expect(outcome.error?.message).toContain("disabled")
    expect(instance.get().open).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on an aria-disabled button fails, and closes the popup it opened", async () => {
    const agent = createAgent()
    const { instance, onClick } = await mountActions({ ariaDisabled: true })
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: { message: expect.stringContaining('"Remove"') },
    })
    expect(outcome.error?.message).toContain("disabled")
    expect(instance.get().open).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on a disabled button in a popup the person opened fails, and leaves it open", async () => {
    const agent = createAgent()
    const { instance, onClick } = await mountActions({ disabled: true })
    ;(instance.api as unknown as { setOpen: (open: boolean) => void }).setOpen(
      true
    )
    await vi.waitFor(() => expect(instance.get().open).toBe(true))
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    expect(outcome.ok).toBe(false)
    expect(instance.get().open).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on a button a disabled fieldset disables fails", async () => {
    const agent = createAgent()
    const { onClick } = await mountActions({ inDisabledFieldset: true })
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: { message: expect.stringContaining("disabled") },
    })
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on a button disabled while its confirmation is pending fails, and closes the popup", async () => {
    let answer: ((allowed: boolean) => void) | undefined
    const agent = createAgent({
      allow: (step) =>
        !step.confirm || new Promise<boolean>((resolve) => (answer = resolve)),
    })
    const { instance, onClick } = await mountActions({
      confirm: "Removes Tom from the team",
    })
    const outcome = agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    await vi.waitFor(() => expect(answer).toBeDefined())
    const remove = [...document.querySelectorAll("button")].find(
      (el) => el.textContent === "Remove"
    )!
    remove.disabled = true
    answer!(true)
    const result = await outcome
    expect(result).toMatchObject({
      ok: false,
      error: { message: expect.stringContaining('"Remove"') },
    })
    expect(result.error?.message).toContain("disabled")
    expect(instance.get().open).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press allow refuses doesn't open the popup", async () => {
    const allow = vi.fn(() => false)
    const agent = createAgent({ allow })
    const { instance, changes } = await mountActions()
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    expect(outcome.error?.message).toMatch(/^The app refused press on c\d+\.$/)
    expect(allow).toHaveBeenCalledWith(
      expect.objectContaining({ action: "press", args: ["Remove"] }),
      expect.anything()
    )
    expect(changes).toEqual([])
    expect(instance.get().open).toBe(false)
  })

  test("a press refused once its button shows closes the popup it opened", async () => {
    const agent = createAgent({ allow: (step) => !step.confirm })
    const { instance, onClick, changes } = await mountActions({
      confirm: "Removes Tom from the team",
    })
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    expect(outcome.error?.message).toBe(
      'The person said no to "Removes Tom from the team".'
    )
    expect(changes).toEqual([
      [true, "agent"],
      [false, "agent"],
    ])
    expect(instance.get().open).toBe(false)
    expect(onClick).not.toHaveBeenCalled()

    const alone = await createAgent().act({
      steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }],
    })
    expect(alone.error?.message).toMatch(/^Needs a person/)
    expect(instance.get().open).toBe(false)
  })

  test("a dialog shared by many triggers lists them, and a press opens it through the one it names", async () => {
    const agent = createAgent()
    const instance = dialog({ id: "edit" })
    const clicked: string[] = []
    for (const card of ["Alpha", "Beta"]) {
      const trigger = document.body.appendChild(
        document.createElement("button")
      )
      trigger.textContent = `Edit ${card}`
      trigger.addEventListener("click", () => clicked.push(card))
      cleanups.push(
        bind(instance.part("trigger", { id: card, payload: card }), trigger)
      )
    }
    cleanups.push(() => instance.destroy())
    const [component] = agent.snapshot().filter((found) => !found.offPage)
    expect(component).toMatchObject({
      component: "dialog",
      buttons: ["Edit Alpha", "Edit Beta"],
    })
    expect(component.actions).toContain("press")
    const outcome = await agent.act({
      steps: [{ ref: component.ref, action: "press", args: ["Edit Beta"] }],
    })
    expect(outcome.ok, outcome.error?.message).toBe(true)
    expect(clicked).toEqual(["Beta"])
    expect(instance.get()).toMatchObject({ open: true, payload: "Beta" })
  })

  test("a refused press returns once the dialog it opened has left the page", async () => {
    let unbindOpen: (() => void)[] = []
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    const instance = dialog({
      id: "delete",
      onOpenChange: (open) => {
        if (!open) {
          requestAnimationFrame(() => {
            unbindOpen.forEach((unbind) => unbind())
            unbindOpen = []
            content.replaceChildren()
          })
          return
        }
        const title = document.createElement("h2")
        title.textContent = "Delete Apollo?"
        const remove = document.createElement("button")
        remove.textContent = "Delete forever"
        remove.setAttribute("data-agent-confirm", "Deletes the project")
        content.append(title, remove)
        unbindOpen = [
          bind(instance.part("content"), content),
          bind(instance.part("title"), title),
        ]
      },
    })
    const trigger = document.createElement("button")
    trigger.textContent = "Delete project"
    document.body.append(trigger, content)
    cleanups.push(bind(instance.part("trigger"), trigger), () => {
      unbindOpen.forEach((unbind) => unbind())
      instance.destroy()
    })
    let approve = false
    const agent = createAgent({ allow: (step) => !step.confirm || approve })
    const remove = {
      steps: [
        { ref: "Delete project", action: "press", args: ["Delete forever"] },
      ],
    }

    expect((await agent.act(remove)).error?.message).toBe(
      'The person said no to "Deletes the project".'
    )
    approve = true
    expect(await agent.act(remove)).toMatchObject({ ok: true })
  })

  test("query and a refused step's message read a closed popup without opening it", async () => {
    const agent = createAgent()
    const { changes } = await mountActions()
    expect(await agent.query({ within: "Tom Becker" })).toEqual([
      expect.objectContaining({ items: [] }),
    ])
    const outcome = await agent.act({
      steps: [{ ref: "Tom Becker", action: "setChecked", args: [true] }],
    })
    expect(outcome.error?.message).toMatch(
      /press takes the text of a button inside it, and opens it first/
    )
    expect(changes).toEqual([])
  })

  test("a click is a press, and so is a value that names a button on a component with only buttons", async () => {
    const agent = createAgent()
    const { onClick } = await mountActions()
    for (const action of ["click", "setValue"]) {
      const outcome = await agent.act({
        steps: [{ ref: "Tom Becker", action, args: ["Remove"] }],
      })
      expect(outcome.ok).toBe(true)
    }
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  // A select without item data, whose items render only while it's open.
  function mountRenderedRegion(
    onOpenChange: (open: boolean) => void = () => {}
  ) {
    const content = document.createElement("div")
    const unbindItems: (() => void)[] = []
    const instance: ReturnType<typeof select> = select({
      id: "rendered-region",
      onOpenChange: (open) => {
        onOpenChange(open)
        unbindItems.splice(0).forEach((unbind) => unbind())
        content.replaceChildren()
        if (!open) {
          return
        }
        for (const [value, label] of [
          ["de", "Germany"],
          ["fr", "France"],
        ]) {
          const item = document.createElement("div")
          item.textContent = label
          content.append(item)
          unbindItems.push(bind(instance.part("item", { value }), item))
        }
      },
    })
    const trigger = document.createElement("button")
    trigger.setAttribute("aria-label", "Region")
    document.body.append(trigger, content)
    cleanups.push(bind(instance.part("trigger"), trigger), () => {
      unbindItems.forEach((unbind) => unbind())
      instance.destroy()
    })
    return instance
  }

  test("a list whose items show only while it's open is opened for a label only once allow lets the step", async () => {
    const onOpenChange = vi.fn()
    const refused = createAgent({ allow: () => false })
    const instance = mountRenderedRegion(onOpenChange)
    const refusal = await refused.act({
      steps: [{ ref: "Region", action: "setValue", args: ["Germany"] }],
    })
    expect(refusal.ok).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()

    const asked: unknown[][] = []
    const allow = (step: { args: unknown[] }) => asked.push(step.args) > 0
    const outcome = await createAgent({ allow }).act({
      steps: [{ ref: "Region", action: "setValue", args: ["Germany"] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toBe("de")
    // Before it opens, with the label the agent gave, and then with the item's value.
    expect(asked).toEqual([["Germany"], ["de"]])
  })

  test("query on a list whose items show only while it's open leaves it closed and says how act reaches them", async () => {
    const onOpenChange = vi.fn()
    mountRenderedRegion(onOpenChange)
    const [region] = (await createAgent().query({
      within: "Region",
    })) as AgentComponent[]
    expect(region).toMatchObject({
      items: [],
      note: expect.stringMatching(/act's setValue takes an item's label/),
    })
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  test("on a long page, act's values keep the fields it touched or changed, then others up to 100, and how many more", async () => {
    const agent = createAgent()
    for (let index = 0; index < 150; index++) {
      mountCheckbox({ id: `admin-${index}` }, `Admin ${index}`)
    }
    const outcome = await agent.act({
      steps: [{ ref: "Admin 149", action: "setChecked", args: [true] }],
    })
    const { more, ...fields } = outcome.values
    expect(Object.keys(fields)).toHaveLength(100)
    // At least the 50 checkboxes past the first 100, and fields earlier tests left off the page.
    expect(more).toBeGreaterThanOrEqual(50)
    expect(fields[`${outcome.steps[0].ref} Admin 149`]).toBe(true)
  })
})

describe("a custom action that returns a Promise", () => {
  const drafts = definePrimitive({
    name: "drafts",
    state: (_options: {}) => ({}),
    api: () => ({
      save: async (fails: boolean) => {
        await Promise.resolve()
        if (fails) {
          throw new Error("The server is down.")
        }
      },
    }),
    slots: (slot) => ({
      root: slot({ attrs: () => ({ "aria-label": "Drafts" }) }),
    }),
    agent: { actions: ["save"] },
  })

  function mount() {
    const instance = drafts({ id: "drafts" })
    const el = document.body.appendChild(document.createElement("div"))
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
  }

  test("is still running when the step ends", async () => {
    const agent = createAgent()
    mount()
    const outcome = await agent.act({
      steps: [{ ref: "Drafts", action: "save", args: [false] }],
    })
    expect(outcome).toMatchObject({ ok: true, steps: [{ result: "pending" }] })
  })

  test("fails the step when it rejects before the step ends", async () => {
    const agent = createAgent()
    mount()
    const outcome = await agent.act({
      steps: [{ ref: "Drafts", action: "save", args: [true] }],
    })
    expect(outcome.ok).toBe(false)
    expect(JSON.stringify(outcome)).toContain("The server is down.")
  })
})

describe("a primitive's agent key", () => {
  // A size picker built from scratch, the way someone builds their own primitive.
  const sizes = (agent?: Parameters<typeof definePrimitive>[0]["agent"]) =>
    definePrimitive({
      name: "size-picker",
      options: { visible: "boolean" },
      state: (options: { visible?: boolean }) => ({
        value: "m",
        items: ["s", "m", "l"],
        visible: options.visible ?? true,
      }),
      api: ({ store }) => ({
        setValue: (value: string) => store.set({ value }),
        resetSizes: () => store.set({ value: "m" }),
      }),
      slots: (slot) => ({
        root: slot({ attrs: () => ({ "aria-label": "Size" }) }),
      }),
      agent,
    })

  function mount(
    primitive: ReturnType<typeof sizes>,
    options: { visible?: boolean } = {}
  ) {
    const instance = primitive({ id: "size", ...options })
    const el = document.createElement("div")
    // As a framework writes the root's attributes.
    el.setAttribute("aria-label", "Size")
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    return instance
  }

  test("without one, the actions are the api's methods named like a change", () => {
    const agent = createAgent()
    mount(sizes())
    expect(agent.snapshot()[0].actions).toEqual(["setValue", "resetSizes"])
  })

  test("its items show in the snapshot when none are on the page", () => {
    const agent = createAgent()
    mount(sizes())
    expect(agent.snapshot()[0].items).toEqual([
      { value: "s", label: "s" },
      { value: "m", label: "m" },
      { value: "l", label: "l" },
    ])
  })

  test("the items its agent key gives show in the snapshot for any action", async () => {
    const steps = [
      { value: "account", label: "Account" },
      { value: "profile", label: "Profile" },
    ]
    const stepper = definePrimitive({
      name: "stepper",
      state: () => ({ value: "account" }),
      api: ({ store }) => ({ goTo: (value: string) => store.set({ value }) }),
      slots: (slot) => ({
        root: slot({ attrs: () => ({ "aria-label": "Signup" }) }),
      }),
      agent: { actions: ["goTo"], items: () => steps },
    })
    const instance = stepper({ id: "signup" })
    const el = document.createElement("div")
    el.setAttribute("aria-label", "Signup")
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const agent = createAgent()
    const [{ ref, items }] = agent.snapshot()
    expect(items).toEqual(steps)
    expect(
      (
        await agent.act({
          steps: [{ ref, action: "goTo", args: [items![1].value] }],
        })
      ).ok
    ).toBe(true)
    expect(instance.get()).toMatchObject({ value: "profile" })
  })

  test("an item on the page goes by the label its agent key gives, which act takes", async () => {
    const tickets = [
      { value: "t1", label: "Fix the login form" },
      { value: "t2", label: "Update the docs" },
    ]
    const ticketList = definePrimitive({
      name: "ticket-list",
      state: () => ({ value: "" }),
      api: ({ store }) => ({
        setValue: (value: string) => store.set({ value }),
      }),
      slots: (slot) => ({
        root: slot({ attrs: () => ({ "aria-label": "Tickets" }) }),
        item: slot<{ value: string }>({ props: { value: "string" } }),
      }),
      agent: { actions: ["setValue"], closed: true, items: () => tickets },
    })
    const instance = ticketList({ id: "tickets" })
    const root = document.createElement("div")
    root.setAttribute("aria-label", "Tickets")
    document.body.append(root)
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    tickets.forEach(({ value, label }, index) => {
      const el = document.createElement("div")
      el.innerHTML = `<span>T-${index + 1}</span> <p>${label}</p>`
      root.append(el)
      cleanups.push(bind(instance.part("item", { value }), el))
    })
    const agent = createAgent()
    const [{ ref, items }] = agent.snapshot()
    expect(items).toEqual(tickets)
    const outcome = await agent.act({
      steps: [{ ref, action: "setValue", args: [items![1].label] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get()).toMatchObject({ value: "t2" })
  })

  test("its actions are the only ones an agent sees and takes", async () => {
    const agent = createAgent()
    mount(sizes({ actions: ["setValue"] }))
    const [{ ref, actions }] = agent.snapshot()
    expect(actions).toEqual(["setValue"])
    const outcome = await agent.act({
      steps: [{ ref, action: "resetSizes", args: [] }],
    })
    expect(outcome.ok).toBe(false)
  })

  test("a closed list refuses text that names none of its items", async () => {
    const agent = createAgent()
    const open = mount(sizes({ actions: ["setValue"] }))
    const [{ ref }] = agent.snapshot()
    await agent.act({ steps: [{ ref, action: "setValue", args: ["xl"] }] })
    expect(open.get()).toMatchObject({ value: "xl" })
    cleanups.forEach((cleanup) => cleanup())
    cleanups = []
    const closed = mount(sizes({ actions: ["setValue"], closed: true }))
    const [{ ref: closedRef }] = agent.snapshot()
    const outcome = await agent.act({
      steps: [{ ref: closedRef, action: "setValue", args: ["xl"] }],
    })
    expect(outcome.ok).toBe(false)
    expect(closed.get()).toMatchObject({ value: "m" })
  })

  test("an action with no option in the schema takes its arguments unchecked", async () => {
    const agent = createAgent()
    const instance = mount(sizes({ actions: ["setValue"] }))
    const outcome = await agent.act({
      steps: [{ ref: "Size", action: "setValue", args: [42] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get()).toMatchObject({ value: 42 })
  })

  test("an input in a group with a clear button is one input, and clears by its label", async () => {
    const agent = createAgent()
    const field = input({ id: "website", defaultValue: "example.com" })
    const group = inputGroup({ id: "website-group" })
    const label = document.createElement("label")
    label.htmlFor = "website"
    label.textContent = "Website"
    const wrapper = document.createElement("div")
    const el = document.createElement("input")
    el.id = "website"
    const clear = document.createElement("button")
    clear.setAttribute("aria-label", "Clear website")
    wrapper.append(el, clear)
    document.body.append(label, wrapper)
    cleanups.push(
      bind(group.part("group"), wrapper),
      bind(field.part("root"), el),
      bind(group.part("clear"), clear),
      () => group.destroy(),
      () => field.destroy()
    )
    await Promise.resolve()
    expect(
      agent.snapshot().filter((component) => !component.offPage)
    ).toMatchObject([
      { component: "input", label: "Website", actions: ["setValue", "clear"] },
    ])
    const outcome = await agent.act({
      steps: [{ ref: "Website", action: "clear" }],
    })
    expect(outcome.error).toBeUndefined()
    expect(el.value).toBe("")
  })

  test("shown hides it from the agent while it returns false", () => {
    const agent = createAgent()
    mount(
      sizes({ shown: (state) => (state as { visible: boolean }).visible }),
      { visible: false }
    )
    expect(
      agent.snapshot().filter((component) => !component.offPage)
    ).toHaveLength(0)
  })

  test("a separator on the page is never listed, since it has nothing to read or change", () => {
    const agent = createAgent()
    const instance = separator({ id: "rule" })
    const el = document.createElement("hr")
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    expect(
      agent.snapshot().map((component) => component.component)
    ).not.toContain("separator")
  })

  test("a toast region is listed only while it holds a toast", () => {
    const agent = createAgent()
    const toast = createToaster({ overlays: createOverlays() })
    const instance = toastRegion({ id: "toasts", toaster: toast })
    const el = document.createElement("div")
    document.body.append(el)
    cleanups.push(bind(instance.part("region"), el), () => instance.destroy())
    const listed = () =>
      agent.snapshot().map((component) => component.component)
    expect(listed()).not.toContain("toast")
    toast("Saved")
    expect(listed()).toContain("toast")
  })
})

describe("agent source", () => {
  test("names where the app writes a component, from the nearest stamped element", () => {
    const agent = createAgent()
    const wrapper = document.createElement("div")
    wrapper.setAttribute("data-review-loc", "components/settings.tsx:12")
    document.body.append(wrapper)
    const instance = checkbox({ id: "notify" })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Notify me")
    wrapper.append(el)
    const unbind = bind(instance.part("root"), el)
    cleanups.push(() => {
      unbind()
      instance.destroy()
    })
    expect(agent.snapshot()[0]).toMatchObject({
      label: "Notify me",
      source: "components/settings.tsx:12",
    })
  })

  test("reads Svelte's element locations", () => {
    const agent = createAgent()
    const instance = checkbox({ id: "notify" })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Notify me")
    Object.assign(el, {
      __svelte_meta: { loc: { file: "src/lib/settings.svelte", line: 7 } },
    })
    document.body.append(el)
    const unbind = bind(instance.part("root"), el)
    cleanups.push(() => {
      unbind()
      instance.destroy()
    })
    expect(agent.snapshot()[0].source).toBe("src/lib/settings.svelte:7")
  })

  test("names where the app uses a Svelte component with no element of its own around it", () => {
    const agent = createAgent()
    const instance = checkbox({ id: "notify" })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Notify me")
    Object.assign(el, {
      __svelte_meta: {
        loc: { file: "packages/svelte/src/part.svelte", line: 33 },
        parent: {
          file: "node_modules/@ui-sdk/svelte/dist/checkbox.svelte",
          line: 73,
          parent: { file: "src/routes/+page.svelte", line: 10, parent: null },
        },
      },
    })
    document.body.append(el)
    const unbind = bind(instance.part("root"), el)
    cleanups.push(() => {
      unbind()
      instance.destroy()
    })
    expect(agent.snapshot()[0].source).toBe("src/routes/+page.svelte:10")
  })

  test("skips the Svelte adapter's own files for the app's", () => {
    const agent = createAgent()
    const instance = checkbox({ id: "notify" })
    const row = document.createElement("div")
    const el = row.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Notify me")
    Object.assign(el, {
      __svelte_meta: {
        loc: { file: "node_modules/@ui-sdk/svelte/dist/part.svelte", line: 40 },
      },
    })
    Object.assign(row, {
      __svelte_meta: { loc: { file: "src/lib/settings.svelte", line: 7 } },
    })
    document.body.append(row)
    const unbind = bind(instance.part("root"), el)
    cleanups.push(() => {
      unbind()
      instance.destroy()
    })
    expect(agent.snapshot()[0].source).toBe("src/lib/settings.svelte:7")
  })

  test("leaves it out when nothing says where", () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms" })
    expect(agent.snapshot()[0]).not.toHaveProperty("source")
  })
})

describe("agent act behind a closed tab or section", () => {
  // A settings page as an adapter renders it: a panel mounts while its tab is
  // selected and a section's switches while it's open, with their state kept above.
  function mountSettings({
    disabledTab,
    multiple,
    held,
    members = 0,
    removable,
  }: {
    disabledTab?: string
    multiple?: boolean
    held?: boolean
    members?: number
    removable?: boolean
  } = {}) {
    const saved: Record<string, boolean> = {}
    const moves: string[] = []
    // The attributes that name a panel after its tab or trigger, as an adapter renders them.
    const name = (part: Parameters<typeof bind>[0], el: HTMLElement) => {
      const rendered = attrs(part)
      for (const key of ["id", "role", "aria-labelledby"]) {
        if (typeof rendered[key] === "string") {
          el.setAttribute(key, rendered[key])
        }
      }
      return el
    }
    const addSwitch = (parent: HTMLElement, id: string, text: string) => {
      const instance = checkbox({
        id,
        defaultChecked: saved[id] ?? false,
        onCheckedChange: (checked) => (saved[id] = checked === true),
      })
      const label = parent.appendChild(document.createElement("label"))
      const el = label.appendChild(document.createElement("button"))
      label.append(text)
      const unbind = bind(instance.part("root"), el)
      return () => {
        unbind()
        instance.destroy()
        label.remove()
      }
    }
    let channels: ReturnType<typeof accordion> | undefined
    const addChannels = (parent: HTMLElement) => {
      const open = new Map<string, () => void>()
      const panels = new Map<string, HTMLElement>()
      const instance = accordion({
        id: "channels",
        multiple,
        onValueChange: (value) => {
          moves.push(`channels ${value.join(" ") || "none"}`)
          for (const [section, panel] of panels) {
            if (value.includes(section) && !open.has(section)) {
              const offs = [
                addSwitch(panel, `${section}-deploys`, "Deploy failures"),
                ...(section === "email"
                  ? [addSwitch(panel, "email-digest", "Weekly digest")]
                  : []),
              ]
              open.set(section, () => offs.forEach((off) => off()))
            } else if (!value.includes(section)) {
              open.get(section)?.()
              open.delete(section)
            }
          }
        },
      })
      channels = instance
      const unbinds = [
        ["email", "Email"],
        ["slack", "Slack"],
      ].flatMap(([value, text]) => {
        const item = parent.appendChild(document.createElement("div"))
        const trigger = item.appendChild(document.createElement("button"))
        trigger.textContent = text
        name(instance.part("trigger", { value }), trigger)
        const panel = item.appendChild(document.createElement("div"))
        panels.set(value, name(instance.part("panel", { value }), panel))
        return [
          bind(instance.part("item", { value }), item),
          bind(instance.part("trigger", { value }), trigger),
        ]
      })
      return () => {
        open.forEach((off) => off())
        unbinds.forEach((unbind) => unbind())
        instance.destroy()
        channels = undefined
      }
    }
    const pages: Record<string, (panel: HTMLElement) => () => void> = {
      general: (panel) => addSwitch(panel, "public", "Public project"),
      members: (panel) => {
        const offs = [addSwitch(panel, "invite", "Invite only")]
        for (let index = 1; index <= members; index++) {
          const row = panel.appendChild(document.createElement("li"))
          row.append(`Member ${index} Admin`)
          const el = row.appendChild(document.createElement("button"))
          el.setAttribute("aria-label", "Select")
          const instance = checkbox({ id: `member-${index}` })
          offs.push(bind(instance.part("root"), el), () => instance.destroy())
          if (removable) {
            const remove = button({ id: `remove-${index}` })
            const second = row.appendChild(document.createElement("button"))
            second.textContent = "Remove"
            offs.push(bind(remove.part("root"), second), () => remove.destroy())
          }
        }
        return () => offs.forEach((off) => off())
      },
      notifications: addChannels,
    }
    let leave: (() => void) | undefined
    const show = (value: string) => {
      leave?.()
      const panel = root.appendChild(document.createElement("div"))
      const off = pages[value](name(settings.part("panel", { value }), panel))
      leave = () => {
        off()
        panel.remove()
      }
    }
    const select = (value: string) => {
      moves.push(`settings ${value}`)
      show(value)
    }
    // Held, the tabs are controlled by a parent that takes each change 100ms later.
    const later = (value: unknown) =>
      setTimeout(() => {
        settings.setOptions({
          id: "settings",
          value: value as string,
          onValueChange: later,
        })
        select(value as string)
      }, 100)
    const settings = tabs(
      held
        ? { id: "settings", value: "general", onValueChange: later }
        : {
            id: "settings",
            defaultValue: "general",
            onValueChange: (value) => select(value as string),
          }
    )
    const root = document.body.appendChild(document.createElement("div"))
    const list = root.appendChild(document.createElement("div"))
    list.setAttribute("aria-label", "Settings")
    cleanups.push(
      ...["General", "Members", "Notifications"].map((text) => {
        const tab = list.appendChild(document.createElement("button"))
        tab.textContent = text
        const value = text.toLowerCase()
        const part = settings.part("tab", {
          value,
          disabled: value === disabledTab,
        })
        return bind(part, name(part, tab))
      }),
      bind(settings.part("list"), list),
      bind(settings.part("root"), root),
      () => {
        leave?.()
        settings.destroy()
      }
    )
    show("general")
    return { settings, saved, moves, channels: () => channels }
  }

  const check = (ref: string, checked = true) => ({
    ref,
    action: "setChecked",
    args: [checked],
  })

  test("a step finds its component on another tab, selects the tab and says what came with it", async () => {
    const agent = createAgent()
    const { settings, saved } = mountSettings()
    const outcome = await agent.act({ steps: [check("Invite only")] })
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        {
          changes: [
            { component: "tabs", key: "value", value: "members" },
            { label: "Invite only", key: "checked", value: true },
          ],
        },
      ],
    })
    expect(settings.get().value).toBe("members")
    expect(saved.invite).toBe(true)
    expect(outcome.appeared.map((component) => component.label)).toContain(
      "Invite only"
    )
    expect(outcome.steps[0].gone).toHaveLength(1)
  })

  test("a step finds its component in a closed section of another tab", async () => {
    const agent = createAgent()
    const { settings, saved, channels } = mountSettings()
    const outcome = await agent.act({
      steps: [check("Public project"), check("Weekly digest")],
    })
    expect(outcome.ok).toBe(true)
    expect(settings.get().value).toBe("notifications")
    expect(channels()?.get().value).toEqual(["email"])
    expect(saved).toEqual({ public: true, "email-digest": true })
  })

  test("a name with its tab or section in front and no > finds the component there", async () => {
    const agent = createAgent()
    const { settings, saved, moves, channels } = mountSettings()
    expect(
      await agent.act({ steps: [check("Members invite only")] })
    ).toMatchObject({ ok: true })
    expect(settings.get().value).toBe("members")
    expect(
      await agent.act({ steps: [check("Slack deploy failures")] })
    ).toMatchObject({ ok: true })
    expect(channels()?.get().value).toEqual(["slack"])
    const looks = moves.length
    expect(
      await agent.act({ steps: [check("Slack Deploy failures", false)] })
    ).toMatchObject({ ok: true })
    expect(saved).toEqual({ invite: true, "slack-deploys": false })
    expect(moves.slice(looks)).toEqual([])
    const missing = await agent.act({
      steps: [check("Billing deploy failures")],
    })
    expect(missing.error?.message).toContain(
      'No component "Billing deploy failures" on the page.'
    )
  })

  test("snapshot ends by naming the closed tabs and sections, which act reaches", async () => {
    const agent = createAgent()
    mountSettings()
    expect(agent.snapshot().at(-1)).toMatchObject({
      ref: "closed",
      component: "closed",
      closed: ["Members", "Notifications"],
      actions: [],
    })
    await agent.act({ steps: [{ ref: "Notifications", action: "press" }] })
    expect(agent.snapshot().at(-1)?.closed).toEqual([
      "General",
      "Members",
      "Email",
      "Slack",
    ])
  })

  test("snapshot has no closed entry on a page with nothing closed", () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms" })
    expect(agent.snapshot().map((component) => component.ref)).not.toContain(
      "closed"
    )
  })

  test("a name two sections behind a tab share is refused, and the page goes back", async () => {
    const agent = createAgent()
    const { settings, saved } = mountSettings()
    const outcome = await agent.act({ steps: [check("Deploy failures")] })
    expect(outcome.error?.message).toBe(
      '"Deploy failures" is in 2 closed sections: Notifications > Email, Notifications > Slack. Put the one you mean first, like "Email > Deploy failures".'
    )
    expect(settings.get().value).toBe("general")
    expect(saved).toEqual({})
  })

  test("a section before the name picks between look-alikes, by the words it shares with where each is", async () => {
    const agent = createAgent()
    const { saved, channels } = mountSettings()
    const missing = await agent.act({
      steps: [check("Billing > Deploy failures")],
    })
    expect(missing.error?.message).toBe(
      'No "Deploy failures" in a section or tab named like "Billing". Behind what is closed: Members: Invite only. Notifications > Email: Deploy failures, Weekly digest. Notifications > Slack: Deploy failures.'
    )
    expect(
      await agent.act({ steps: [check("Slack > Deploy failures")] })
    ).toMatchObject({ ok: true })
    expect(saved).toEqual({ "slack-deploys": true })
    expect(
      await agent.act({
        steps: [check("Email notifications > Deploy failures")],
      })
    ).toMatchObject({ ok: true })
    expect(saved).toEqual({ "slack-deploys": true, "email-deploys": true })
    expect(channels()?.get().value).toEqual(["email"])
  })

  test("a place that only half fits is refused, with what each closed place holds", async () => {
    const agent = createAgent()
    const { saved, settings } = mountSettings()
    const outcome = await agent.act({
      steps: [check("Slack notifications > Weekly digest")],
    })
    expect(outcome.error?.message).toBe(
      'No "Weekly digest" in a section or tab named like "Slack notifications". Behind what is closed: Members: Invite only. Notifications > Email: Deploy failures, Weekly digest. Notifications > Slack: Deploy failures.'
    )
    expect(saved).toEqual({})
    expect(settings.get().value).toBe("general")
  })

  test("a wrong guess says what the closed tabs and sections hold, so the steps after it can be fixed with it", async () => {
    const agent = createAgent()
    const { settings, moves } = mountSettings()
    const outcome = await agent.act({
      steps: [
        { ref: "Settings", action: "setValue", args: ["Billing"] },
        check("Email > Weekly summary"),
      ],
    })
    expect(outcome.error?.message).toMatch(
      /^No item "Billing" in Settings \(c\d+\)\. Its items: General, Members, Notifications\. Behind what is closed: Members: Invite only\. Notifications > Email: Deploy failures, Weekly digest\. Notifications > Slack: Deploy failures\. Send it again with the step after it, 2 steps in one call\.$/
    )
    expect(settings.get().value).toBe("general")
    const looks = moves.length
    const refused = await agent.act({
      steps: [
        check("Public project"),
        { ref: "Public project", action: "press" },
      ],
    })
    expect(refused.error?.message).not.toContain("Behind what is closed")
    expect(moves).toHaveLength(looks)
  })

  test("a closed query reads what the other tabs and closed sections hold, and goes back", async () => {
    const agent = createAgent()
    const { settings, saved } = mountSettings()
    saved["email-digest"] = true
    const read = (components: unknown) =>
      (components as AgentComponent[])
        .filter(
          (component) =>
            component.component === "checkbox" &&
            (!component.offPage || component.section)
        )
        .map(
          ({ label, section, checked, offPage }) =>
            `${offPage ? `${section} > ` : ""}${label}: ${checked}`
        )
    expect(read(await agent.query({ closed: true }))).toEqual([
      "Public project: false",
      "Members > Invite only: false",
      "Notifications > Email > Deploy failures: false",
      "Notifications > Email > Weekly digest: true",
      "Notifications > Slack > Deploy failures: false",
    ])
    expect(settings.get().value).toBe("general")
    expect(
      read(await agent.query({ text: "deploy failures", closed: true }))
    ).toEqual([
      "Notifications > Email > Deploy failures: false",
      "Notifications > Slack > Deploy failures: false",
    ])
    // Without it, a query opens nothing.
    expect(read(await agent.query({ text: "Invite only" }))).toEqual([
      "Members > Invite only: false",
    ])
    const listed = await agent.query({ text: "Weekly digest" })
    expect(listed).toMatchObject([{ offPage: true, actions: [] }])
  })

  test("a closed query asks allow before each look, and a browser agent's asks registerTools' allow too", async () => {
    const asked: string[] = []
    const agent = createAgent({
      allow: (step) => {
        asked.push(`${step.action} ${step.args[0]}`)
        return step.args[0] !== "members"
      },
    })
    mountSettings()
    const labels = async (components: unknown) =>
      ((await components) as AgentComponent[]).flatMap((component) =>
        component.actions.length ? (component.label ?? []) : []
      )
    expect(await labels(agent.query({ closed: true }))).toEqual([
      "Settings",
      "Public project",
      "Deploy failures",
      "Weekly digest",
      "Deploy failures",
    ])
    expect(asked).toEqual([
      "setValue members",
      "setValue notifications",
      "open email",
      "open slack",
    ])
    const tools = new Map<string, { execute: (input: object) => unknown }>()
    Object.assign(document, {
      modelContext: {
        registerTool: async (tool: {
          name: string
          execute: (input: object) => unknown
        }) => tools.set(tool.name, tool),
      },
    })
    const remove = registerTools(agent, {
      allow: (step) => step.args[0] !== "notifications",
    })
    expect(await labels(tools.get("query")?.execute({ closed: true }))).toEqual(
      ["Settings", "Public project"]
    )
    remove()
    Reflect.deleteProperty(document, "modelContext")
  })

  test("a closed query whose look nobody answers says so and leaves the page as it was", async () => {
    const agent = createAgent({
      timeout: 50,
      allow: () => new Promise<boolean>(() => {}),
    })
    const { settings } = mountSettings()
    expect(await agent.query({ closed: true })).toEqual({
      error: expect.stringMatching(
        /^No answer to setValue on c\d+ in 50 ms, so it didn't run\. The page asks before an agent's step and nobody answered: tell the person what you could and couldn't do before trying again\. What is closed wasn't read\.$/
      ),
    })
    expect(settings.get().value).toBe("general")
    // The next call isn't held up.
    expect(await agent.query({ text: "Public project" })).toMatchObject([
      { label: "Public project" },
    ])
  })

  test("a wrong guess still fails as a step when the look for what is closed isn't answered", async () => {
    const agent = createAgent({
      timeout: 50,
      allow: (step) =>
        step.args[0] === "members" ? new Promise<boolean>(() => {}) : true,
    })
    const { settings } = mountSettings()
    const outcome = await agent.act({
      steps: [{ ref: "Settings", action: "setValue", args: ["Billing"] }],
    })
    expect(outcome.ok).toBe(false)
    expect(outcome.error?.message).toMatch(
      /^No item "Billing" in Settings \(c\d+\)\. Its items: General, Members, Notifications\./
    )
    expect(settings.get().value).toBe("general")
  })

  test("a browser agent's call that is cancelled or throws gets an error it can read", async () => {
    const agent = createAgent()
    const { settings } = mountSettings()
    const tools = new Map<
      string,
      { execute: (input: object, context?: object) => unknown }
    >()
    Object.assign(document, {
      modelContext: {
        registerTool: async (tool: {
          name: string
          execute: (input: object) => unknown
        }) => tools.set(tool.name, tool),
      },
    })
    const remove = registerTools(agent, {
      allow: (step) =>
        step.args[0] === "members" ? new Promise<boolean>(() => {}) : true,
    })
    const stop = new AbortController()
    const cancelled = tools
      .get("query")!
      .execute({ closed: true }, { signal: stop.signal })
    await Promise.resolve()
    stop.abort()
    expect(await cancelled).toEqual({
      error: expect.stringMatching(
        /^setValue on c\d+ was cancelled\. What is closed wasn't read\.$/
      ),
    })
    expect(settings.get().value).toBe("general")
    // A value JSON can't hold makes the call itself throw.
    expect(
      await tools.get("act")!.execute({
        steps: [{ ref: "Public project", action: "press", extra: 1n }],
      })
    ).toEqual({
      ok: false,
      error: { step: 0, message: expect.any(String) },
    })
    remove()
    Reflect.deleteProperty(document, "modelContext")
  })

  test("a set with no value, or a call with no steps, fails", async () => {
    const agent = createAgent()
    const { saved } = mountSettings()
    const unset = await agent.act({
      steps: [{ ref: "Public project", action: "setChecked" }],
    })
    expect(unset.error?.message).toMatch(
      /^setChecked on "Public project" needs its value, as "args": \[value\]\. No step ran\.$/
    )
    expect(saved).toEqual({})
    const empty = await agent.act({} as { steps: AgentStep[] })
    expect(empty).toMatchObject({ ok: false, error: { step: 0 } })
  })

  test("look-alikes in two sections keep their own refs, and say their section", async () => {
    const agent = createAgent()
    mountSettings({ multiple: true })
    const outcome = await agent.act({
      steps: [
        check("Email > Deploy failures"),
        { ref: "Slack", action: "open" },
      ],
    })
    expect(outcome.ok).toBe(true)
    const alike = agent
      .snapshot()
      .filter(
        (component) =>
          component.label === "Deploy failures" && !component.offPage
      )
    expect(alike.map((component) => component.section)).toEqual([
      "Notifications > Email",
      "Notifications > Slack",
    ])
    const [email, slack] = alike
    expect(email.ref).not.toBe(slack.ref)
    expect(outcome.values).toMatchObject({
      [`${email.ref} Email > Deploy failures`]: true,
      [`${slack.ref} Slack > Deploy failures`]: false,
    })
    const both = await agent.act({ steps: [check("Deploy failures", false)] })
    expect(both.error?.message).toContain(
      `"Deploy failures" names 2 components: ${email.ref} Deploy failures (in Email), ${slack.ref} Deploy failures (in Slack). Use a ref, or put its section first, like "Email > Deploy failures".`
    )
  })

  test("a row whose text holds a place and a name doesn't take the step for them", async () => {
    const agent = createAgent()
    const { saved } = mountSettings()
    const admin = mountCheckbox({ id: "admin" }, "Admin")
    const row = document.createElement("li")
    row.append("Email Deploy failures", document.body.lastElementChild!)
    document.body.append(row)
    cleanups.push(() => row.remove())
    expect(agent.snapshot().find(({ label }) => label === "Admin")?.row).toBe(
      "Email Deploy failures"
    )
    const outcome = await agent.act({
      steps: [check("Email > Deploy failures")],
    })
    expect(outcome.ok).toBe(true)
    expect(admin.get().checked).toBe(false)
    expect(saved["email-deploys"]).toBe(true)
  })

  test("a step that names a tab or a section and gives no value means that one", async () => {
    const agent = createAgent()
    const { settings, channels } = mountSettings()
    const outcome = await agent.act({
      steps: [
        { ref: "Notifications", action: "press" },
        { ref: "Email", action: "open" },
      ],
    })
    expect(outcome.ok).toBe(true)
    expect(settings.get().value).toBe("notifications")
    expect(channels()?.get().value).toEqual(["email"])
    expect(
      await agent.act({
        steps: [{ ref: "accordion", action: "press", args: ["Slack"] }],
      })
    ).toMatchObject({ ok: true })
    expect(channels()?.get().value).toEqual(["slack"])
    const unnamed = await agent.act({
      steps: [{ ref: "accordion", action: "open" }],
    })
    expect(unnamed.error?.message).toMatch(
      /^open on accordion \(c\d+\) takes one of its items: Email, Slack\.$/
    )
    expect(channels()?.get().value).toEqual(["slack"])
  })

  test("values keep a field its framework hasn't let go of yet", async () => {
    const agent = createAgent()
    const news = checkbox({ id: "news", defaultChecked: true })
    const el = document.body.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Newsletter")
    const unbind = bind(news.part("root"), el)
    cleanups.push(() => news.destroy())
    // React unbinds a component when it leaves and destroys it a moment later.
    mountCheckbox({
      id: "terms",
      onCheckedChange: () => {
        unbind()
        el.remove()
      },
    })
    const outcome = await agent.act({ steps: [check("Accept the terms")] })
    expect(Object.entries(outcome.values)).toContainEqual([
      expect.stringMatching(/^c\d+ Newsletter$/),
      true,
    ])
  })

  test("a section isn't named by a heading inside data-agent-hidden, and one that holds some names it with its other text", async () => {
    const agent = createAgent()
    const root = document.body.appendChild(document.createElement("div"))
    root.innerHTML = `
      <h3 id="plan" data-agent-hidden>Canary plan</h3>
      <div role="group" aria-labelledby="plan"><label><button></button>Deploy failures</label></div>
      <h3 id="chat">Slack <span data-agent-hidden>for Canary</span></h3>
      <div role="group" aria-labelledby="chat"><label><button></button>Deploy failures</label></div>
      <h3 id="mail">Email</h3>
      <div role="group" aria-labelledby="mail"><label><button></button>Deploy failures</label></div>`
    cleanups.push(() => root.remove())
    for (const [at, el] of [...root.querySelectorAll("button")].entries()) {
      const instance = checkbox({ id: `deploys-${at}` })
      const unbind = bind(instance.part("root"), el)
      cleanups.push(() => {
        unbind()
        instance.destroy()
      })
    }
    const screen = agent.snapshot().filter((component) => !component.offPage)
    expect(screen.map((component) => component.section)).toEqual([
      undefined,
      "Slack",
      "Email",
    ])
    const outcome = await agent.act({
      steps: [check("Email > Deploy failures")],
    })
    expect(outcome.ok).toBe(true)
    expect(JSON.stringify([screen, outcome])).not.toContain("Canary")
  })

  test("a component isn't named by text inside data-agent-hidden", async () => {
    const agent = createAgent()
    const root = document.body.appendChild(document.createElement("div"))
    root.innerHTML = `
      <h3 id="owner" data-agent-hidden>Canary owner</h3>
      <button aria-labelledby="owner"></button>
      <h3 id="alerts">Alerts <span data-agent-hidden>for Canary</span></h3>
      <button aria-labelledby="alerts"></button>
      <label>Deploys <span data-agent-hidden>at Canary</span><button></button></label>
      <button aria-label="Digest"><span data-agent-hidden>Canary</span></button>
      <button><span data-agent-hidden>Canary</span> Invoices</button>
      <button><span aria-labelledby="owner"></span> Receipts</button>
      <button><span aria-labelledby="alerts"></span> Refunds</button>`
    cleanups.push(() => root.remove())
    for (const [at, el] of [...root.querySelectorAll("button")].entries()) {
      const instance = checkbox({ id: `named-${at}` })
      const unbind = bind(instance.part("root"), el)
      cleanups.push(() => {
        unbind()
        instance.destroy()
      })
    }
    const screen = agent.snapshot().filter((component) => !component.offPage)
    expect(screen.map((component) => component.label)).toEqual([
      undefined,
      "Alerts",
      "Deploys",
      "Digest",
      "Invoices",
      "Receipts",
      "Refunds",
    ])
    const outcome = await agent.act({ steps: [check("Nowhere")] })
    expect(outcome.ok).toBe(false)
    expect(JSON.stringify([screen, agent.query({}), outcome])).not.toContain(
      "Canary"
    )
  })

  test("what a field holds, or what hidden takes off the page, is never read as a name or as a row's text", async () => {
    const agent = createAgent()
    const root = document.body.appendChild(document.createElement("div"))
    root.innerHTML = `
      <label>Notes <span data-agent-hidden>for Canary</span><span hidden>zq7canary</span>
        <textarea data-agent-secret>zq7canary</textarea></label>
      <label>Plan <span data-agent-hidden>for Canary</span>
        <button></button><select><option>zq7canary</option></select></label>
      <ul><li>Jane <span hidden>zq7canary</span>
        <textarea data-agent-secret>zq7canary</textarea><button></button></li></ul>`
    cleanups.push(() => root.remove())
    for (const [at, el] of [...root.querySelectorAll("textarea")].entries()) {
      const instance = textarea({ id: `notes-${at}` })
      const unbind = bind(instance.part("root"), el)
      cleanups.push(() => {
        unbind()
        instance.destroy()
      })
    }
    for (const [at, el] of [...root.querySelectorAll("button")].entries()) {
      const instance = checkbox({ id: `held-${at}` })
      const unbind = bind(instance.part("root"), el)
      cleanups.push(() => {
        unbind()
        instance.destroy()
      })
    }
    const screen = agent.snapshot().filter((component) => !component.offPage)
    expect(screen.map((component) => [component.label, component.row])).toEqual(
      [
        ["Notes", undefined],
        [undefined, "Jane"],
        ["Plan", undefined],
        [undefined, "Jane"],
      ]
    )
    const outcome = await agent.act({ steps: [check("Nowhere")] })
    expect(JSON.stringify([screen, agent.query({}), outcome])).not.toMatch(
      /canary/i
    )
  })

  test("a confirm mark on a part alone in its slot with a key of its own asks on every step, and shows in the snapshot", async () => {
    const agent = createAgent()
    const instance = collapsible({ id: "billing" })
    const trigger = document.body.appendChild(document.createElement("button"))
    trigger.textContent = "Billing"
    trigger.setAttribute("data-agent-confirm", "Shows what you pay")
    const unbind = bind(instance.part("trigger", { id: "auto-1" }), trigger)
    cleanups.push(() => {
      unbind()
      instance.destroy()
      trigger.remove()
    })
    expect(agent.snapshot().find(({ label }) => label === "Billing")).toEqual(
      expect.objectContaining({ confirm: "Shows what you pay" })
    )
    const outcome = await agent.act({
      steps: [{ ref: "Billing", action: "setOpen", args: [true] }],
    })
    expect(outcome.error?.message).toBe(
      'Needs a person: "Shows what you pay". Ask them to make this change themselves.'
    )
    expect(instance.get().open).toBe(false)
  })

  test("a field that was never shown isn't in a call's values, on a failed call either", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms" })
    for (const [attribute, value] of [
      ["hidden", ""],
      ["aria-hidden", "true"],
    ]) {
      const region = document.body.appendChild(document.createElement("div"))
      region.setAttribute(attribute, value)
      const label = region.appendChild(document.createElement("label"))
      const el = label.appendChild(document.createElement("input"))
      label.append(`Promo code ${attribute}`)
      const code = input({ id: `code-${attribute}`, defaultValue: "zq7canary" })
      const unbind = bind(code.part("root"), el)
      cleanups.push(() => {
        unbind()
        code.destroy()
        region.remove()
      })
    }
    const done = await agent.act({ steps: [check("Accept the terms")] })
    expect(done.ok).toBe(true)
    const failed = await agent.act({ steps: [check("Nowhere")] })
    expect(failed.ok).toBe(false)
    // Gone from the page, they aren't remembered either.
    cleanups.splice(1).forEach((cleanup) => cleanup())
    const after = await agent.act({ steps: [check("Accept the terms")] })
    expect(JSON.stringify([done, failed, after, agent.snapshot()])).not.toMatch(
      /zq7canary|Promo code/
    )
  })

  test("a failed step says the steps before it stay done and what to send again", async () => {
    const agent = createAgent()
    const { saved } = mountSettings()
    const outcome = await agent.act({
      steps: [
        check("Public project"),
        check("Nothing by this name"),
        check("Invite only"),
        check("Weekly digest"),
      ],
    })
    expect(outcome.error).toMatchObject({
      step: 1,
      message: expect.stringMatching(
        / The steps before this one stay done\. Send it again with the 2 steps after it, 3 steps in one call\.$/
      ),
    })
    expect(outcome.error?.message).toContain("Behind what is closed: Members")
    expect(outcome.error?.message).not.toContain("which a step can open first")
    expect(saved).toEqual({ public: true })
  })

  test("allow is asked before each tab or section opens to look, and a no keeps it closed", async () => {
    const asked: string[] = []
    const agent = createAgent({
      allow: (step) => {
        asked.push(`${step.action} ${step.args[0]}`)
        return step.args[0] !== "notifications"
      },
    })
    const { settings, moves } = mountSettings()
    const outcome = await agent.act({ steps: [check("Weekly digest")] })
    expect(outcome.error?.message).toMatch(
      /^No component "Weekly digest" on the page\. .* It may be behind one of these, which a step can open first: Settings \(c\d+\): Members, Notifications\. Behind what is closed: Members: Invite only\.$/
    )
    expect(asked).toEqual(["setValue members", "setValue notifications"])
    expect(moves).toEqual(["settings members", "settings general"])
    expect(settings.get().value).toBe("general")
  })

  test("a tab its parent selects a moment later is still looked behind", async () => {
    const agent = createAgent()
    const { settings, saved } = mountSettings({ held: true })
    const outcome = await agent.act({ steps: [check("Invite only")] })
    expect(outcome.ok).toBe(true)
    expect(settings.get().value).toBe("members")
    expect(saved).toEqual({ invite: true })
  })

  test("a tab its parent selects a moment later is back before the next one opens", async () => {
    const agent = createAgent()
    const { settings, moves } = mountSettings({ held: true })
    const outcome = await agent.act({ steps: [check("Nowhere")] })
    expect(outcome.ok).toBe(false)
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(moves).toEqual([
      "settings members",
      "settings general",
      "settings notifications",
      "channels email",
      "channels none",
      "channels slack",
      "channels none",
      "settings general",
    ])
    expect(settings.get().value).toBe("general")
  })

  test("a tab inside data-agent-confirm isn't opened to look, and a step on it needs a person", async () => {
    const asked: string[] = []
    const { moves } = mountSettings()
    const members = [...document.querySelectorAll("button")].find(
      (button) => button.textContent === "Members"
    )!
    members.setAttribute("data-agent-confirm", "Shows who is on the project")
    const outcome = await createAgent().act({ steps: [check("Invite only")] })
    expect(outcome.ok).toBe(false)
    const guarded = createAgent({
      allow: (step) => {
        asked.push(`${step.action} ${step.args[0]}`)
        return true
      },
    })
    await guarded.act({ steps: [check("Invite only")] })
    await guarded.query({ closed: true })
    expect(asked).not.toContain("setValue members")
    expect(moves).not.toContain("settings members")
    const named = await createAgent().act({
      steps: [{ ref: "Settings", action: "setValue", args: ["Members"] }],
    })
    expect(named.error?.message).toMatch(
      /^Needs a person: "Shows who is on the project"\./
    )
    expect(moves).not.toContain("settings members")
  })

  test("a look that allow stops part way puts the tab back", async () => {
    const { settings, moves } = mountSettings()
    const agent = createAgent({
      allow: (step) => {
        if (step.component === "accordion") {
          throw new Error("Nobody answered")
        }
        return true
      },
    })
    const outcome = await agent.act({ steps: [check("Nowhere")] })
    expect(outcome.ok).toBe(false)
    expect(moves).toContain("settings notifications")
    expect(settings.get().value).toBe("general")
  })

  test("a disabled tab isn't opened to look", async () => {
    const agent = createAgent()
    const { moves } = mountSettings({ disabledTab: "members" })
    const outcome = await agent.act({ steps: [check("Invite only")] })
    expect(outcome.ok).toBe(false)
    expect(moves).not.toContain("settings members")
  })

  test("sections open to look before tabs do, and tabs stay when a section has it", async () => {
    const agent = createAgent()
    const { moves } = mountSettings()
    await agent.act({ steps: [{ ref: "Notifications", action: "press" }] })
    moves.length = 0
    const outcome = await agent.act({ steps: [check("Weekly digest")] })
    expect(outcome.ok).toBe(true)
    expect(moves).toEqual([
      "channels email",
      "channels none",
      "channels slack",
      "channels none",
      "channels email",
    ])
  })

  test("a name the page has twice is refused without opening anything", async () => {
    const agent = createAgent()
    const { moves } = mountSettings()
    mountCheckbox({ id: "public-copy" }, "Public project")
    const outcome = await agent.act({ steps: [check("Public project")] })
    expect(outcome.error?.message).toMatch(
      /^"Public project" names 2 components/
    )
    expect(moves).toEqual([])
  })

  // An orders list as an adapter renders it: a page's rows mount while it's the
  // current page, and the fields under More options while that is open.
  async function mountOrders() {
    const { collapsible } =
      await import("../src/components/collapsible/collapsible")
    const saved: Record<string, boolean> = {}
    const root = document.body.appendChild(document.createElement("div"))
    const addSwitch = (parent: HTMLElement, id: string, text: string) => {
      const instance = checkbox({
        id,
        defaultChecked: saved[id] ?? false,
        onCheckedChange: (checked) => (saved[id] = checked === true),
      })
      const label = parent.appendChild(document.createElement("label"))
      const el = label.appendChild(document.createElement("button"))
      label.append(text)
      const unbind = bind(instance.part("root"), el)
      return () => {
        unbind()
        instance.destroy()
        label.remove()
      }
    }
    const rows = root.appendChild(document.createElement("div"))
    let leave = addSwitch(rows, "order-1", "Order 1")
    const pages = pagination({
      id: "pages",
      pageCount: 3,
      onPageChange: (page) => {
        leave()
        leave = addSwitch(rows, `order-${page}`, `Order ${page}`)
      },
    })
    const nav = root.appendChild(document.createElement("nav"))
    nav.setAttribute("aria-label", "Pages")
    const panel = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    let close: (() => void) | undefined
    const more = collapsible({
      id: "more",
      onOpenChange: (open) => {
        close?.()
        close = open ? addSwitch(panel, "gift", "Gift wrap") : undefined
      },
    })
    const trigger = root.appendChild(document.createElement("button"))
    trigger.textContent = "More options"
    root.append(panel)
    cleanups.push(
      bind(pages.part("root"), nav),
      bind(more.part("trigger"), trigger),
      bind(more.part("panel"), panel),
      () => leave(),
      () => close?.(),
      () => pages.destroy(),
      () => more.destroy()
    )
    return { pages, more, saved, root }
  }

  test("a section and a collapsible inside data-agent-confirm aren't opened to look, and a step on one needs a person", async () => {
    const mark = (text: string, says: string) =>
      [...document.querySelectorAll("button")]
        .find((button) => button.textContent === text)!
        .setAttribute("data-agent-confirm", says)
    const { moves } = mountSettings()
    const { more } = await mountOrders()
    const agent = createAgent()
    await agent.act({ steps: [{ ref: "Notifications", action: "press" }] })
    mark("Email", "Shows the email settings")
    mark("More options", "Shows the gift options")
    const section = await agent.act({
      steps: [{ ref: "Email", action: "open" }],
    })
    expect(section.error?.message).toMatch(
      /^Needs a person: "Shows the email settings"\./
    )
    const options = await agent.act({
      steps: [{ ref: "More options", action: "setOpen", args: [true] }],
    })
    expect(options.error?.message).toMatch(
      /^Needs a person: "Shows the gift options"\./
    )
    expect((await agent.act({ steps: [check("Gift wrap")] })).ok).toBe(false)
    expect(moves).toContain("channels slack")
    expect(moves).not.toContain("channels email")
    expect(more.get().open).toBe(false)
  })

  test("what a closed section still holds as it animates out isn't taken for the next one's", async () => {
    const { collapsible } =
      await import("../src/components/collapsible/collapsible")
    const agent = createAgent()
    const saved: Record<string, boolean> = {}
    const sections = [
      ["Email", "Weekly summary"],
      ["Slack", "Mentions"],
    ].map(([name, field]) => {
      const trigger = document.body.appendChild(
        document.createElement("button")
      )
      trigger.textContent = name
      const panel = document.body.appendChild(
        Object.assign(document.createElement("div"), {
          getAnimations: () => [],
        })
      )
      // Like Svelte, which keeps what's leaving bound and inert for its outro, and brings it back.
      let content: HTMLElement | undefined
      let leaving: ReturnType<typeof setTimeout> | undefined
      const instance = collapsible({
        id: name,
        onOpenChange: (open) => {
          clearTimeout(leaving)
          if (!open) {
            content?.setAttribute("inert", "")
            leaving = setTimeout(() => {
              content?.remove()
              content = undefined
            }, 300)
            return
          }
          content?.removeAttribute("inert")
          if (content) {
            return
          }
          content = panel.appendChild(document.createElement("label"))
          const toggle = checkbox({
            id: field,
            onCheckedChange: (checked) => (saved[field] = checked === true),
          })
          const el = content.appendChild(document.createElement("button"))
          content.append(field)
          cleanups.push(bind(toggle.part("root"), el), () => toggle.destroy())
        },
      })
      cleanups.push(
        bind(instance.part("trigger"), trigger),
        bind(instance.part("panel"), panel),
        () => instance.destroy()
      )
      return instance
    })
    const outcome = await agent.act({ steps: [check("Weekly summary")] })
    expect(outcome.error).toBeUndefined()
    expect(saved).toEqual({ "Weekly summary": true })
    expect(sections.map((section) => section.get().open)).toEqual([true, false])
  })

  test("a step finds its component on another page of a pagination and goes there", async () => {
    const agent = createAgent()
    const { pages, saved } = await mountOrders()
    const outcome = await agent.act({ steps: [check("Order 3")] })
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        {
          changes: [
            { component: "pagination", key: "page", value: 3 },
            { label: "Order 3", key: "checked", value: true },
          ],
        },
      ],
    })
    expect(pages.get().page).toBe(3)
    expect(saved["order-3"]).toBe(true)
  })

  test("a step finds its component in a closed collapsible and opens it", async () => {
    const agent = createAgent()
    const { more, saved } = await mountOrders()
    const outcome = await agent.act({ steps: [check("Gift wrap")] })
    expect(outcome.ok).toBe(true)
    expect(more.get().open).toBe(true)
    expect(saved.gift).toBe(true)
  })

  test("a wrong guess says what the other pages and a closed collapsible hold, and the page goes back", async () => {
    const agent = createAgent()
    const { pages, more } = await mountOrders()
    const outcome = await agent.act({ steps: [check("Order 9")] })
    expect(outcome.error?.message).toMatch(
      /^No component "Order 9" on the page\. Its labels: Order 1, Pages, More options\. Behind what is closed: More options: Gift wrap\. page 2: Order 2\. page 3: Order 3\.$/
    )
    expect(pages.get().page).toBe(1)
    expect(more.get().open).toBe(false)
  })

  test("what one step's look found is not said again by a later step that looks nowhere", async () => {
    const agent = createAgent()
    const { pages } = await mountOrders()
    const outcome = await agent.act({
      steps: [check("Order 2"), { ref: "Order 2", action: "press" }],
    })
    expect(pages.get().page).toBe(2)
    expect(outcome.error?.step).toBe(1)
    expect(outcome.error?.message).not.toContain("Behind what is closed")
  })

  test("a press that names a button and no component presses it in the popup that is open", async () => {
    const agent = createAgent()
    const { root } = await mountOrders()
    const { popover } = await import("../src/components/popover/popover")
    const confirm = popover({ id: "confirm", defaultOpen: true })
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    content.setAttribute("aria-label", "Edit order")
    const pressed: string[] = []
    for (const text of ["Cancel", "Apply"]) {
      const button = content.appendChild(document.createElement("button"))
      button.textContent = text
      button.addEventListener("click", () => pressed.push(text))
    }
    document.body.append(content)
    cleanups.push(bind(confirm.part("content"), content), () =>
      confirm.destroy()
    )
    root.setAttribute("inert", "")
    const outcome = await agent.act({
      steps: [{ ref: "Apply", action: "press" }],
    })
    expect(outcome).toMatchObject({
      ok: true,
      steps: [{ result: 'Pressed "Apply".' }],
    })
    expect(pressed).toEqual(["Apply"])
    const missing = await agent.act({
      steps: [{ ref: "Discard", action: "press" }],
    })
    expect(missing.error?.message).toContain('No component "Discard"')
  })

  test("an open popover says its own text beside its buttons, up to a limit", async () => {
    const agent = createAgent()
    const { popover } = await import("../src/components/popover/popover")
    const details = popover({ id: "details", defaultOpen: true })
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    content.setAttribute("aria-label", "Order details")
    content.innerHTML =
      "<p>Ships in two days.</p><ul><li>Gift wrap included</li></ul><button>Close</button>"
    document.body.append(content)
    cleanups.push(bind(details.part("content"), content), () =>
      details.destroy()
    )
    const shown = () =>
      agent.snapshot().find((component) => component.label === "Order details")
    expect(shown()).toMatchObject({
      text: ["Ships in two days. Gift wrap included"],
      buttons: ["Close"],
    })
    content.querySelector("p")!.textContent = "word ".repeat(400)
    expect(shown()?.text?.[0]).toHaveLength(1501)
  })

  test("an open popover's text leaves out what a private field or region inside it says", async () => {
    const agent = createAgent()
    const { popover } = await import("../src/components/popover/popover")
    const reset = popover({ id: "reset", defaultOpen: true })
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    content.setAttribute("aria-label", "Reset password")
    content.innerHTML = `<p>Choose a new password.</p>
      <div data-agent-secret><p>Recovery code 4821</p></div>
      <div><input aria-label="New password" /><p>hunter2 is too short</p></div>`
    document.body.append(content)
    const password = passwordInput({ id: "new-password" })
    const root = content.lastElementChild as HTMLElement
    cleanups.push(
      bind(reset.part("content"), content),
      bind(password.part("root"), root),
      bind(password.part("control"), root.querySelector("input")!),
      () => reset.destroy(),
      () => password.destroy()
    )
    const shown = agent
      .snapshot()
      .find((component) => component.label === "Reset password")
    expect(shown?.text).toEqual(["Choose a new password."])
  })

  test("a name the page lacks under an open modal says what is open over it, with its buttons", async () => {
    const agent = createAgent()
    const { root } = await mountOrders()
    const { popover } = await import("../src/components/popover/popover")
    const confirm = popover({ id: "confirm", defaultOpen: true })
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    content.setAttribute("aria-label", "Edit order")
    const apply = content.appendChild(document.createElement("button"))
    apply.textContent = "Apply"
    document.body.append(content)
    cleanups.push(bind(confirm.part("content"), content), () =>
      confirm.destroy()
    )
    root.setAttribute("inert", "")
    const outcome = await agent.act({ steps: [check("Order 3")] })
    expect(outcome.error?.message).toMatch(
      /Edit order \(c\d+\) is open over the rest of the page, with the buttons Apply: finish it or close it before a step on what it covers\.$/
    )
  })

  test("a name can put a component around it first, by its label or its kind", async () => {
    const agent = createAgent()
    const { saved } = await mountOrders()
    const { popover } = await import("../src/components/popover/popover")
    const edit = popover({ id: "edit", defaultOpen: true })
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    content.setAttribute("aria-label", "Edit order")
    document.body.append(content)
    const label = content.appendChild(document.createElement("label"))
    const el = label.appendChild(document.createElement("button"))
    label.append("Priority")
    const priority = checkbox({
      id: "priority",
      onCheckedChange: (checked) => (saved.priority = checked === true),
    })
    cleanups.push(
      bind(edit.part("content"), content),
      bind(priority.part("root"), el),
      () => edit.destroy(),
      () => priority.destroy()
    )
    const byKind = await agent.act({ steps: [check("popover > Priority")] })
    expect(byKind.ok).toBe(true)
    expect(saved.priority).toBe(true)
    const byLabel = await agent.act({
      steps: [check("Edit order > Priority", false)],
    })
    expect(byLabel.ok).toBe(true)
    expect(saved.priority).toBe(false)
    const elsewhere = await agent.act({ steps: [check("popover > Order 1")] })
    expect(elsewhere.error?.message).toMatch(
      /^No "Order 1" in a section or tab named like "popover"\./
    )
  })

  test("a cancelled call stops looking behind what is closed", async () => {
    const agent = createAgent()
    const { settings, moves } = mountSettings()
    const stop = new AbortController()
    cleanups.push(
      settings.subscribe(() => {
        if (settings.get().value !== "general") {
          stop.abort()
        }
      })
    )
    const outcome = await agent.act(
      { steps: [check("Nothing by this name")] },
      { signal: stop.signal }
    )
    expect(outcome.ok).toBe(false)
    expect(moves).toEqual(["settings members", "settings general"])
  })

  test("what a closing panel still holds counts as gone", async () => {
    const agent = createAgent()
    const instance = checkbox({ id: "leaving" })
    const panel = document.body.appendChild(document.createElement("div"))
    panel.setAttribute("data-ending-style", "")
    const el = panel.appendChild(document.createElement("button"))
    el.setAttribute("aria-label", "Leaving")
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const outcome = await agent.act({ steps: [check("Leaving")] })
    expect(outcome.error?.message).toMatch(/^No component "Leaving"/)
  })

  test("a listing of the whole page shows three rows of each closed place and counts the rest, and text finds them all", async () => {
    const agent = createAgent()
    mountSettings({ members: 5 })
    const rows = (components: unknown) =>
      (components as AgentComponent[]).flatMap(({ row, section }) =>
        section === "Members" && row ? row : []
      )
    const listed = (await agent.query({ closed: true })) as AgentComponent[]
    expect(rows(listed)).toEqual([
      "Member 1 Admin",
      "Member 2 Admin",
      "Member 3 Admin",
    ])
    expect(listed.at(-1)).toMatchObject({ ref: "more", more: 2 })
    expect(rows(await agent.query({ text: "Member", closed: true }))).toEqual([
      "Member 1 Admin",
      "Member 2 Admin",
      "Member 3 Admin",
      "Member 4 Admin",
      "Member 5 Admin",
    ])
  })

  test("a listing of one kind shows every row of a closed place", async () => {
    const agent = createAgent()
    mountSettings({ members: 5 })
    const listed = (await agent.query({
      kind: "checkbox",
      closed: true,
    })) as AgentComponent[]
    const rows = listed.flatMap(({ section, row }) =>
      section === "Members" && row ? row : []
    )
    expect(new Set(rows).size).toBe(5)
    expect(listed.at(-1)).not.toMatchObject({ ref: "more" })
  })

  test("two controls on one row count as one of a closed place's three rows", async () => {
    const agent = createAgent()
    mountSettings({ members: 5, removable: true })
    const listed = (await agent.query({ closed: true })) as AgentComponent[]
    const rows = (label: string) =>
      listed.flatMap((component) =>
        component.label === label && component.row?.includes("Member")
          ? component.row
          : []
      )
    expect(rows("Remove")).toEqual([
      "Member 1 Admin",
      "Member 2 Admin",
      "Member 3 Admin",
    ])
    expect(rows("Select").filter((row) => row.endsWith("Remove"))).toEqual([
      "Member 1 Admin Remove",
      "Member 2 Admin Remove",
      "Member 3 Admin Remove",
    ])
    expect(listed.at(-1)).toMatchObject({ ref: "more", more: 2 })
  })

  test("a long list of what left the page stops at ten and counts the rest", async () => {
    const agent = createAgent()
    mountSettings({ members: 12 })
    await agent.act({ steps: [{ ref: "Members", action: "press" }] })
    const outcome = await agent.act({
      steps: [{ ref: "General", action: "press" }],
    })
    expect(outcome.steps[0].gone).toHaveLength(11)
    expect(outcome.steps[0].gone?.at(-1)).toBe("and 3 more")
  })
})
