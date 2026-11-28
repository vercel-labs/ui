// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Checkbox, CheckboxGroup } from "../src/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "../src/field"
import { Input } from "../src/input"
import { Radio, RadioGroup } from "../src/radio"
import { Switch } from "../src/switch"
import { Textarea } from "../src/textarea"
import { render, tagWith } from "./render"

@Component({
  selector: "test-root",
  imports: [
    Checkbox,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    Input,
    Radio,
    RadioGroup,
    Switch,
    Textarea,
  ],
  template: `
    <form>
      <div uiField name="email">
        <label uiFieldLabel>Email</label>
        <input uiInput defaultValue="a@b.co" required />
        <p uiFieldDescription>We never share it.</p>
        <p uiFieldError>Wrong</p>
      </div>
      <div uiField name="news">
        <label uiFieldLabel>Newsletter</label>
        <button type="button" uiSwitch defaultChecked>News</button>
      </div>
      <button type="button" uiCheckbox name="terms" defaultChecked>
        Terms
      </button>
      <div uiRadioGroup name="size" defaultValue="m">
        <button type="button" uiRadio value="s">Small</button>
        <button type="button" uiRadio value="m">Medium</button>
      </div>
      <textarea uiTextarea name="bio" defaultValue="Hello"></textarea>
    </form>
  `,
})
class Page {}

@Component({
  selector: "test-root",
  imports: [Checkbox, CheckboxGroup, Field, FieldLabel],
  template: `
    <div uiField>
      <span uiFieldLabel>Cities</span>
      <div uiCheckboxGroup>
        <div uiField disabled name="tokyo-field">
          <button uiCheckbox value="tokyo"></button>
          <label uiFieldLabel>Tokyo</label>
        </div>
      </div>
    </div>
  `,
})
class GroupedField {}

describe("forms on the server", () => {
  test("a field's label, description and control point at each other", async () => {
    const html = await render(Page)
    const input = html.match(/<input[^>]*uiinput[^>]*>/)?.[0] ?? ""
    const id = input.match(/ id="([^"]+)"/)?.[1]
    const label = tagWith(html, "Email")
    const labelId = label.match(/ id="([^"]+)"/)?.[1]
    const description = tagWith(html, "We never share it.")
    expect(id).toBeTruthy()
    expect(label).toContain(`for="${id}"`)
    expect(input).toContain(`aria-labelledby="${labelId}"`)
    expect(input).toContain(
      `aria-describedby="${description.match(/ id="([^"]+)"/)?.[1]}"`
    )
    expect(input).toContain('name="email"')
    expect(input).toContain('value="a@b.co"')
    expect(input).toContain("required")
    expect(tagWith(html, "Wrong")).toContain("hidden")
  })

  test("a checkbox in a field of its own inside a group takes that field", async () => {
    const html = await render(GroupedField)
    const button = html.match(/<button[^>]*>/)![0]
    const id = button.match(/ id="([^"]+)"/)![1]
    expect(html).toContain(`for="${id}"`)
    expect(button).toContain('aria-disabled="true"')
    expect(button).not.toContain("tabindex")
    expect(html).toMatch(/<div[^>]*role="group"[^>]*aria-labelledby=/)
    const hidden = html.match(/<input[^>]*data-slot="checkbox-input"[^>]*>/)![0]
    expect(hidden).not.toContain("name=")
  })

  test("controls render their state and the hidden inputs that submit it", async () => {
    const html = await render(Page)
    const news = tagWith(html, "News")
    expect(news).toContain('role="switch"')
    expect(news).toContain('aria-checked="true"')
    expect(html).toMatch(/<input[^>]*type="checkbox"[^>]*name="news"[^>]*>/)
    expect(html).toMatch(/<input[^>]*name="news"[^>]*checked/)
    expect(tagWith(html, "Terms")).toContain('aria-checked="true"')
    expect(html).toMatch(/<input[^>]*name="terms"[^>]*checked/)
    expect(tagWith(html, "Medium")).toContain('aria-checked="true"')
    expect(tagWith(html, "Small")).toContain('aria-checked="false"')
    expect(html).toMatch(/<input[^>]*type="radio"[^>]*value="m"[^>]*checked/)
    expect(html).toMatch(/<textarea[^>]*name="bio"[^>]*>Hello<\/textarea>/)
  })
})
