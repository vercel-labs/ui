import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
  type EmbeddedViewRef,
  type InputSignal,
  type WritableSignal,
} from "@angular/core"
import {
  tokenInput,
  type Token,
  type TokenInputEditorProps,
  type TokenInputSubmitDetails,
  type TokenInputValue,
  type TokenInputOptions,
} from "@ui-sdk/core/token-input"
import { renderStaticHtml } from "@ui-sdk/core/renderer"
import { optionalBoolean } from "./inputs.ts"
import { EditorContext } from "./editor-context.ts"
import { emitChange, ListenedEmitter } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import {
  usePart,
  usePrimitive,
  useStore,
  type PrimitiveHandle,
} from "./use-primitive.ts"
import { useFormTextarea } from "./native-input.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TokenInputValueChange = Parameters<
  NonNullable<TokenInputOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TokenInputOptions["onValueChange"]>>[0]
}

/**
 * What `(submit)` emits: the value and what came with it.
 * @experimental
 */
type TokenInputSubmit = Parameters<
  NonNullable<TokenInputOptions["onSubmit"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<TokenInputOptions["onSubmit"]>>[0]
}

// The id of the token whose content a `uiTokenInputTokenDef` view renders.
const TokenId = new InjectionToken<string>("ui-sdk token")

@Injectable()
class TokenInputScope {
  handle!: PrimitiveHandle<typeof tokenInput>
  named: () => boolean = () => false
  // Whether a token definition renders the tokens' content.
  readonly custom = signal(false)
}

/**
 * A text field with atomic tokens. A `uiTriggerMenu` inside it suggests into it, and `*uiTokenInputTokenDef="let token"` renders each token's content. It goes on an element or an `<ng-container>` around its parts.
 * @experimental
 */
@Directive({
  selector: "[uiTokenInput]",
  exportAs: "uiTokenInput",
  outputs: ["submit"],
  providers: [
    TokenInputScope,
    {
      provide: EditorContext,
      useFactory: () => {
        const scope = inject(TokenInputScope)
        return () => scope.handle.api.editor
      },
    },
  ],
})
class TokenInput {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The value. Bind it with `[(value)]` to control the input. */
  readonly value: InputSignal<TokenInputOptions["value"]> = input()
  /** The value at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<TokenInputOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<TokenInputValueChange["value"]>()
  /** Runs when typing, pasting, a menu, undo or a controller wants to change the value. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<TokenInputValueChange>()
  /** Runs on the submit shortcut. Without a listener, the shortcut submits the form the input is in. */
  readonly submit = new ListenedEmitter<TokenInputSubmit>()
  /** Which keys submit: `"enter"`, with Shift+Enter for a new line, or `"mod+enter"`, with Enter for a new line. */
  readonly submitShortcut: InputSignal<TokenInputOptions["submitShortcut"]> =
    input()
  /** How Backspace and Delete treat a token next to the caret: `"whole"`, `"select"` or `"revert"`. */
  readonly tokenDeletion: InputSignal<TokenInputOptions["tokenDeletion"]> =
    input()
  /** What copying writes as plain text: `"codec"` keeps tokens through any app that pastes text, `"label"` writes what people read. */
  readonly copy: InputSignal<TokenInputOptions["copy"]> = input()
  /** How tokens become text and back, for the clipboard and forms. */
  readonly codec: InputSignal<TokenInputOptions["codec"]> = input()
  /** What a token says to screen readers besides its label, like its kind and status. */
  readonly getTokenDescription: InputSignal<
    TokenInputOptions["getTokenDescription"]
  > = input()
  /** Undo history: how many steps it keeps, and how long a typing pause starts a new step. */
  readonly history: InputSignal<TokenInputOptions["history"]> = input()
  /** Disables the input: it can't be focused or changed, and isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the input focusable and submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission while the input is empty. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the codec text submits under. Without one, the input submits nothing. */
  readonly name: InputSignal<TokenInputOptions["name"]> = input()
  /** The id of a form to belong to, when the input isn't inside it. */
  readonly form: InputSignal<TokenInputOptions["form"]> = input()
  /** Reads, edits and focuses the input from anywhere. Create one with `createTokenInputController()`. */
  readonly controller: InputSignal<TokenInputOptions["controller"]> = input()

  readonly handle = usePrimitive(tokenInput, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    onSubmit: this.submit.listened()
      ? (value: TokenInputValue, details: TokenInputSubmitDetails) =>
          this.submit.emit({ ...details, value })
      : undefined,
    submitShortcut: this.submitShortcut(),
    tokenDeletion: this.tokenDeletion(),
    copy: this.copy(),
    codec: this.codec(),
    getTokenDescription: this.getTokenDescription(),
    history: this.history(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
  }))

  constructor() {
    const scope = inject(TokenInputScope, { self: true })
    scope.handle = this.handle
    scope.named = () => !!(this.name() ?? this.#field?.name())
    effect(() => this.handle.api.internal.setCustom(scope.custom()))
  }
}

/**
 * The editable text. Core owns its content, so leave it empty; style it, and show the placeholder with `data-empty`. The hidden textarea a form submits goes after it while the input has a `name`.
 * @experimental
 */
