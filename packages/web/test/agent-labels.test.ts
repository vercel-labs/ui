// @vitest-environment jsdom
// The agent names a component by its label, like React's does, though the
// web adapter keys every part by its element.
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineComboboxElements } from "../src/combobox"
import { defineDialogElements } from "../src/dialog"
import { defineFieldElements } from "../src/field"
import { definePopoverElements } from "../src/popover"
import { defineSliderElements } from "../src/slider"
import { defineTabsElements } from "../src/tabs"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineComboboxElements()
  defineTabsElements()
  defineDialogElements()
  defineFieldElements()
  defineSliderElements()
  definePopoverElements()
})

test("a combobox is named by its label, not by its trigger", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-combobox>
      <ui-combobox-label>Assignee</ui-combobox-label>
      <ui-combobox-input><input placeholder="Nobody" /></ui-combobox-input>
      <ui-combobox-trigger><button aria-label="Show people">⌄</button></ui-combobox-trigger>
      <ui-combobox-content>
        <ui-combobox-list><ui-combobox-item value="ann">Ann</ui-combobox-item></ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>`
  await wait()
  expect(agent.snapshot()).toEqual([
    expect.objectContaining({ component: "combobox", label: "Assignee" }),
  ])
})

test("tabs are named by their list, like React's", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-tabs default-value="profile">
      <ui-tabs-list aria-label="Settings">
        <ui-tabs-tab value="profile"><button type="button">Profile</button></ui-tabs-tab>
        <ui-tabs-tab value="billing"><button type="button">Billing</button></ui-tabs-tab>
      </ui-tabs-list>
      <ui-tabs-panel value="profile">Profile settings</ui-tabs-panel>
      <ui-tabs-panel value="billing">Billing settings</ui-tabs-panel>
    </ui-tabs>`
  await wait()
  expect(agent.snapshot()).toContainEqual(
    expect.objectContaining({ component: "tabs", label: "Settings" })
  )
  const result = await agent.act({
    steps: [{ ref: "Settings", action: "setValue", args: ["billing"] }],
  })
  expect(result.ok).toBe(true)
})

test("a closed dialog isn't named by a button inside its hidden content", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button><svg aria-hidden="true"></svg></button></ui-dialog-trigger>
      <ui-dialog-content>
        <ui-dialog-close><button>Done</button></ui-dialog-close>
      </ui-dialog-content>
    </ui-dialog>`
  await wait()
  const dialog = agent
    .snapshot()
    .find((component) => component.component === "dialog" && !component.offPage)
  expect(dialog).toBeDefined()
  expect(dialog?.label).toBeUndefined()
})

test("a slider is named by its field's label, through its one thumb", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-field>
      <ui-field-label>Volume</ui-field-label>
      <ui-slider default-value="50">
        <ui-slider-control>
          <ui-slider-track>
            <ui-slider-indicator></ui-slider-indicator>
            <ui-slider-thumb></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
    </ui-field>`
  await wait()
  expect(agent.snapshot()).toContainEqual(
    expect.objectContaining({ component: "slider", label: "Volume" })
  )
})

test("a slider's name leaves out what its field's label keeps from agents", async () => {
  const agent = createAgent()
  const slider = `
    <ui-slider default-value="50">
      <ui-slider-control>
        <ui-slider-track><ui-slider-thumb></ui-slider-thumb></ui-slider-track>
      </ui-slider-control>
    </ui-slider>`
  document.body.innerHTML = `
    <ui-field>
      <ui-field-label>Budget <span data-agent-hidden>for Canary</span></ui-field-label>
      ${slider}
    </ui-field>
    <ui-field>
      <ui-field-label data-agent-hidden>Canary bonus</ui-field-label>
      ${slider}
    </ui-field>`
  await wait()
  const sliders = agent
    .snapshot()
    .filter(({ component, offPage }) => component === "slider" && !offPage)
  expect(sliders.map((component) => component.label)).toEqual([
    "Budget",
    undefined,
  ])
  const read = [
    agent.snapshot(),
    await agent.query({ kind: "slider" }),
    await agent.query({ text: "canary" }),
    await agent.act({
      steps: [{ ref: "bonus", action: "setValue", args: [10] }],
    }),
  ]
  expect(JSON.stringify(read)).not.toMatch(/canary/i)
})

test("a closed popup is named by its trigger, not by its hidden content", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-popover>
      <ui-popover-trigger><button>Share</button></ui-popover-trigger>
      <ui-popover-content>
        <ui-popover-title as-child><h2>Share this project</h2></ui-popover-title>
        <ui-popover-description as-child><p>Anyone with the link can view it.</p></ui-popover-description>
      </ui-popover-content>
    </ui-popover>
    <ui-combobox default-value="jp">
      <ui-combobox-trigger>
        <button id="country" aria-labelledby="country-name country-value">
          <span id="country-name">Country</span> <span id="country-value">Japan</span>
        </button>
      </ui-combobox-trigger>
      <ui-combobox-content anchor="#country">
        <ui-combobox-input><input aria-label="Search countries" /></ui-combobox-input>
        <ui-combobox-list><ui-combobox-item value="jp">Japan</ui-combobox-item></ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>`
  await wait()
  const [popover, combobox] = agent.snapshot()
  expect(popover).toMatchObject({ component: "popover", label: "Share" })
  expect(popover).not.toHaveProperty("text")
  expect(combobox).toMatchObject({
    component: "combobox",
    label: "Country Japan",
  })
})

test("a closed dialog opened from many rows is named by its title", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-dialog-trigger for="member"><button>Edit</button></ui-dialog-trigger>
    <ui-dialog-trigger for="member"><button>Edit</button></ui-dialog-trigger>
    <ui-dialog id="member">
      <ui-dialog-content>
        <ui-dialog-title>Edit member</ui-dialog-title>
        <ui-dialog-close><button>Done</button></ui-dialog-close>
      </ui-dialog-content>
    </ui-dialog>`
  await wait()
  expect(agent.snapshot()).toContainEqual(
    expect.objectContaining({ component: "dialog", label: "Edit member" })
  )
})
