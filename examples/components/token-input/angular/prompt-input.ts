import { Component, DestroyRef, inject, signal } from "@angular/core"
import {
  LucideArrowUp,
  LucideCheck,
  LucideClock,
  LucideCode,
  LucideFile,
  LucideX,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  createTokenInputController,
  toText,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenDef,
  TokenInputTokenRemove,
  type TokenInputValue,
} from "@ui-sdk/angular/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenDef,
    TokenInputTokenRemove,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuEmpty,
    TriggerMenuHint,
    TriggerMenuItem,
    TriggerMenuList,
    LucideArrowUp,
    LucideCheck,
    LucideClock,
    LucideCode,
    LucideFile,
    LucideX,
  ],
  template: `
    <div uiTokenInput [controller]="prompt" (submit)="send($event.value)">
      <div data-slot="card">
        <div
          uiTokenInputEditor
          aria-label="Prompt"
          placeholder="Ask anything. Type @ or /"
        ></div>
        <span *uiTokenInputTokenDef="let token" uiTokenInputToken>
          @if (token.type === "skill") {
            <svg lucideCode></svg>
          } @else {
            <svg lucideFile></svg>
          }
          {{ token.type === "skill" ? "/" + token.label : token.label }}
          @if (token.data?.run === "running") {
            <svg lucideClock></svg>
          }
          @if (token.data?.run === "done") {
            <svg lucideCheck></svg>
          }
          <span uiTokenInputTokenRemove>
            <svg lucideX></svg>
          </span>
        </span>
        <div data-slot="row">
          <button
            type="button"
            data-size="sm"
            (mousedown)="$event.preventDefault()"
            (click)="attachReadme()"
          >
            Attach README
          </button>
          <button
            type="button"
            data-variant="solid"
            data-size="sm"
            data-shape="round"
            (click)="send(prompt.getValue())"
            [attr.aria-label]="running() ? 'Running' : 'Send'"
            [disabled]="running()"
          >
            @if (running()) {
              <svg lucideClock></svg>
            } @else {
              <svg lucideArrowUp></svg>
            }
          </button>
        </div>
      </div>
      <ng-container
        uiTriggerMenu
        [triggers]="[
          { char: '@', type: 'file', items: files },
          { char: '/', boundary: 'start', type: 'skill', items: skills },
        ]"
        (itemSelect)="$event.trigger === '@' && $event.waitUntil(loadFile())"
      >
        <span uiTriggerMenuHint></span>
        <div *uiTriggerMenuContent>
          <div uiTriggerMenuEmpty>No matches</div>
          <div uiTriggerMenuList #triggerMenuList="uiTriggerMenuList">
            @for (
              item of itemsOf(triggerMenuList.state().items);
              track item.value
            ) {
              <div
                uiTriggerMenuItem
                [value]="item.value"
                [label]="item.label"
                [disabled]="item.disabled"
              >
                {{ item.label }}
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly files = [
    { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
    { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
    { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
    { value: "README.md", label: "README.md" },
    { value: "package.json", label: "package.json" },
  ]

  readonly skills = [
    {
      value: "search",
      label: "search",
      arguments: [{ name: "query", hint: "<query>", required: true }],
    },
    { value: "review", label: "review" },
    { value: "summarize", label: "summarize" },
  ]

  readonly loadFile = () =>
    new Promise<void>((resolve) => setTimeout(resolve, 800))

  readonly log = useLog()

  readonly prompt = createTokenInputController()

  readonly running = signal(false)

  readonly sendTimer = signal<
    ReturnType<typeof setTimeout> | undefined | undefined
  >(undefined)

  send(value: TokenInputValue) {
    if (this.running() || !this.prompt.getLabel().trim()) {
      return
    }
    this.running.set(true)
    const skillTokens = value.filter(
      (segment) => typeof segment !== "string" && segment.type === "skill"
    )
    for (const skill of skillTokens) {
      if (typeof skill !== "string") {
        this.prompt.updateToken(skill.id!, {
          data: { ...skill.data, run: "running" },
        })
      }
    }
    this.sendTimer.set(
      setTimeout(() => {
        for (const skill of skillTokens) {
          if (typeof skill !== "string") {
            this.prompt.updateToken(skill.id!, {
              data: { ...skill.data, run: "done" },
            })
          }
        }
        this.log(`Sent ${toText(this.prompt.getValue())}`)
        this.prompt.clear()
        this.running.set(false)
      }, 1500)
    )
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.sendTimer()))
  }

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }

  attachReadme() {
    this.prompt.insert(
      { type: "file", value: "README.md", label: "README.md" },
      { resolve: this.loadFile() }
    )
  }
}

export { Example }
