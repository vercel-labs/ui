// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "../src/checkbox"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../src/field"
import { Input, InputClear, InputGroup } from "../src/input"
import { Radio, RadioGroup, RadioIndicator } from "../src/radio"
import { Switch, SwitchThumb } from "../src/switch"
import { Textarea } from "../src/textarea"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    Field,
    FieldControl,
    FieldDescription,
    FieldError,
    FieldLabel,
    Input,
    InputClear,
    InputGroup,
    Radio,
    RadioGroup,
    RadioIndicator,
    Switch,
    SwitchThumb,
    Textarea,
  ],
  template: `
    <form id="form">
      <div uiField name="email" id="email-field" [invalid]="invalid()">
        <label uiFieldLabel>Email</label>
        <input uiInput id="email" [(value)]="email" required />
        <p uiFieldDescription>We never share it.</p>
        <p uiFieldError id="email-error"></p>
      </div>
      <div uiField name="plain" id="plain-field">
        <label uiFieldLabel>Plain</label>
        <input uiFieldControl id="plain" />
      </div>
      <div uiField>
        <input uiFieldControl id="bound" [name]="'nickname'" />
      </div>
      <div uiField name="account">
        <input uiInput id="handle" [name]="'handle'" />
      </div>
      <div uiField [name]="city()">
        <input uiInput id="city" />
      </div>
      <div uiField name="news" id="news-field">
        <label uiFieldLabel>Newsletter</label>
        <button type="button" uiSwitch id="news" [(checked)]="news">
          <span uiSwitchThumb></span>
        </button>
      </div>
      <button type="button" uiCheckbox id="terms" name="terms" defaultChecked>
        <span *uiCheckboxIndicator id="terms-check">x</span>
      </button>
      <div uiCheckboxGroup id="toppings" name="toppings" [(value)]="toppings">
        <button type="button" uiCheckbox value="ham">Ham</button>
        <button type="button" uiCheckbox value="olive">Olive</button>
      </div>
      <div uiRadioGroup id="size" name="size" [(value)]="size">
        <button type="button" uiRadio value="s">
          <span *uiRadioIndicator class="dot"></span>S
        </button>
        <button type="button" uiRadio value="m">M</button>
        <button type="button" uiRadio value="l" disabled>L</button>
      </div>
      <div uiInputGroup id="search-group">
        <input uiInput id="search" name="q" defaultValue="tea" />
        <button type="button" *uiInputClear id="clear">Clear</button>
      </div>
      <textarea
        uiTextarea
        id="bio"
        name="bio"
        submitShortcut="enter"
        (submit)="sent.set($event.value)"
      ></textarea>
    </form>
  `,
})
class Page {
  readonly email = signal("a@b.co")
  readonly invalid = signal<boolean | undefined>(undefined)
  readonly city = signal<string | undefined>("city")
  readonly news = signal(false)
  readonly toppings = signal<string[]>(["ham"])
  readonly size = signal<string | null>("s")
  readonly sent = signal("")
}

const el = <T extends HTMLElement = HTMLElement>(
  host: HTMLElement,
  selector: string
) => host.querySelector<T>(selector)!
const data = (host: HTMLElement) =>
  Array.from(new FormData(el<HTMLFormElement>(host, "#form")).entries())
const key = (target: HTMLElement, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true })
  )

