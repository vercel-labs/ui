// @vitest-environment node
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenDef,
  type TokenInputValue,
} from "../src/token-input"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuList,
  type TriggerDefinition,
} from "../src/trigger-menu"
import { render } from "./render"

@Component({
  selector: "test-root",
  imports: [
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenDef,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuInput,
    TriggerMenuList,
  ],
  template: `
    <ng-container uiTokenInput name="message" [(value)]="message">
      <div uiTokenInputEditor placeholder="Type @"></div>
      <span *uiTokenInputTokenDef="let token" uiTokenInputToken>{{
        token.label
      }}</span>
      <ng-container uiTriggerMenu [triggers]="people">
        <div *uiTriggerMenuContent><div uiTriggerMenuList></div></div>
      </ng-container>
    </ng-container>
    <ng-container uiTriggerMenu [triggers]="people">
      <textarea uiTriggerMenuInput aria-label="Plain"></textarea>
    </ng-container>
  `,
})
class Editor {
  readonly message = signal<TokenInputValue>([
    "Hi ",
    { type: "person", value: "ada", label: "Ada" },
  ])
  readonly people: TriggerDefinition[] = [{ char: "@", items: ["Grace"] }]
}

// Runs with no DOM: any access to window or document during render throws.
describe("server rendering", () => {
  test("a token input renders its value in the editor and the textarea a form submits", async () => {
    const html = await render(Editor)
    expect(html).toMatch(
      /role="textbox"[^>]*>Hi [^<]*<span contenteditable="false"/
    )
    expect(html).toMatch(/<textarea[^>]*name="message"[^>]*>Hi /)
    expect(html).toContain('aria-haspopup="listbox"')
  })
})
