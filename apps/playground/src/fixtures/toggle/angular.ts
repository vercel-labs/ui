import { Component } from "@angular/core"
import { Button, type ButtonAction } from "@ui-sdk/angular/button"
import { Separator } from "@ui-sdk/angular/separator"
import {
  createToggleGroupController,
  Toggle,
  ToggleGroup,
  type ToggleGroupValueChange,
  type TogglePressedChange,
} from "@ui-sdk/angular/toggle"
import { changedValue, toggleOptions } from "../../../../../tests/fixtures/page"
import {
  toggleAction,
  toggleFixture,
} from "../../../../../tests/fixtures/toggle"
import { mountAngular, state } from "../../angular-mount"

// A Promise and the buttons that settle it.
function gate() {
  let settle:
    { resolve: () => void; reject: (reason: Error) => void } | undefined
  return {
    wait: () =>
      new Promise<void>((resolve, reject) => (settle = { resolve, reject })),
    resolve: () => settle?.resolve(),
    reject: () => settle?.reject(new Error("Offline")),
  }
}

@Component({
  imports: [Button, Separator, Toggle, ToggleGroup],
  template: `
    <div class="fixture">
      <button>Before</button>
      <button
        uiToggle
        class="toggle"
        [defaultPressed]="options.defaultPressed"
        (beforePressedChange)="onPressedChange($event)"
      >
        {{ fixture.toggle.label }}
      </button>
      @for (group of groups; track group.name; let index = $index) {
        @if (index === 1) {
          <div uiSeparator class="rule" orientation="vertical"></div>
        }
        <div
          uiToggleGroup
          class="toggle-group"
          [attr.aria-label]="group.label"
          [defaultValue]="values[group.name]"
          [orientation]="options.orientation"
          [deselectable]="options.deselectable"
          [loop]="options.loop"
          [multiple]="group.multiple"
          [disabled]="group.disabled"
          [controller]="group.controller"
          (beforeValueChange)="onValueChange(group.name, $event)"
        >
          @for (item of group.items; track item.value) {
            <button
              uiToggle
              class="toggle"
              [value]="item.value"
              [disabled]="item.disabled"
            >
              {{ item.label }}
            </button>
          }
        </div>
      }
      <form [attr.aria-label]="fixture.form.label" (submit)="onSubmit($event)">
        <label>
          {{ fixture.form.field }}
          <input name="name" [defaultValue]="fixture.form.defaultName" />
        </label>
        <button
          uiButton
          class="button"
          type="submit"
          (action)="$event.waitUntil(saving.wait())"
        >
          Submit
        </button>
        <button uiButton class="button" type="reset">Reset</button>
        <button
          uiButton
          class="button"
          disabled
          (action)="action.set('delete')"
        >
          Delete
        </button>
        <button
          uiButton
          class="button"
          type="submit"
          disabled
          focusableWhenDisabled
          (action)="action.set('archive')"
        >
          Archive
        </button>
      </form>
      <button uiButton class="button" (action)="save($event)">Save</button>
      <button uiButton class="button" (action)="$event.waitUntil(publish())">
        Publish
      </button>
      <button (click)="formatting.setValue([])">Clear formatting</button>
      <button (click)="saving.resolve()">Finish saving</button>
      <button (click)="publishing.resolve()">Finish publishing</button>
      <button (click)="publishing.reject()">Fail publishing</button>
      <a uiButton class="button" [href]="fixture.docs.href">{{
        fixture.docs.label
      }}</a>
      <a uiButton class="button" [href]="fixture.changelog.href" disabled>{{
        fixture.changelog.label
      }}</a>
      <div uiSeparator class="rule"></div>
      <div uiSeparator class="rule" decorative></div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submissions">{{ submissions() }}</output>
      <output aria-label="Pressed with">{{ pressedWith() }}</output>
    </div>
  `,
})
class Fixture {
  readonly fixture = toggleFixture
  readonly options = toggleOptions()
  readonly formatting = createToggleGroupController()
  readonly saving = gate()
  readonly publishing = gate()
  readonly action = state("")
  readonly pressedWith = state("")
  readonly submissions = state(0)

  // Each group's value, to tell which toggle a change touches.
  readonly values: Record<string, string[]> = {
    alignment: this.options.alignment
      ? [this.options.alignment]
      : toggleFixture.alignment.defaultValue,
    formatting: toggleFixture.formatting.defaultValue,
  }

  readonly groups = [
    {
      ...toggleFixture.alignment,
      multiple: false,
      disabled: false,
      controller: undefined,
    },
    {
      ...toggleFixture.formatting,
      multiple: true,
      disabled: this.options.disabled,
      controller: this.formatting,
    },
  ]

  onValueChange(name: string, change: ToggleGroupValueChange) {
    const { cancel } = this.options
    if (cancel && changedValue(this.values[name], change.value) === cancel) {
      return change.cancel()
    }
    this.values[name] = change.value
    this.action.set(toggleAction.group(name, change.value))
  }

  onPressedChange(change: TogglePressedChange) {
    if (this.options.cancel === toggleFixture.toggle.value) {
      return change.cancel()
    }
    this.action.set(toggleAction.toggle(change.value))
  }

  save({ source }: ButtonAction) {
    this.action.set("save")
    this.pressedWith.set(source)
  }

  async publish() {
    this.action.set("publishing")
    await this.publishing.wait()
    this.action.set("published")
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submissions.update((count) => count + 1)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
