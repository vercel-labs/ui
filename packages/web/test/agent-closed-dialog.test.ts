// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { observe } from "@ui-sdk/core/observe"
import { createAgent } from "../src/agent"
import { defineDialogElements } from "../src/dialog"
import { defineInputElements } from "../src/input"
import { defineSwitchElements } from "../src/checkbox"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "")
  }
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open")
  }
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineDialogElements()
  defineInputElements()
  defineSwitchElements()
})

test("a closed dialog's fields stay listed with offPage and their state, like React's", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button>Invite member</button></ui-dialog-trigger>
      <ui-dialog-content>
        <ui-dialog-title>Invite member</ui-dialog-title>
        <ui-input><input aria-label="Email" value="ada@example.com" /></ui-input>
        <ui-input><input aria-label="Password" type="password" value="hunter2" /></ui-input>
        <ui-switch aria-label="Send invite" default-checked></ui-switch>
      </ui-dialog-content>
    </ui-dialog>`
  await wait()
  const dialog = document.querySelector("ui-dialog") as HTMLElement & {
    open: boolean
  }
  const fields = () =>
    agent
      .snapshot()
      .filter(
        ({ component }) => component === "input" || component === "switch"
      )
      .map(({ label, offPage, value, checked }) => ({
        label,
        offPage: !!offPage,
        ...(value !== undefined && { value }),
        ...(checked !== undefined && { checked }),
      }))
  expect(fields()).toEqual([])
  dialog.open = true
  await wait(50)
  expect(fields().map(({ label, offPage }) => [label, offPage])).toEqual([
    ["Email", false],
    ["Password", false],
    ["Send invite", false],
  ])
  dialog.open = false
  await wait(50)
  expect(fields()).toEqual([
    { label: "Email", offPage: true, value: "ada@example.com" },
    { label: "Send invite", offPage: true, checked: true },
  ])
  dialog.open = true
  await wait(50)
  expect(fields().map(({ label, offPage }) => [label, offPage])).toEqual([
    ["Email", false],
    ["Password", false],
    ["Send invite", false],
  ])
})

test("a closed dialog's fields keep the rows and values they had when it closed", async () => {
  const agent = createAgent()
  const stop = observe(() => {})
  document.body.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button>Members</button></ui-dialog-trigger>
      <ui-dialog-content>
        <ui-dialog-title>Members</ui-dialog-title>
        <ul>
          <li>Ada Lovelace <ui-switch aria-label="Admin" default-checked></ui-switch></li>
          <li>Grace Hopper <ui-switch aria-label="Admin"></ui-switch></li>
        </ul>
        <div id="key"><ui-input><input aria-label="API key" value="key_A" /></ui-input></div>
      </ui-dialog-content>
    </ui-dialog>`
  await wait()
  const dialog = document.querySelector("ui-dialog") as HTMLElement & {
    open: boolean
  }
  const fields = () =>
    agent
      .snapshot()
      .filter(({ label }) => label === "Admin" || label === "API key")
      .map(({ label, row, offPage, value, checked }) => ({
        label,
        offPage: !!offPage,
        ...(row !== undefined && { row }),
        ...(value !== undefined && { value }),
        ...(checked !== undefined && { checked }),
      }))
  dialog.open = true
  await wait(50)
  agent.snapshot()
  const [ada, grace] = document.querySelectorAll(
    "ui-switch"
  ) as unknown as (HTMLElement & {
    checked: boolean
  })[]
  grace.click()
  expect(grace.checked).toBe(true)
  await wait(50)
  dialog.open = false
  await wait(50)
  document.querySelector("input")!.value = "key_B"
  ada.checked = false
  await wait(50)
  expect(fields()).toEqual([
    { label: "Admin", offPage: true, row: "Ada Lovelace", checked: true },
    { label: "Admin", offPage: true, row: "Grace Hopper", checked: true },
    { label: "API key", offPage: true, value: "key_A" },
  ])
  expect(await agent.query({ text: "Ada Lovelace" })).toMatchObject([
    { label: "Admin", row: "Ada Lovelace" },
  ])
  document.querySelector("#key")!.setAttribute("data-agent-hidden", "")
  document.querySelector("li")!.setAttribute("data-agent-secret", "")
  await wait(50)
  expect(fields().map(({ label, row }) => [label, row])).toEqual([
    ["Admin", "Grace Hopper"],
  ])
  dialog.open = true
  await wait(50)
  expect(
    fields().map(({ label, offPage, checked }) => [label, offPage, checked])
  ).toEqual([
    ["Admin", false, "[redacted]"],
    ["Admin", false, true],
  ])
  stop()
})
