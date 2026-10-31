// @vitest-environment jsdom
// The agent bridge: what an agent sees of the page's components, and what its
// calls change, through the public entry. `bind` from the kernel stands in
// for an adapter.
import { afterEach, describe, expect, test, vi } from "vitest"
import { accordion } from "../src/components/accordion/accordion"
import { createAgent, registerTools, type AgentComponent } from "../src/page/agent/agent"
import { button } from "../src/components/button/button"
import { checkbox } from "../src/components/checkbox/checkbox"
import { datePicker } from "../src/components/date-picker/date-picker"
import { input } from "../src/components/input/input"
import { pagination } from "../src/components/pagination/pagination"
import { passwordInput } from "../src/components/password-input/password-input"
import { progress } from "../src/components/progress/progress"
import { bind } from "../src/foundation/kernel/part"
import { definePrimitive } from "../src/foundation/kernel/primitive"
import { select } from "../src/components/select/select"
import { separator } from "../src/components/separator/separator"
import { slider } from "../src/components/slider/slider"
import { tabs } from "../src/components/tabs/tabs"
import { tree } from "../src/components/tree/tree"

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

// A checkbox in a label, bound the way an adapter binds it.
function mountCheckbox(options: Parameters<typeof checkbox>[0], text = "Accept the terms") {
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
    expect(screen[0]).toMatchObject({ component: "checkbox", label: "Accept the terms", checked: false })
    expect(screen[0].actions).toContain("setChecked")
    expect(screen[0].actions).not.toContain("focus")
  })

  test("a step changes the component, reports the source agent and returns what changed", async () => {
    const agent = createAgent()
    const onCheckedChange = vi.fn()
    mountCheckbox({ id: "terms", onCheckedChange })
    const [{ ref }] = agent.snapshot()
    const outcome = await agent.act({ steps: [{ ref, action: "setChecked", args: [true] }] })
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.objectContaining({ source: "agent" }))
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        { ref, changes: [{ component: "checkbox", label: "Accept the terms", key: "checked", value: true }] },
      ],
      values: { [`${ref} Accept the terms`]: true },
    })
  })

  test("a step whose value the option's kind doesn't take fails and changes nothing", async () => {
    const agent = createAgent()
    const instance = mountCheckbox({ id: "terms" })
    const outcome = await agent.act({
      steps: [{ ref: "Accept the terms", action: "setChecked", args: ["not-a-boolean"] }],
    })
    expect(outcome).toMatchObject({
      ok: false,
      error: { message: expect.stringContaining('takes true or false, not "not-a-boolean"') },
    })
    expect(instance.get().checked).toBe(false)
  })

  test("a number option given text takes the number", async () => {
    const agent = createAgent()
    const instance = pagination({ id: "pages", pageCount: 10 })
    const root = document.createElement("nav")
    root.setAttribute("aria-label", "Results")
    document.body.append(root)
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    await agent.act({ steps: [{ ref: "Results", action: "setPage", args: ["3"] }] })
    expect(instance.get().page).toBe(3)
  })

  test("the app can refuse a step in its change callback, since it knows the agent asked", async () => {
    const agent = createAgent()
    mountCheckbox({
      id: "terms",
      onCheckedChange: (_checked, details) => {
        if (details.source === "agent") details.cancel()
      },
    })
    const [{ ref }] = agent.snapshot()
    const outcome = await agent.act({ steps: [{ ref, action: "setChecked", args: [true] }] })
    expect(outcome.steps[0].changes).toBeUndefined()
  })

  test("allow refuses an action before it runs", async () => {
    const allow = vi.fn(() => false)
    const agent = createAgent({ allow })
    const onCheckedChange = vi.fn()
    mountCheckbox({ id: "terms", onCheckedChange })
    const [{ ref }] = agent.snapshot()
    const outcome = await agent.act({ steps: [{ ref, action: "setChecked", args: [true] }] })
    expect(outcome).toMatchObject({
      ok: false,
      error: { step: 0, message: `The app refused setChecked on ${ref}.` },
    })
    expect(allow).toHaveBeenCalledWith(
      { ref, component: "checkbox", label: "Accept the terms", action: "setChecked", args: [true] },
      { signal: expect.any(AbortSignal) },
    )
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  test("a disabled component takes no actions, and a call says what it takes", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms", disabled: true })
    const [component] = agent.snapshot()
    expect(component).toMatchObject({ disabled: true, actions: [] })
    const outcome = await agent.act({ steps: [{ ref: component.ref, action: "setChecked", args: [true] }] })
    expect(outcome.error?.message).toContain("takes no setChecked now")
  })

  test("a component that leaves the page stays in the snapshot as off the page, with the state it had", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "terms", defaultChecked: true }, "Send a weekly digest")
    const [{ ref }] = agent.snapshot()
    cleanups.forEach((cleanup) => cleanup())
    cleanups = []
    expect(agent.snapshot().find((component) => component.ref === ref)).toEqual({
      ref,
      component: "checkbox",
      offPage: true,
      label: "Send a weekly digest",
      checked: true,
      actions: [],
    })
    const outcome = await agent.act({ steps: [{ ref, action: "setChecked", args: [true] }] })
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
    const password = () => agent.snapshot().filter((component) => component.label === "Password")
    expect(password()).toHaveLength(1)
    unbind()
    instance.destroy()
    expect(password()).toEqual([])
  })

  test("a password's value never reaches the agent, even while it's shown", async () => {
    const agent = createAgent()
    const instance = passwordInput({ id: "secret", defaultVisible: true })
    const root = document.createElement("div")
    const el = document.createElement("input")
    el.setAttribute("aria-label", "Password")
    root.append(el)
    document.body.append(root)
    cleanups.push(bind(instance.part("root"), root), bind(instance.part("control"), el), () =>
      instance.destroy(),
    )
    expect(el.type).toBe("text")
    const [component] = agent.snapshot()
    const outcome = await agent.act({
      steps: [{ ref: component.ref, action: "setValue", args: ["swordfish"] }],
    })
    expect(instance.get().value).toBe("swordfish")
    expect(JSON.stringify(outcome)).not.toContain("swordfish")
    expect(agent.snapshot()[0]).toMatchObject({ component: "password-input", value: "[redacted]" })
  })

  test("registerTools registers the three methods as WebMCP tools, and unregisters them", async () => {
    const tools = new Map<string, { annotations: object; execute: (input: object) => unknown }>()
    const registerTool = vi.fn(
      async (
        tool: { name: string; annotations: object; execute: (input: object) => unknown },
        { signal }: { signal: AbortSignal },
      ) => {
        tools.set(tool.name, tool)
        signal.addEventListener("abort", () => tools.delete(tool.name))
      },
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
    expect([...tools.keys()]).toEqual(["snapshot", "act", "query"])
    expect(tools.get("snapshot")?.annotations).toEqual({ readOnlyHint: true, untrustedContentHint: true })
    expect(tools.get("act")?.annotations).toEqual({ readOnlyHint: false, untrustedContentHint: true })
    await tools.get("act")?.execute({ steps: [{ ref: "Weekly digest", action: "setChecked", args: [true] }] })
    expect(instance.get().checked).toBe(true)
    // Its `allow` decides every step the browser's agent asks for.
    expect(
      await tools
        .get("act")
        ?.execute({ steps: [{ ref: "Weekly digest", action: "setChecked", args: [false] }] }),
    ).toMatchObject({ ok: false, error: { message: expect.stringContaining("The app refused setChecked") } })
    expect(instance.get().checked).toBe(true)
    expect(asked).toEqual(["setChecked true", "setChecked false"])
    // The agent's own calls don't ask it.
    await agent.act({ steps: [{ ref: "Weekly digest", action: "setChecked", args: [false] }] })
    expect(instance.get().checked).toBe(false)
    expect(asked).toHaveLength(2)
    // Without one, it refuses to register.
    expect(() => registerTools(agent, {} as never)).toThrow("registerTools needs an `allow`")
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

  function mountRegion(items: { value: string; label: string }[], onValueChange = vi.fn()) {
    const instance = select({ id: "region", items, onValueChange })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Region")
    document.body.append(el)
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    return instance
  }

  test("setValue refuses an item a select doesn't have, and lists its items", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    mountRegion(
      [
        { value: "fra", label: "Frankfurt" },
        { value: "sin", label: "Singapore" },
      ],
      onValueChange,
    )
    const outcome = await agent.act({ steps: [{ ref: "Region", action: "setValue", args: ["Tokyo"] }] })
    expect(outcome.error?.message).toMatch(
      /^No item "Tokyo" in Region \(c\d+\)\. Its items: Frankfurt, Singapore\.$/,
    )
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test("setValue takes an item's label ignoring accents and case", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    const instance = mountRegion([{ value: "de", label: "Allemagne" }], onValueChange)
    const outcome = await agent.act({ steps: [{ ref: "Region", action: "setValue", args: ["allemagne"] }] })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toBe("de")
  })

  test("a label two items share is refused, with their values", async () => {
    const agent = createAgent()
    mountRegion([
      { value: "fra-1", label: "Frankfurt" },
      { value: "fra-2", label: "Frankfurt" },
    ])
    const outcome = await agent.act({ steps: [{ ref: "Region", action: "setValue", args: ["Frankfurt"] }] })
    expect(outcome.error?.message).toMatch(/"Frankfurt" names 2 items in Region \(c\d+\): fra-1, fra-2\./)
  })

  test("a name two closed sections share is refused, with the sections, and opening one first finds it", async () => {
    const agent = createAgent()
    // Each open section mounts its own Deploy failures switch, as adapters render an open panel.
    const mounted = new Map<string, ReturnType<typeof mountCheckbox>>()
    const instance = accordion({
      id: "channels",
      onValueChange: (value) => {
        for (const [section, checkbox] of mounted)
          if (!value.includes(section)) {
            checkbox.destroy()
            mounted.delete(section)
          }
        for (const section of value)
          if (!mounted.has(section)) mounted.set(section, mountCheckbox({ id: section }, "Deploy failures"))
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
        bind(instance.part("trigger", { value }), trigger),
      )
    }
    cleanups.push(() => instance.destroy())
    const step = { ref: "Deploy failures", action: "setChecked", args: [true] }
    const refused = await agent.act({ steps: [step] })
    expect(refused.error?.message).toMatch(
      /"Deploy failures" is in 2 closed sections: Email, Slack\. Open one first, like \{ "ref": "c\d+", "action": "open", "args": \["Email"\] \}\./,
    )
    expect(instance.get().value).toEqual([])
    const outcome = await agent.act({ steps: [{ ref: "accordion", action: "open", args: ["Slack"] }, step] })
    expect(outcome.ok).toBe(true)
    expect(mounted.get("slack")?.get().checked).toBe(true)
  })

  test("act finishes in a hidden tab, where the browser runs no frames", async () => {
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true)
    const frame = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0)
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
    Object.assign(document, { modelContext: { registerTool: refuse("InvalidStateError") } })
    registerTools(createAgent(), { allow: () => true })
    await vi.waitFor(() => expect(warn).toHaveBeenCalledTimes(3))
    expect(warn.mock.calls[0][0]).toContain("registerTools couldn't register snapshot.")
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
      allow: (step) => step.ref !== "c1" || new Promise<boolean>((resolve) => (answer = resolve)),
    })
    const first = mountCheckbox({ id: "terms" })
    const second = mountCheckbox({ id: "digest" }, "Send a weekly digest")
    const waiting = agent.act({ steps: [{ ref: "Accept the terms", action: "setChecked", args: [true] }] })
    const next = agent.act({ steps: [{ ref: "Send a weekly digest", action: "setChecked", args: [true] }] })
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
        { value: "src", label: "src", children: [{ value: "src/index.ts", label: "index.ts" }] },
        { value: "README.md", label: "README.md" },
      ],
    })
    mount({ id: "Paths", paths: ["src/agent.ts", "README.md"] })
    expect(await agent.query({ within: "Files", text: "index" })).toEqual([
      expect.objectContaining({ label: "Files", items: [{ value: "src/index.ts", label: "index.ts" }] }),
    ])
    expect(await agent.query({ within: "Paths", text: "agent" })).toEqual([
      expect.objectContaining({ items: [expect.objectContaining({ label: "agent.ts" })] }),
    ])
    // A label inside a collapsed branch names its node.
    await agent.act({ steps: [{ ref: "Files", action: "setValue", args: ["index.ts"] }] })
    expect(nested.get().value).toBe("src/index.ts")
  })

  test("a component whose elements are all hidden, like one in a closed dialog, isn't on the page", async () => {
    const agent = createAgent()
    const shown = mountCheckbox({ id: "status-shown" }, "Status")
    mountCheckbox({ id: "status-closed" }, "Status")
    const closed = document.body.appendChild(document.createElement("div"))
    closed.hidden = true
    closed.append(document.body.querySelectorAll("label")[1])
    expect(agent.snapshot().filter((component) => component.label === "Status")).toHaveLength(1)
    await agent.act({ steps: [{ ref: "Status", action: "setChecked", args: [true] }] })
    expect(shown.get().checked).toBe(true)
  })

  test("a reading, like a progress bar's value, is in the snapshot", () => {
    const agent = createAgent()
    const instance = progress({ id: "upload", value: 2, max: 4 })
    const el = document.body.appendChild(document.createElement("div"))
    el.setAttribute("aria-label", "Upload")
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    expect(agent.snapshot().find((component) => component.label === "Upload")).toMatchObject({
      value: 2,
      max: 4,
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
      () => region.remove(),
    )
    expect(agent.snapshot().find((component) => component.label === "Credit score")).toMatchObject({
      value: "[redacted]",
    })
  })

  test("a date picker is named by its input's label, not by the month its calendar shows", () => {
    const agent = createAgent()
    const instance = datePicker({ id: "due", defaultMonth: "2026-11" })
    const label = document.body.appendChild(document.createElement("label"))
    label.textContent = "Due date"
    const input = label.appendChild(document.createElement("input"))
    const heading = document.body.appendChild(document.createElement("h2"))
    heading.textContent = "November 2026"
    cleanups.push(bind(instance.part("input"), input), bind(instance.part("heading"), heading), () =>
      instance.destroy(),
    )
    expect(agent.snapshot().find((component) => component.component === "date-picker")?.label).toBe(
      "Due date",
    )
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
      () => instance.destroy(),
    )
    expect(agent.snapshot().find((component) => component.component === "select")?.label).toBe("Fruit")
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
      bind(files.part("item", { value: "src/index.ts" }), leaf),
    )
    const screen = agent.snapshot()
    expect(screen.find((component) => component.label === "Views")?.items).toEqual([
      { value: "active", label: "active 12" },
      { value: "activity", label: "activity 2" },
    ])
    expect(screen.find((component) => component.label === "Files")?.items).toEqual([
      { value: "src", label: "src" },
      { value: "src/index.ts", label: "index.ts" },
    ])
  })

  test("a press waits for the button's action, and a failed action fails the step", async () => {
    const agent = createAgent()
    let fail = false
    const instance = button({
      id: "save",
      action: () =>
        new Promise((resolve, reject) =>
          setTimeout(() => (fail ? reject(new Error("Network down")) : resolve(null)), 120),
        ),
    } as Parameters<typeof button>[0])
    const el = document.createElement("button")
    el.textContent = "Save"
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    const saved = await agent.act({ steps: [{ ref: "Save", action: "press" }] })
    expect(saved).toMatchObject({ ok: true, steps: [{ result: 'Pressed "Save".' }] })
    expect(instance.get().pending).toBe(false)
    fail = true
    const failed = await agent.act({ steps: [{ ref: "Save", action: "press" }] })
    expect(failed).toMatchObject({
      ok: false,
      error: { step: 0, message: 'Pressed "Save", and its action failed: Network down' },
    })
    expect(agent.snapshot()[0]).toMatchObject({ component: "button", error: "Network down" })
  })

  test("a closed select's items come from its data, without opening it", async () => {
    const agent = createAgent()
    const onOpenChange = vi.fn()
    const instance = select({
      id: "region",
      items: [{ type: "group", label: "Europe", items: [{ value: "fra", label: "Frankfurt" }] }, "Tokyo"],
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
      expect.objectContaining({ items: [{ value: "fra", label: "Frankfurt" }] }),
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
  const mountSelect = (label: string, items: string[], options: { defaultOpen?: boolean } = {}) => {
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
    expect(await agent.query({ text: "save" })).toEqual([expect.objectContaining({ label: "Save draft" })])
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
    expect(selects.filter((component) => !component.offPage).map((component) => component.label)).toEqual([
      "Region",
    ])
    expect(selects.every((component) => component.component === "select")).toBe(true)
    expect(await agent.query({})).toEqual({
      error: "query takes text, within or kind. snapshot lists everything.",
    })
  })

  test("a long list's items stop at 50 and say how many more there were", async () => {
    const agent = createAgent()
    mountSelect(
      "Country",
      Array.from({ length: 70 }, (_, index) => `Country ${index + 1}`),
    )
    const [country] = (await agent.query({ within: "Country" })) as AgentComponent[]
    expect(country.items).toHaveLength(50)
    expect(country.more).toBe(20)
  })

  test("a long page's snapshot stops at 100, keeps what's open and ends with how many were left out", () => {
    const agent = createAgent()
    for (let index = 1; index <= 120; index++) mountButton(`Row ${index}`)
    mountSelect("Status", ["Open", "Closed"], { defaultOpen: true })
    const screen = agent.snapshot()
    expect(screen).toHaveLength(101)
    expect(screen).toContainEqual(expect.objectContaining({ label: "Status", open: true }))
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
    expect(component).toMatchObject({ component: "button", label: "Save", actions: ["press"] })
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
    expect(shown.map((component) => component.row)).toEqual(["Priya Shah Admin", "Tom Becker Admin"])
  })

  test("a component that leaves and comes back, like a tab's, keeps its ref", () => {
    const agent = createAgent()
    const unmount = mountRow("Priya Shah")
    const [{ ref }] = agent.snapshot()
    unmount()
    expect(agent.snapshot().find((component) => component.ref === ref)?.offPage).toBe(true)
    cleanups.push(mountRow("Priya Shah"))
    const back = agent.snapshot().filter((component) => component.ref === ref)
    expect(back).toHaveLength(1)
    expect(back[0].offPage).toBeUndefined()
  })
})

describe("agent refs", () => {
  // A checkbox in a label, optionally on a row, that can leave the page early.
  function mountLabeled(options: Parameters<typeof checkbox>[0], text: string, row?: string) {
    const instance = checkbox(options)
    const label = document.createElement("label")
    const el = document.createElement("button")
    label.append(el, text)
    const host = row ? document.createElement("li") : label
    if (row) host.append(row, label)
    document.body.append(host)
    const unbind = bind(instance.part("root"), el)
    let mounted = true
    const unmount = () => {
      if (!mounted) return
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
    const a2 = mountLabeled({ id: "twin-a2", defaultChecked: true }, "Notify me")
    const b2 = mountLabeled({ id: "twin-b2" }, "Notify me")
    const twins = agent.snapshot().filter((component) => component.label === "Notify me")
    expect(twins).toEqual([
      expect.objectContaining({ ref: refA, checked: true }),
      expect.objectContaining({ ref: refB, checked: false }),
    ])
    expect(twins.some((component) => component.offPage)).toBe(false)
    await agent.act({ steps: [{ ref: refB, action: "setChecked", args: [true] }] })
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
      const ref = agent.snapshot().find((component) => component.label === label && !component.offPage)?.ref
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
    expect(agent.snapshot().find((component) => component.label === "Make admin")?.row).toBe("Alice")
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
        .map((component) => component.ref),
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
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.objectContaining({ source: "agent" }))
    expect(outcome).toMatchObject({
      ok: true,
      steps: [
        { step: 0, changes: [{ label: "Accept the terms", key: "checked", value: true }] },
        { step: 1, changes: [{ label: "Send a weekly digest", key: "checked", value: true }] },
      ],
    })
    expect(Object.entries(outcome.values)).toEqual(
      expect.arrayContaining([
        [expect.stringContaining("Accept the terms"), true],
        [expect.stringContaining("Send a weekly digest"), true],
      ]),
    )
  })

  test("names a component by whole words of its label, so part of a word matches nothing", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "username" }, "Username")
    const missed = await agent.act({ steps: [{ ref: "Name", action: "setChecked", args: [true] }] })
    expect(missed.ok).toBe(false)
    expect(missed.error?.message).toContain('No component "Name"')
    const display = mountCheckbox({ id: "display-name" }, "Display name")
    const found = await agent.act({ steps: [{ ref: "name", action: "setChecked", args: [true] }] })
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
    expect([region, city, street, town, company].map((instance) => instance.get().checked)).toEqual([
      true,
      true,
      true,
      true,
      true,
    ])
  })

  test("labels that differ only by an accent name both components, with their refs", async () => {
    const agent = createAgent()
    mountCheckbox({ id: "fold-resume" }, "Résumé")
    mountCheckbox({ id: "fold-resume-plain" }, "Resume")
    const refs = agent
      .snapshot()
      .filter((component) => !component.offPage && /^r[eé]sum[eé]$/i.test(component.label ?? ""))
      .map((component) => `${component.ref} ${component.label}`)
    const outcome = await agent.act({ steps: [{ ref: "resume", action: "setChecked", args: [true] }] })
    expect(outcome.error?.message).toBe(`"resume" names 2 components: ${refs.join(", ")}. Use a ref.`)
  })

  test("an exact label doesn't beat a row that holds the same words, since page text can be anyone's", async () => {
    const agent = createAgent()
    const row = (html: string, id: string) => {
      const instance = checkbox({ id })
      const el = document.createElement("div")
      el.setAttribute("role", "row")
      el.innerHTML = html
      document.body.append(el)
      cleanups.push(bind(instance.part("root"), el.querySelector("button")!), () => instance.destroy())
      return instance
    }
    const jane = row(
      `<span>Jane Doe</span> <span>jane@acme.com</span><button aria-label="Admin"></button>`,
      "jane",
    )
    const other = row(`<button aria-label="Jane Doe"></button>`, "other")
    const outcome = await agent.act({ steps: [{ ref: "Jane Doe", action: "setChecked", args: [true] }] })
    expect(outcome.error?.message).toMatch(
      /"Jane Doe" names 2 components: c\d+ Admin \(Jane Doe jane@acme\.com\), c\d+ Jane Doe\. Use a ref\./,
    )
    expect([jane.get().checked, other.get().checked]).toEqual([false, false])
  })

  test("a label that matches exactly still wins when nothing else holds its words", async () => {
    const agent = createAgent()
    const name = mountCheckbox({ id: "name" }, "Name")
    mountCheckbox({ id: "email" }, "Email")
    const outcome = await agent.act({ steps: [{ ref: "name", action: "setChecked", args: [true] }] })
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
    await agent.act({ steps: [{ ref: "Region", action: "setValue", args: ["germany (frankfurt)"] }] })
    expect(onValueChange).toHaveBeenCalledWith("fra", expect.objectContaining({ source: "agent" }))
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
        bind(instance.part("trigger", { value }), trigger),
      )
    }
    cleanups.push(() => instance.destroy())
    const behind = await agent.act({
      steps: [{ ref: "Deploy failures", action: "setChecked", args: [true] }],
    })
    expect(behind.error?.message).toMatch(/behind one of these.*accordion \(c\d+\): Email, Slack/)
    const outcome = await agent.act({ steps: [{ ref: "Email", action: "open", args: ["Email"] }] })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toEqual(["email"])
    const missing = await agent.act({ steps: [{ ref: "dialog", action: "press", args: ["Remove"] }] })
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
        bind(instance.part("trigger", { value }), trigger),
      )
    }
    cleanups.push(() => instance.destroy())
    const outcome = await agent.act({
      steps: [{ ref: "Deploy failures", action: "setChecked", args: [true] }],
    })
    expect(outcome.ok).toBe(true)
    expect(instance.get().value).toEqual(["email"])
    expect(Object.entries(outcome.values)).toContainEqual([expect.stringContaining("Deploy failures"), true])
  })

  test("a slider given text takes the number in it", async () => {
    const agent = createAgent()
    const instance = slider({ id: "retention", min: 30, max: 365, defaultValue: 30 })
    const root = document.createElement("div")
    root.setAttribute("aria-label", "Data retention")
    document.body.append(root)
    cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
    await agent.act({ steps: [{ ref: "Data retention", action: "setValue", args: ["90 days"] }] })
    expect(instance.get().value).toBe(90)
    const outcome = await agent.act({
      steps: [{ ref: "Data retention", action: "setValue", args: ["a lot"] }],
    })
    expect(outcome.error?.message).toMatch(/takes a number/)
  })

  test("a select with a few items shows them", () => {
    const agent = createAgent()
    const instance = select({ id: "visibility", items: ["Private", "Internal", "Public"] })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Visibility")
    document.body.append(el)
    cleanups.push(bind(instance.part("trigger"), el), () => instance.destroy())
    const visibility = agent.snapshot().find((component) => component.label === "Visibility")
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
  }: { confirm?: string; disabled?: boolean; ariaDisabled?: boolean; inDisabledFieldset?: boolean } = {}) {
    const { popover } = await import("../src/components/popover/popover")
    const onClick = vi.fn()
    const changes: [boolean, string][] = []
    const content = Object.assign(document.createElement("div"), { getAnimations: () => [] })
    const instance = popover({
      id: "actions",
      onOpenChange: (open, details) => {
        changes.push([open, details.source])
        if (!open) return content.replaceChildren()
        const remove = document.createElement("button")
        remove.textContent = "Remove"
        if (confirm) remove.setAttribute("data-agent-confirm", confirm)
        remove.disabled = !!disabled
        if (ariaDisabled) remove.setAttribute("aria-disabled", "true")
        remove.addEventListener("click", onClick)
        if (inDisabledFieldset) {
          const fieldset = content.appendChild(document.createElement("fieldset"))
          fieldset.disabled = true
          fieldset.append(remove)
        } else content.append(remove)
      },
    })
    const trigger = document.createElement("button")
    trigger.setAttribute("aria-label", "Actions for Tom Becker")
    document.body.append(trigger, content)
    cleanups.push(bind(instance.part("trigger"), trigger), bind(instance.part("content"), content), () =>
      instance.destroy(),
    )
    return { instance, onClick, changes }
  }

  test("press opens a closed popup to press a button inside it", async () => {
    const agent = createAgent()
    const { onClick } = await mountActions()
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["remove"] }] })
    // The popover stays open here, since its button doesn't close it, and the step says what it pressed.
    expect(outcome).toMatchObject({
      ok: true,
      steps: [{ result: expect.stringMatching(/^Pressed "Remove", after opening c\d+\.$/) }],
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("a press on a disabled button fails, and closes the popup it opened", async () => {
    const agent = createAgent()
    const { instance, onClick } = await mountActions({ disabled: true })
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }] })
    expect(outcome).toMatchObject({ ok: false, error: { message: expect.stringContaining('"Remove"') } })
    expect(outcome.error?.message).toContain("disabled")
    expect(instance.get().open).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on an aria-disabled button fails, and closes the popup it opened", async () => {
    const agent = createAgent()
    const { instance, onClick } = await mountActions({ ariaDisabled: true })
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }] })
    expect(outcome).toMatchObject({ ok: false, error: { message: expect.stringContaining('"Remove"') } })
    expect(outcome.error?.message).toContain("disabled")
    expect(instance.get().open).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on a disabled button in a popup the person opened fails, and leaves it open", async () => {
    const agent = createAgent()
    const { instance, onClick } = await mountActions({ disabled: true })
    ;(instance.api as unknown as { setOpen: (open: boolean) => void }).setOpen(true)
    await vi.waitFor(() => expect(instance.get().open).toBe(true))
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }] })
    expect(outcome.ok).toBe(false)
    expect(instance.get().open).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on a button a disabled fieldset disables fails", async () => {
    const agent = createAgent()
    const { onClick } = await mountActions({ inDisabledFieldset: true })
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }] })
    expect(outcome).toMatchObject({ ok: false, error: { message: expect.stringContaining("disabled") } })
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press on a button disabled while its confirmation is pending fails, and closes the popup", async () => {
    let answer: ((allowed: boolean) => void) | undefined
    const agent = createAgent({
      allow: (step) => !step.confirm || new Promise<boolean>((resolve) => (answer = resolve)),
    })
    const { instance, onClick } = await mountActions({ confirm: "Removes Tom from the team" })
    const outcome = agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }] })
    await vi.waitFor(() => expect(answer).toBeDefined())
    const remove = [...document.querySelectorAll("button")].find((el) => el.textContent === "Remove")!
    remove.disabled = true
    answer!(true)
    const result = await outcome
    expect(result).toMatchObject({ ok: false, error: { message: expect.stringContaining('"Remove"') } })
    expect(result.error?.message).toContain("disabled")
    expect(instance.get().open).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("a press allow refuses doesn't open the popup", async () => {
    const allow = vi.fn(() => false)
    const agent = createAgent({ allow })
    const { instance, changes } = await mountActions()
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }] })
    expect(outcome.error?.message).toMatch(/^The app refused press on c\d+\.$/)
    expect(allow).toHaveBeenCalledWith(
      expect.objectContaining({ action: "press", args: ["Remove"] }),
      expect.anything(),
    )
    expect(changes).toEqual([])
    expect(instance.get().open).toBe(false)
  })

  test("a press refused once its button shows closes the popup it opened", async () => {
    const agent = createAgent({ allow: (step) => !step.confirm })
    const { instance, onClick, changes } = await mountActions({ confirm: "Removes Tom from the team" })
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "press", args: ["Remove"] }] })
    expect(outcome.error?.message).toBe('The person said no to "Removes Tom from the team".')
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

  test("query and a refused step's message read a closed popup without opening it", async () => {
    const agent = createAgent()
    const { changes } = await mountActions()
    expect(await agent.query({ within: "Tom Becker" })).toEqual([expect.objectContaining({ items: [] })])
    const outcome = await agent.act({ steps: [{ ref: "Tom Becker", action: "setValue", args: ["x"] }] })
    expect(outcome.error?.message).toMatch(/press takes the text of a button inside it, and opens it first/)
    expect(changes).toEqual([])
  })

  // A select without item data, whose items render only while it's open.
  function mountRenderedRegion(onOpenChange: (open: boolean) => void = () => {}) {
    const content = document.createElement("div")
    const unbindItems: (() => void)[] = []
    const instance: ReturnType<typeof select> = select({
      id: "rendered-region",
      onOpenChange: (open) => {
        onOpenChange(open)
        unbindItems.splice(0).forEach((unbind) => unbind())
        content.replaceChildren()
        if (!open) return
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
    const refusal = await refused.act({ steps: [{ ref: "Region", action: "setValue", args: ["Germany"] }] })
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
    const [region] = (await createAgent().query({ within: "Region" })) as AgentComponent[]
    expect(region).toMatchObject({
      items: [],
      note: expect.stringMatching(/act's setValue takes an item's label/),
    })
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  test("on a long page, act's values keep the fields it touched or changed, then others up to 100, and how many more", async () => {
    const agent = createAgent()
    for (let index = 0; index < 150; index++) mountCheckbox({ id: `admin-${index}` }, `Admin ${index}`)
    const outcome = await agent.act({ steps: [{ ref: "Admin 149", action: "setChecked", args: [true] }] })
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
        if (fails) throw new Error("The server is down.")
      },
    }),
    slots: (slot) => ({ root: slot({ attrs: () => ({ "aria-label": "Drafts" }) }) }),
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
    const outcome = await agent.act({ steps: [{ ref: "Drafts", action: "save", args: [false] }] })
    expect(outcome).toMatchObject({ ok: true, steps: [{ result: "pending" }] })
  })

  test("fails the step when it rejects before the step ends", async () => {
    const agent = createAgent()
    mount()
    const outcome = await agent.act({ steps: [{ ref: "Drafts", action: "save", args: [true] }] })
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
      slots: (slot) => ({ root: slot({ attrs: () => ({ "aria-label": "Size" }) }) }),
      agent,
    })

  function mount(primitive: ReturnType<typeof sizes>, options: { visible?: boolean } = {}) {
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

  test("its actions are the only ones an agent sees and takes", async () => {
    const agent = createAgent()
    mount(sizes({ actions: ["setValue"] }))
    const [{ ref, actions }] = agent.snapshot()
    expect(actions).toEqual(["setValue"])
    const outcome = await agent.act({ steps: [{ ref, action: "resetSizes", args: [] }] })
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
    const outcome = await agent.act({ steps: [{ ref: closedRef, action: "setValue", args: ["xl"] }] })
    expect(outcome.ok).toBe(false)
    expect(closed.get()).toMatchObject({ value: "m" })
  })

  test("an action with no option in the schema takes its arguments unchecked", async () => {
    const agent = createAgent()
    const instance = mount(sizes({ actions: ["setValue"] }))
    const outcome = await agent.act({ steps: [{ ref: "Size", action: "setValue", args: [42] }] })
    expect(outcome.ok).toBe(true)
    expect(instance.get()).toMatchObject({ value: 42 })
  })

  test("shown hides it from the agent while it returns false", () => {
    const agent = createAgent()
    mount(sizes({ shown: (state) => (state as { visible: boolean }).visible }), { visible: false })
    expect(agent.snapshot().filter((component) => !component.offPage)).toHaveLength(0)
  })

  test("a separator on the page is never listed, since it has nothing to read or change", () => {
    const agent = createAgent()
    const instance = separator({ id: "rule" })
    const el = document.createElement("hr")
    document.body.append(el)
    cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
    expect(agent.snapshot().map((component) => component.component)).not.toContain("separator")
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
    expect(agent.snapshot()[0]).toMatchObject({ label: "Notify me", source: "components/settings.tsx:12" })
  })

  test("reads Svelte's element locations", () => {
    const agent = createAgent()
    const instance = checkbox({ id: "notify" })
    const el = document.createElement("button")
    el.setAttribute("aria-label", "Notify me")
    Object.assign(el, { __svelte_meta: { loc: { file: "src/lib/settings.svelte", line: 7 } } })
    document.body.append(el)
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
