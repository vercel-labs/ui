import { Component } from "@angular/core"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ui-sdk/angular/field"
import {
  Input,
  InputClear,
  InputGroup,
  type InputValueChange,
} from "@ui-sdk/angular/input"
import { Textarea } from "@ui-sdk/angular/textarea"
import {
  type FormErrors,
  formFixture,
  formOptions,
  invalidOf,
  messageOf,
  save,
  serializeData,
  without,
} from "../../../../../tests/fixtures/form"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldLegend,
    FieldSet,
    Input,
    InputClear,
    InputGroup,
    Textarea,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
        (reset)="errors.set(undefined)"
      >
        <fieldset
          uiFieldSet
          class="form"
          [disabled]="options.disabled || undefined"
        >
          <legend uiFieldLegend>{{ f.profile.legend }}</legend>
          <p uiFieldDescription>{{ f.profile.description }}</p>
          <div
            uiField
            [name]="f.username.name"
            [invalid]="invalid(f.username.name)"
          >
            <label uiFieldLabel class="label">{{ f.username.label }}</label>
            <input
              uiInput
              class="input"
              required
              minlength="3"
              [value]="options.controlled ? username() : undefined"
              (beforeValueChange)="onUsernameChange($event)"
            />
            <p uiFieldDescription>{{ f.username.description }}</p>
            <div *uiFieldError="let error" class="field-error">
              {{ message(f.username.name) || error.message }}
            </div>
          </div>
          <div uiField [name]="f.bio.name" [invalid]="invalid(f.bio.name)">
            <label uiFieldLabel class="label">{{ f.bio.label }}</label>
            <textarea
              uiTextarea
              class="textarea"
              autoResize
              [submitShortcut]="options.submitShortcut"
            ></textarea>
            <p uiFieldDescription>{{ f.bio.description }}</p>
            <div *uiFieldError="let error" class="field-error">
              {{ message(f.bio.name) || error.message }}
            </div>
          </div>
        </fieldset>
        <fieldset
          uiFieldSet
          class="form"
          [disabled]="contactDisabled() || undefined"
        >
          <legend uiFieldLegend>{{ f.contact.legend }}</legend>
          <div uiField [name]="f.email.name" [invalid]="invalid(f.email.name)">
            <label uiFieldLabel class="label">{{ f.email.label }}</label>
            <input
              uiInput
              class="input"
              type="email"
              [defaultValue]="f.email.defaultValue"
              (valueChange)="clear(f.email.name)"
            />
            <div *uiFieldError="let error" class="field-error">
              {{ message(f.email.name) || error.message }}
            </div>
          </div>
          <div uiField [name]="f.website.name">
            <label uiFieldLabel class="label">{{ f.website.label }}</label>
            <div uiInputGroup class="input-group">
              <span>{{ f.website.prefix }}</span>
              <input
                uiInput
                class="input"
                (beforeValueChange)="onWebsiteChange($event)"
              />
              <button uiInputClear [attr.aria-label]="f.website.clear">
                ×
              </button>
            </div>
          </div>
        </fieldset>
        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button type="button" (click)="contactDisabled.set(!contactDisabled())">
        Toggle contact
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = formFixture
  readonly options = formOptions()
  readonly errors = state<FormErrors | undefined>(this.options.errors)
  readonly action = state("")
  readonly submitted = state("")
  readonly username = state("")
  readonly contactDisabled = state(false)
  #pending = false

  message(name: string) {
    return messageOf(this.errors(), name)
  }

  invalid(name: string) {
    return invalidOf(this.errors(), name)
  }

  clear(name: string) {
    this.errors.set(without(this.errors(), name))
  }

  onUsernameChange(change: InputValueChange) {
    const { name } = formFixture.username
    if (this.options.noDigits && /\d/.test(change.value)) {
      return change.cancel()
    }
    this.action.set(`${name}:${change.value}:${change.reason}`)
    this.username.set(change.value)
    this.clear(name)
  }

  onWebsiteChange(change: InputValueChange) {
    this.action.set(
      `${formFixture.website.name}:${change.value}:${change.reason}`
    )
  }

  async onSubmit(event: SubmitEvent) {
    event.preventDefault()
    if (this.#pending) {
      return
    }
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.#pending = true
    try {
      const result = await save(data, this.options.action)
      this.errors.set(result)
      if (!result) {
        this.submitted.set(serializeData(data))
      }
    } catch {
      // The fake server failed. The page keeps what it showed.
    } finally {
      this.#pending = false
    }
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
