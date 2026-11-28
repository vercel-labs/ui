// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenDef,
  TokenInputTokenRemove,
  type TokenInputValue,
} from "../src/token-input"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenDef,
    TokenInputTokenRemove,
  ],
  template: `
    <form>
      <ng-container uiTokenInput [(value)]="value" name="message">
        <div uiTokenInputEditor id="editor" placeholder="Message"></div>
        @if (custom()) {
          <span
            *uiTokenInputTokenDef="let token"
            uiTokenInputToken
            data-content
          >
            {{ loud() ? token.label.toUpperCase() : token.label }}
            <span uiTokenInputTokenRemove data-remove>x</span>
          </span>
        }
      </ng-container>
    </form>
  `,
})
class Page {
  readonly value = signal<TokenInputValue>([
    "Hi ",
    { type: "person", value: "ada", label: "Ada" },
  ])
  readonly custom = signal(true)
  readonly loud = signal(false)
}

const shown = (host: HTMLElement) =>
  [...host.querySelectorAll("[data-content]")].map((el) =>
    el.firstChild?.textContent?.trim()
  )

describe("token input", () => {
  test("the editor is a textbox with the value, and a hidden textarea submits it", async () => {
    const { host } = await mount(Page)
    const editor = host.querySelector<HTMLElement>("#editor")!
    expect(editor.getAttribute("role")).toBe("textbox")
    expect(editor.getAttribute("aria-placeholder")).toBe("Message")
    expect(editor.textContent).toContain("Hi ")
    const field = host.querySelector("textarea")!
    expect(field.name).toBe("message")
    expect(new FormData(host.querySelector("form")!).get("message")).toContain(
      "Ada"
    )
  })

  test("tokens render the definition's template, and follow what it reads", async () => {
    const { host, instance, settle } = await mount(Page)
    expect(shown(host)).toEqual(["Ada"])
    expect(
      host.querySelector("[data-content]")!.getAttribute("data-token-type")
    ).toBe("person")
    instance.loud.set(true)
    await settle()
    expect(shown(host)).toEqual(["ADA"])
    instance.value.set([
      { type: "person", value: "ada", label: "Ada" },
      " and ",
      { type: "person", value: "grace", label: "Grace" },
    ])
    await settle()
    expect(shown(host)).toEqual(["ADA", "GRACE"])
  })

  test("pressing a token's remove part takes it out of the value", async () => {
    const { host, instance, settle } = await mount(Page)
    host.querySelector<HTMLElement>("[data-remove]")!.click()
    await settle()
    expect(instance.value()).toEqual(["Hi "])
    expect(shown(host)).toEqual([])
  })

  test("without a definition, a token shows its label", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.custom.set(false)
    await settle()
    expect(host.querySelector("[data-content]")).toBeNull()
    expect(
      host.querySelector("[data-slot=token-input-host]")!.textContent
    ).toContain("Ada")
  })
})
