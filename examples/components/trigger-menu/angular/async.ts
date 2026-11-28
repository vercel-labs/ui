import { Component } from "@angular/core"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuEmpty,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
    TriggerMenuStatus,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [triggers]="[{ char: '#', type: 'channel', items: searchChannels }]"
    >
      <div uiField>
        <label uiFieldLabel>Message</label>
        <textarea
          uiTriggerMenuInput
          uiFieldControl
          placeholder="Type # to link a channel…"
        ></textarea>
      </div>
      <div *uiTriggerMenuContent>
        <div uiTriggerMenuStatus #triggerMenuStatus="uiTriggerMenuStatus">
          {{
            triggerMenuStatus.state().loading
              ? "Loading channels…"
              : triggerMenuStatus.state().count
                ? triggerMenuStatus.state().count +
                  " " +
                  (triggerMenuStatus.state().count === 1
                    ? "channel"
                    : "channels")
                : ""
          }}
        </div>
        <div uiTriggerMenuEmpty #triggerMenuEmpty="uiTriggerMenuEmpty">
          @if (
            triggerMenuEmpty.state().empty && !triggerMenuEmpty.state().loading
          ) {
            No channels match “{{ triggerMenuEmpty.state().query }}”
          }
        </div>
        <div uiTriggerMenuList #triggerMenuList="uiTriggerMenuList">
          @for (
            item of itemsOf(triggerMenuList.state().items);
            track item.value
          ) {
            <div uiTriggerMenuItem [value]="item.value" [label]="item.label">
              {{ item.label }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly channels = [
    "announcements",
    "design",
    "design-reviews",
    "engineering",
    "general",
    "launches",
    "support",
  ]

  readonly searchChannels = (
    query: string,
    { signal }: { signal: AbortSignal }
  ) =>
    new Promise<{ value: string; label: string }[]>((resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve(
            this.channels
              .filter((channel) => channel.includes(query.toLowerCase()))
              .map((channel) => ({ value: channel, label: channel }))
          ),
        600
      )
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(signal.reason)
      })
    })

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
