// @vitest-environment jsdom
// One page with everything an agent must not read or change, and every tool
// run on it: nothing private comes back, and nothing marked changes.
import { afterEach, expect, test } from "vitest"
import { checkbox } from "../src/components/checkbox/checkbox"
import { collapsible } from "../src/components/collapsible/collapsible"
import { input } from "../src/components/input/input"
import { bind } from "../src/foundation/kernel/part"
import { createAgent } from "../src/page/agent/agent"

const cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup())
  document.body.innerHTML = ""
})

function addField(parent: Element, id: string, text: string, value: string) {
  const label = parent.appendChild(document.createElement("label"))
  label.append(text)
  const el = label.appendChild(document.createElement("input"))
  const instance = input({ id, defaultValue: value })
  const unbind = bind(instance.part("root"), el)
  return () => {
    unbind()
    instance.destroy()
    label.remove()
  }
}

function addSwitch(parent: Element, id: string, text: string) {
  const label = parent.appendChild(document.createElement("label"))
  const el = label.appendChild(document.createElement("button"))
  label.append(text)
  const instance = checkbox({ id })
  const unbind = bind(instance.part("root"), el)
  return () => {
    unbind()
    instance.destroy()
    label.remove()
  }
}

function inside(attribute: string, value = "") {
  const region = document.body.appendChild(document.createElement("div"))
  region.setAttribute(attribute, value)
  return region
}

// A section that mounts what it holds while it's open, as an adapter renders it.
function addSection(
  id: string,
  text: string,
  fill: (panel: HTMLElement) => (() => void)[]
) {
  const trigger = document.body.appendChild(document.createElement("button"))
  trigger.textContent = text
  const panel = document.body.appendChild(
    Object.assign(document.createElement("div"), { getAnimations: () => [] })
  )
  let offs: (() => void)[] = []
  let opened = 0
  const instance = collapsible({
    id,
    onOpenChange: (open) => {
      offs.forEach((off) => off())
      offs = open ? fill(panel) : []
      opened += open ? 1 : 0
    },
  })
  cleanups.push(
    bind(instance.part("trigger"), trigger),
    bind(instance.part("panel"), panel),
    () => offs.forEach((off) => off()),
    () => instance.destroy()
  )
  return { instance, trigger, opened: () => opened }
}

const check = (ref: string) => ({ ref, action: "setChecked", args: [true] })

test("no tool reads what is private, and no step or look changes what needs a person", async () => {
  // Hidden since they mounted, and gone before the test ends.
  const unshown = [
    addField(inside("hidden"), "draft", "Kanary draft", "canary-unshown"),
    addField(
      inside("aria-hidden", "true"),
      "ghost",
      "Kanary ghost",
      "canary-aria"
    ),
  ]
  cleanups.push(
    addSwitch(document.body, "terms", "Accept the terms"),
    addField(
      inside("data-agent-hidden"),
      "plan",
      "Kanary plan",
      "canary-hidden"
    ),
    addField(inside("data-agent-secret"), "pin", "PIN", "canary-secret")
  )
  const headed = document.body.appendChild(document.createElement("div"))
  headed.innerHTML = `
    <h3 id="private-heading" data-agent-hidden>Kanary heading</h3>
    <div role="group" aria-labelledby="private-heading"></div>
    <h3 id="part-private">Alerts <span data-agent-hidden>kanary part</span></h3>
    <div role="group" aria-labelledby="part-private"></div>
    <ul><li>Jane Doe <span data-agent-hidden>kanary row</span></li></ul>`
  const [first, second] = headed.querySelectorAll("[role=group]")
  cleanups.push(
    addSwitch(first, "alerts-1", "Deploy failures"),
    addSwitch(second, "alerts-2", "Deploy failures"),
    addSwitch(headed.querySelector("li")!, "admin", "Admin")
  )
  const advanced = addSection("advanced", "Advanced", (panel) => {
    const secret = panel.appendChild(document.createElement("div"))
    secret.setAttribute("data-agent-secret", "")
    const hidden = panel.appendChild(document.createElement("div"))
    hidden.setAttribute("data-agent-hidden", "")
    return [
      addSwitch(panel, "beta", "Beta features"),
      addField(secret, "recovery", "Recovery code", "canary-behind-secret"),
      addField(hidden, "notes", "Kanary notes", "canary-behind-hidden"),
      () => secret.remove(),
      () => hidden.remove(),
    ]
  })
  const danger = addSection("danger", "Danger zone", (panel) => [
    addSwitch(panel, "wipe", "Delete everything"),
  ])
  danger.trigger.setAttribute("data-agent-confirm", "Shows what deletes data")

  const agent = createAgent()
  const told: unknown[] = []
  cleanups.push(agent.subscribe((change) => told.push(change)))
  const act = async (...steps: Parameters<typeof agent.act>[0]["steps"]) => {
    const outcome = await agent.act({ steps })
    told.push(outcome)
    return outcome
  }
  told.push(agent.snapshot())
  told.push(await agent.query({ closed: true }))
  expect(advanced.opened()).toBe(1)
  expect((await act(check("Accept the terms"))).ok).toBe(true)
  expect((await act(check("Beta features"))).ok).toBe(true)
  expect((await act(check("Delete everything"))).ok).toBe(false)
  expect((await act(check("Nowhere"))).ok).toBe(false)
  const named = await act({
    ref: "Danger zone",
    action: "setOpen",
    args: [true],
  })
  expect(named.error?.message).toMatch(/^Needs a person: /)
  const read = await act({ ref: "Recovery code", action: "expect", args: [""] })
  expect(read.error?.message).toContain("is private")
  await act({ ref: "PIN", action: "setValue", args: ["0000"] })
  for (const query of [
    { text: "plan" },
    { text: "draft" },
    { text: "Jane" },
    { kind: "input" },
    { kind: "input", closed: true },
    { closed: true },
  ]) {
    told.push(await agent.query(query))
  }
  unshown.forEach((off) => off())
  await act({ ref: "Accept the terms", action: "setChecked", args: [false] })
  told.push(agent.snapshot())

  expect(JSON.stringify(told)).not.toMatch(/canary|kanary/i)
  expect(danger.opened()).toBe(0)
  expect(danger.instance.get().open).toBe(false)
})
