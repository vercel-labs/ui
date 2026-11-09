// Containers first, so their parts find them as they upgrade.
import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/menubar"
import "@ui-sdk/web/toggle"
import "@ui-sdk/web/menu"
import "@ui-sdk/web/select"
import "@ui-sdk/web/number-input"
import type { MenuData } from "@ui-sdk/core/menu"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { menus, type Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Attributes for every option that is set: booleans by presence.
function attributes(options: Record<string, unknown> = {}) {
  return Object.entries(options)
    .map(([name, value]) => {
      if (value === true) {
        return ` ${kebab(name)}`
      }
      if (value === false) {
        return ` ${kebab(name)}="false"`
      }
      return ` ${kebab(name)}="${value}"`
    })
    .join("")
}

const button = (label: string, extra = "") =>
  `<ui-toolbar-button${extra}><button class="${classes.item}" data-log="${label.toLowerCase()}">${label}</button></ui-toolbar-button>`

function toolbarContent(variant: Variant) {
  if (variant.content === "basic") {
    return `
      <ui-toggle-group class="${classes.group}" aria-label="Style" multiple>
        <ui-toggle value="bold"><button class="${classes.item}">Bold</button></ui-toggle>
        <ui-toggle value="italic"><button class="${classes.item}">Italic</button></ui-toggle>
      </ui-toggle-group>
      <ui-toolbar-separator class="${classes.separator}"></ui-toolbar-separator>
      ${button("Undo")}
      ${button("Redo", ` disabled${variant.skipDisabled ? ' focusable-when-disabled="false"' : ""}`)}
      <ui-toolbar-link><a class="${classes.item}" href="#kitchen-sink-help">Help</a></ui-toolbar-link>`
  }
  if (variant.content === "composed") {
    return `
      <ui-menu>
        <ui-toolbar-button><ui-menu-trigger><button class="${classes.item}">Font</button></ui-menu-trigger></ui-toolbar-button>
        <ui-menu-content class="${classes.popup}">
          ${["Sans", "Serif", "Mono"].map((font) => `<ui-menu-item class="${classes.menuItem}" value="${font}">${font}</ui-menu-item>`).join("")}
        </ui-menu-content>
      </ui-menu>
      <ui-select default-value="100">
        <ui-toolbar-button><ui-select-trigger><button class="${classes.item}" aria-label="Zoom"><ui-select-value></ui-select-value></button></ui-select-trigger></ui-toolbar-button>
        <ui-select-content class="${classes.popup}">
          ${["50", "100", "200"].map((zoom) => `<ui-select-item class="${classes.menuItem}" value="${zoom}">${zoom}%</ui-select-item>`).join("")}
        </ui-select-content>
      </ui-select>
      <ui-number-input default-value="14">
        <ui-toolbar-input><ui-number-input-control><input class="${classes.input}" aria-label="Size" /></ui-number-input-control></ui-toolbar-input>
      </ui-number-input>
      <ui-toolbar-input><input class="${classes.input}" aria-label="Find" placeholder="Find" /></ui-toolbar-input>`
  }
  return `
    <ui-toolbar-group class="${classes.group}" aria-label="Clipboard">${button("Cut")}${button("Copy")}</ui-toolbar-group>
    <ui-toolbar-separator class="${classes.separator}"></ui-toolbar-separator>
    <ui-toolbar-group class="${classes.group}" aria-label="History" disabled>${button("Undo")}${button("Redo")}</ui-toolbar-group>
    <ui-toggle><button class="${classes.item}">Wrap</button></ui-toggle>`
}

const { file, edit, view, profiles } = menus

const item = (entry: {
  value: string
  label: string
  shortcut?: string
  disabled?: boolean
}) =>
  `<ui-menu-item class="${classes.menuItem}" value="${entry.value}"${entry.shortcut ? ` shortcut="${entry.shortcut}"` : ""}${entry.disabled ? " disabled" : ""}>${entry.label}</ui-menu-item>`

const trigger = (label: string) =>
  `<ui-menu-trigger><button class="${classes.item}">${label}</button></ui-menu-trigger>`

// The parts a data menu copies for its items.
const template = `<template>
  <ui-menu-content class="${classes.popup}"></ui-menu-content>
  <ui-menu-item class="${classes.menuItem}"></ui-menu-item>
  <ui-menu-checkbox-item class="${classes.menuItem}"></ui-menu-checkbox-item>
  <ui-menu-radio-item class="${classes.menuItem}"></ui-menu-radio-item>
  <ui-menu-sub-trigger class="${classes.menuItem}"></ui-menu-sub-trigger>
  <ui-menu-sub-content class="${classes.popup}"></ui-menu-sub-content>
  <ui-menu-separator class="${classes.separator}"></ui-menu-separator>
</template>`

function menubarContent(variant: Variant) {
  if (variant.data) {
    return [file, edit, view, profiles]
      .map((menu) => `<ui-menu>${trigger(menu.trigger)}${template}</ui-menu>`)
      .join("")
  }
  return `
    <ui-menu>
      ${trigger(file.trigger)}
      <ui-menu-content class="${classes.popup}">
        ${file.items.map(item).join("")}
        <ui-menu-sub>
          <ui-menu-sub-trigger class="${classes.menuItem}">Share</ui-menu-sub-trigger>
          <ui-menu-sub-content class="${classes.popup}">${file.share.map((label) => item({ value: label, label })).join("")}</ui-menu-sub-content>
        </ui-menu-sub>
      </ui-menu-content>
    </ui-menu>
    <ui-menu>${trigger(edit.trigger)}<ui-menu-content class="${classes.popup}">${edit.items.map(item).join("")}</ui-menu-content></ui-menu>
    <ui-menu>
      ${trigger(view.trigger)}
      <ui-menu-content class="${classes.popup}">
        ${view.checkboxes.map((entry) => `<ui-menu-checkbox-item class="${classes.menuItem}" value="${entry.value}">${entry.label}</ui-menu-checkbox-item>`).join("")}
      </ui-menu-content>
    </ui-menu>
    <ui-menu>
      ${trigger(profiles.trigger)}
      <ui-menu-content class="${classes.popup}">
        <ui-menu-radio-group default-value="Benoit">
          ${profiles.radios.map((label) => `<ui-menu-radio-item class="${classes.menuItem}" value="${label}">${label}</ui-menu-radio-item>`).join("")}
        </ui-menu-radio-group>
        <ui-menu-separator class="${classes.separator}"></ui-menu-separator>
        ${item({ value: "manage", label: "Manage…" })}
      </ui-menu-content>
    </ui-menu>`
}

// The same menus as data, for the data variant.
const data: MenuData[] = [
  [
    ...file.items,
    {
      type: "submenu",
      label: "Share",
      items: file.share.map((label) => ({ value: label, label })),
    },
  ],
  edit.items,
  view.checkboxes.map((entry) => ({ type: "checkbox" as const, ...entry })),
  [
    {
      type: "radio-group",
      name: "profile",
      defaultValue: "Benoit",
      items: profiles.radios.map((label) => ({ value: label, label })),
    },
  ],
]

function listen(slot: HTMLElement, env: Env) {
  for (const type of [
    "valuechange",
    "pressedchange",
    "checkedchange",
    "action",
    "openchange",
  ]) {
    slot.addEventListener(type, (event) => {
      const { value, reason, source } = (event as CustomEvent).detail
      env.log(
        `${type} ${JSON.stringify(value)}${reason ? ` (${reason}, ${source})` : ""}`
      )
    })
  }
  slot.addEventListener("click", (event) => {
    const log = (event.target as HTMLElement)
      .closest("[data-log]")
      ?.getAttribute("data-log")
    if (log) {
      env.log(log)
    }
  })
}

type Controlled = HTMLElement & { api: Record<string, () => unknown> }

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const tag = variant.section === "Toolbar" ? "ui-toolbar" : "ui-menubar"
    const content =
      variant.section === "Toolbar"
        ? toolbarContent(variant)
        : menubarContent(variant)
    slot.innerHTML = `<${tag} class="${classes.bar}" aria-label="${variant.title}"${attributes(variant.options)}>${content}</${tag}>`
    if (variant.data) {
      slot
        .querySelectorAll<HTMLElement & { items?: MenuData }>("ui-menu")
        .forEach((menu, index) => (menu.items = data[index]))
    }
    listen(slot, env)
    if (!variant.controller) {
      return
    }
    const owner = slot.querySelector<Controlled>(tag)!
    env.controls(
      variant.section === "Toolbar"
        ? [["focus()", () => owner.api.focus()]]
        : [
            ["focus()", () => owner.api.focus()],
            ["isOpen()", () => owner.api.isOpen()],
            ["close()", () => owner.api.close()],
          ]
    )
  })
}

export { mount }
