import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  createTokenInputController,
  TokenInput,
  TokenInputEditor,
  type Token,
  type TokenInputValue,
} from "@ui-sdk/angular/token-input"

@Component({
  imports: [Field, FieldLabel, TokenInput, TokenInputEditor],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          (mousedown)="keepFocus($event)"
          (click)="attachFile()"
        >
          Attach File
        </button>
        <button
          type="button"
          (mousedown)="keepFocus($event)"
          (click)="showPath()"
        >
          Show Path
        </button>
        <button
          type="button"
          (mousedown)="keepFocus($event)"
          (click)="removeFirst()"
        >
          Remove First
        </button>
        <button
          type="button"
          (mousedown)="keepFocus($event)"
          (click)="prompt.undo()"
        >
          Undo
        </button>
        <button
          type="button"
          (mousedown)="keepFocus($event)"
          (click)="prompt.clear()"
        >
          Clear
        </button>
      </div>
      <div uiField>
        <label uiFieldLabel>Prompt</label>
        <div uiTokenInput [controller]="prompt" [defaultValue]="draft">
          <div uiTokenInputEditor></div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly draft: TokenInputValue = [
    "Compare ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " with ",
  ]

  readonly loadFile = () =>
    new Promise<void>((resolve) => setTimeout(resolve, 800))

  readonly prompt = createTokenInputController()

  readonly firstToken = () =>
    this.prompt
      .getValue()
      .find((segment): segment is Token => typeof segment !== "string")

  readonly keepFocus = (event: MouseEvent) => event.preventDefault()

  showPath() {
    const token = this.firstToken()
    if (token) {
      this.prompt.updateToken(token.id!, { label: token.value })
    }
  }

  removeFirst() {
    const token = this.firstToken()
    if (token) {
      this.prompt.removeToken(token.id!)
    }
  }

  attachFile() {
    this.prompt.insert(
      { type: "file", value: "package.json", label: "package.json" },
      { at: "end", resolve: this.loadFile() }
    )
  }
}

export { Example }
