// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
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