describe("forms", () => {
  test("a field wires its label, description and name to an Input", async () => {
    const { host, instance, settle } = await mount(Page)
    const input = el<HTMLInputElement>(host, "#email")
    const label = el<HTMLLabelElement>(host, "#email-field label")
    expect(input.value).toBe("a@b.co")
    expect(input.name).toBe("email")
    expect(label.htmlFor).toBe("email")
    expect(input.getAttribute("aria-labelledby")).toBe(label.id)
    expect(input.getAttribute("aria-describedby")).toBe(
      el(host, "#email-field p").id
    )
    input.value = "c@d.co"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await settle()
    expect(instance.email()).toBe("c@d.co")
    instance.email.set("e@f.co")
    await settle()
    expect(input.value).toBe("e@f.co")
  })

  test("an invalid field shows its error and marks the control", async () => {
    const { host, instance, settle } = await mount(Page)
    const error = el(host, "#email-error")
    expect(error.hidden).toBe(true)
    instance.invalid.set(true)
    await settle()
    expect(error.hidden).toBe(false)
    expect(el(host, "#email").getAttribute("aria-invalid")).toBe("true")
    expect(el(host, "#email").getAttribute("aria-describedby")).toContain(
      error.id
    )
  })

  test("a FieldControl wires a plain input and gives it the field's name", async () => {
    const { host } = await mount(Page)
    const input = el<HTMLInputElement>(host, "#plain")
    const label = el<HTMLLabelElement>(host, "#plain-field label")
    expect(label.htmlFor).toBe("plain")
    expect(input.getAttribute("aria-labelledby")).toBe(label.id)
    expect(input.name).toBe("plain")
    expect(el<HTMLInputElement>(host, "#bound").name).toBe("nickname")
    expect(el<HTMLInputElement>(host, "#handle").name).toBe("handle")
  })

  test("an input follows its field's name, and drops it with the field", async () => {
    const { host, instance, settle } = await mount(Page)
    const input = el<HTMLInputElement>(host, "#city")
    expect(input.name).toBe("city")
    instance.city.set("town")
    await settle()
    expect(input.name).toBe("town")
    instance.city.set(undefined)
    await settle()
    expect(input.hasAttribute("name")).toBe(false)
  })

  test("a switch submits through its hidden input and takes its field's name", async () => {
    const { host, instance, settle } = await mount(Page)
    const control = el(host, "#news")
    const label = el<HTMLLabelElement>(host, "#news-field label")
    expect(control.getAttribute("role")).toBe("switch")
    expect(control.getAttribute("aria-checked")).toBe("false")
    expect(control.getAttribute("aria-labelledby")).toContain(label.id)
    const hidden = control.nextElementSibling as HTMLInputElement
    expect(hidden.localName).toBe("input")
    expect(hidden.name).toBe("news")
    expect(data(host).some(([name]) => name === "news")).toBe(false)
    control.click()
    await settle()
    expect(instance.news()).toBe(true)
    expect(control.getAttribute("aria-checked")).toBe("true")
    expect(data(host)).toContainEqual(["news", "on"])
    label.click()
    await settle()
    expect(instance.news()).toBe(false)
  })

  test("a checkbox shows its indicator only while checked", async () => {
    const { host, settle } = await mount(Page)
    const control = el(host, "#terms")
    expect(control.getAttribute("aria-checked")).toBe("true")
    expect(host.querySelector("#terms-check")).not.toBeNull()
    expect(data(host)).toContainEqual(["terms", "on"])
    control.click()
    await settle()
    expect(host.querySelector("#terms-check")).toBeNull()
    expect(data(host).some(([name]) => name === "terms")).toBe(false)
  })

  test("a checkbox group keeps its checkboxes' values", async () => {
    const { host, instance, settle } = await mount(Page)
    const [ham, olive] = host.querySelectorAll<HTMLElement>("#toppings button")
    expect(ham!.getAttribute("aria-checked")).toBe("true")
    expect(olive!.getAttribute("aria-checked")).toBe("false")
    olive!.click()
    await settle()
    expect(instance.toppings()).toEqual(["ham", "olive"])
    expect(data(host).filter(([name]) => name === "toppings")).toEqual([
      ["toppings", "ham"],
      ["toppings", "olive"],
    ])
  })

  test("a radio group moves with the arrow keys and skips disabled radios", async () => {
    const { host, instance, settle } = await mount(Page)
    const [small, medium] = host.querySelectorAll<HTMLElement>("#size button")
    expect(small!.getAttribute("aria-checked")).toBe("true")
    expect(small!.querySelector(".dot")).not.toBeNull()
    expect(data(host)).toContainEqual(["size", "s"])
    small!.focus()
    key(small!, "ArrowDown")
    await settle()
    expect(instance.size()).toBe("m")
    expect(document.activeElement).toBe(medium)
    key(medium!, "ArrowDown")
    await settle()
    expect(instance.size()).toBe("s")
    expect(data(host)).toContainEqual(["size", "s"])
  })

  test("an input group's clear button empties the field", async () => {
    const { host, settle } = await mount(Page)
    const input = el<HTMLInputElement>(host, "#search")
    expect(input.value).toBe("tea")
    el(host, "#clear").click()
    await settle()
    expect(input.value).toBe("")
    expect(host.querySelector("#clear")).toBeNull()
  })

  test("a textarea emits submit on its shortcut", async () => {
    const { host, instance, settle } = await mount(Page)
    const area = el<HTMLTextAreaElement>(host, "#bio")
    area.value = "Hello"
    area.dispatchEvent(new Event("input", { bubbles: true }))
    key(area, "Enter")
    await settle()
    expect(instance.sent()).toBe("Hello")
  })
})
