import { toText, type Token } from "@ui-sdk/core/token-input"
import "@ui-sdk/web/token-input"
import "@ui-sdk/web/trigger-menu"
import { Check, ChevronRight, Clock, Code, createElement, File, Plus, X } from "lucide"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const skills = [
  { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
  { value: "review", label: "review" },
  { value: "summarize", label: "summarize" },
]

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

export function mount(root: HTMLElement) {
  let sendTimer: ReturnType<typeof setTimeout> | undefined
  root.innerHTML = `
    <form data-slot="stack">
      <ul></ul>
      <ui-token-input>
        <div data-slot="card">
          <ui-token-input-editor aria-label="Prompt" placeholder="Ask anything. @ adds a file, / runs a skill"></ui-token-input-editor>
          <div data-slot="row">
            <button type="button" data-action="readme">${createElement(Plus, { "aria-hidden": "true" }).outerHTML} README</button>
            <button type="submit" aria-label="Send">${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}</button>
          </div>
        </div>
        <ui-trigger-menu>
          <ui-trigger-menu-hint></ui-trigger-menu-hint>
          <ui-trigger-menu-content>
            <ui-trigger-menu-empty>No matches</ui-trigger-menu-empty>
            <ui-trigger-menu-list></ui-trigger-menu-list>
          </ui-trigger-menu-content>
          <template>
            <ui-trigger-menu-item>
            </ui-trigger-menu-item>
          </template>
        </ui-trigger-menu>
      </ui-token-input>
    </form>
  `
  const input = root.querySelector("ui-token-input")!
  const menu = root.querySelector("ui-trigger-menu")!
  const form = root.querySelector("form")!
  const sent = root.querySelector("ul")!
  const submit = root.querySelector<HTMLButtonElement>('button[type="submit"]')!
  const readme = root.querySelector<HTMLButtonElement>('[data-action="readme"]')!
  menu.triggers = [
    { char: "@", type: "file", items: files },
    { char: "/", boundary: "start", type: "skill", items: skills },
  ]
  menu.addEventListener("select", (event) => {
    if (event.detail.trigger === "@") event.detail.waitUntil(loadFile())
  })
  input.renderToken = (token: Token, host: HTMLElement) => {
    const run = token.data?.run
    host.innerHTML = `
      <ui-token-input-token>
        ${createElement(token.type === "skill" ? Code : File, { "aria-hidden": "true" }).outerHTML}
        <span></span>
        ${run === "running" ? createElement(Clock, { "aria-hidden": "true" }).outerHTML : ""}
        ${run === "done" ? createElement(Check, { "aria-hidden": "true" }).outerHTML : ""}
        <ui-token-input-token-remove>${createElement(X, { "aria-hidden": "true" }).outerHTML}</ui-token-input-token-remove>
      </ui-token-input-token>`
    host.querySelector("span")!.textContent = token.type === "skill" ? `/${token.label}` : token.label
  }
  readme.addEventListener("mousedown", (event) => event.preventDefault())
  readme.addEventListener("click", () =>
    input.api.insert({ type: "file", value: "README.md", label: "README.md" }, { resolve: loadFile() }),
  )
  const setRunning = (running: boolean) => {
    submit.disabled = running
    submit.setAttribute("aria-label", running ? "Running" : "Send")
    submit.innerHTML = createElement(running ? Clock : ChevronRight, {
      "aria-hidden": "true",
    }).outerHTML
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    if (submit.disabled || !input.api.getLabel().trim()) return
    setRunning(true)
    const skillTokens = input.api
      .getValue()
      .filter((segment): segment is Token => typeof segment !== "string" && segment.type === "skill")
    for (const skill of skillTokens)
      input.api.updateToken(skill.id!, { data: { ...skill.data, run: "running" } })
    sendTimer = setTimeout(() => {
      for (const skill of skillTokens)
        input.api.updateToken(skill.id!, { data: { ...skill.data, run: "done" } })
      const item = document.createElement("li")
      item.textContent = toText(input.api.getValue())
      sent.append(item)
      input.api.clear()
      setRunning(false)
    }, 1500)
  })

  return () => clearTimeout(sendTimer)
}
