import { Component } from "@angular/core"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/angular/command"

@Component({
  imports: [Command, CommandEmpty, CommandInput, CommandItem, CommandList],
  template: `
    <div dir="rtl" data-slot="stack">
      <div uiCommand>
        <input uiCommandInput aria-label="ابحث عن أمر" placeholder="ابحث…" />
        <div uiCommandEmpty>لا توجد نتائج.</div>
        <div uiCommandList>
          @for (item of commands; track item.value) {
            <div uiCommandItem [value]="item.value" [label]="item.label">
              {{ item.label }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly commands = [
    { value: "calendar", label: "التقويم" },
    { value: "search", label: "البحث" },
    { value: "settings", label: "الإعدادات" },
    { value: "profile", label: "الملف الشخصي" },
  ]
}

export { Example }
