import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/field"
import { Check, createElement } from "lucide"

const options = [
  { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
  { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-full max-w-md flex-col gap-3">
      ${options
        .map(
          (option) => `
            <ui-field-label as-child>
              <label class="cursor-pointer rounded-2xl border border-border p-4 transition-colors hover:bg-input/40 has-data-checked:bg-input/30">
                <ui-field class="flex flex-row items-start gap-3">
                  <ui-checkbox class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-input/90 outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:opacity-50" name="${option.name}">
                    <ui-checkbox-indicator class="grid place-content-center">
                      ${createElement(Check, { class: "size-3.5", "aria-hidden": "true" }).outerHTML}
                    </ui-checkbox-indicator>
                  </ui-checkbox>
                  <span class="flex flex-col gap-1">
                    <span class="text-sm leading-snug font-medium">${option.title}</span>
                    <ui-field-description class="text-sm text-muted-foreground">${option.description}</ui-field-description>
                  </span>
                </ui-field>
              </label>
            </ui-field-label>`,
        )
        .join("")}
    </div>
  `
}