@Directive({ selector: "[uiTokenInputEditor]", exportAs: "uiTokenInputEditor" })
class TokenInputEditor {
  /** Text shown while the input is empty, through `aria-placeholder`. Show it with `data-empty:before:content-[attr(aria-placeholder)]`. */
  readonly placeholder: InputSignal<TokenInputEditorProps["placeholder"]> =
    input()

  readonly #scope = inject(TokenInputScope)
  /** The editor's state, as a signal. */
  readonly state = usePart(
    this.#scope.handle,
    "editor",
    () => ({ placeholder: this.placeholder() }),
    { joined: useFieldControl()?.joined }
  ).state

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const { handle, named } = this.#scope
    // The first value as markup, so a server render shows it. A hydrated
    // editor keeps the server's, with what was typed into it since.
    effect(() =>
      untracked(() => {
        if (!el.firstChild) {
          el.innerHTML = renderStaticHtml(
            handle.api.getValue(),
            handle.api.internal.describe
          )
        }
      })
    )
    useFormTextarea(handle, named)
  }
}

/**
 * A token's content, inside a `uiTokenInputTokenDef` template, with its state for styling.
 * @experimental
 */
@Directive({ selector: "[uiTokenInputToken]", exportAs: "uiTokenInputToken" })
class TokenInputToken {
  readonly #id = inject(TokenId)
  /** The token's state, as a signal. */
  readonly state = usePart(inject(TokenInputScope).handle, "token", () => ({
    id: this.#id,
    token: this.#id,
  })).state
}

/**
 * Removes its token when pressed, inside a `uiTokenInputTokenDef` template. Hidden from assistive technology: the keyboard's way is Backspace.
 * @experimental
 */
@Directive({
  selector: "[uiTokenInputTokenRemove]",
  exportAs: "uiTokenInputTokenRemove",
})
class TokenInputTokenRemove {
  readonly #id = inject(TokenId)

  constructor() {
    usePart(inject(TokenInputScope).handle, "token-remove", () => ({
      id: this.#id,
      token: this.#id,
    }))
  }
}

/**
 * The template for each token's content. Put it next to the editor, inside the token input: `<span *uiTokenInputTokenDef="let token" uiTokenInputToken>{{ token.label }}</span>`. Without one, a token shows its label.
 * @experimental
 */
@Directive({ selector: "[uiTokenInputTokenDef]" })
class TokenInputTokenDef {
  constructor() {
    const scope = inject(TokenInputScope)
    const template = inject<TemplateRef<{ $implicit: Token }>>(TemplateRef)
    const container = inject(ViewContainerRef)
    const parent = inject(Injector)
    const store = useStore(scope.handle)
    const mounted = new Map<
      string,
      {
        host: Element
        token: WritableSignal<Token>
        view: EmbeddedViewRef<unknown>
      }
    >()
    scope.custom.set(true)
    inject(DestroyRef).onDestroy(() => scope.custom.set(false))
    // Core keeps a host in the editor for each token. Each gets a view of
    // the template, moved into it, which leaves when its host does.
    const sync = () => {
      const seen = new Set<string>()
      for (const { id, token, host } of scope.handle.api.internal.hosts()) {
        seen.add(id)
        const entry = mounted.get(id)
        if (entry?.host === host) {
          entry.token.set(token)
          continue
        }
        entry?.view.destroy()
        const current = signal(token)
        const view = container.createEmbeddedView(
          template,
          {
            get $implicit() {
              return current()
            },
          },
          {
            injector: Injector.create({
              providers: [{ provide: TokenId, useValue: id }],
              parent,
            }),
          }
        )
        view.rootNodes.forEach((node: Node) => host.appendChild(node))
        mounted.set(id, { host, token: current, view })
      }
      for (const [id, entry] of mounted) {
        if (!seen.has(id)) {
          entry.view.destroy()
          mounted.delete(id)
        }
      }
    }
    effect(() => {
      store()
      untracked(sync)
    })
  }

  static ngTemplateContextGuard(
    _directive: TokenInputTokenDef,
    context: unknown
  ): context is { $implicit: Token } {
    return true
  }
}

export {
  createTokenInputController,
  defaultCodec,
  fromText,
  toLabel,
  toText,
} from "@ui-sdk/core/token-input"
export type {
  UndoStackOptions,
  TextEditorAdapter,
  TextRange,
  Token,
  TokenCodec,
  TokenDeletion,
  TokenInputApi,
  TokenInputChangeOptions,
  TokenInputController,
  TokenInputEditorProps,
  TokenInputEditorState,
  TokenInputOptions,
  TokenInputPrimitive,
  TokenInputTokenProps,
  TokenInputTokenState,
  TokenInputValue,
  TokenInputSubmitDetails,
  TokenInputValueChangeDetails,
  TokenInputValueChangeReason,
  TokenInsert,
} from "@ui-sdk/core/token-input"

export {
  TokenInput,
  TokenInputEditor,
  type TokenInputSubmit,
  TokenInputToken,
  TokenInputTokenRemove,
  type TokenInputValueChange,
  TokenInputTokenDef,
}
