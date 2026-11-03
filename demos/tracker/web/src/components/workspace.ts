import { cn } from "cn"
import { html, nothing, type TemplateResult } from "lit-html"

function workspace(list: TemplateResult, detail: unknown) {
  return html`<ui-resizable auto-save-id="tracker" class="flex min-h-0 flex-1">
    <ui-resizable-panel
      id="list"
      default-size=${detail ? 58 : 100}
      min-size="30"
      class=${cn("flex min-w-0 flex-col", Boolean(detail) && "max-md:hidden")}
    >
      ${list}
    </ui-resizable-panel>
    ${
      detail
        ? html`<ui-resizable-handle
              aria-label="Resize issue details"
              class="relative flex w-px items-center justify-center bg-border outline-none after:absolute after:inset-y-0 after:-inset-x-1 focus-visible:ring-3 focus-visible:ring-ring/30 data-dragging:bg-ring data-hovering:bg-ring max-md:hidden"
            >
              <div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div>
            </ui-resizable-handle>
            <ui-resizable-panel
              id="detail"
              default-size="42"
              min-size="28"
              class="flex min-w-0 flex-col max-md:flex-1!"
            >
              ${detail}
            </ui-resizable-panel>`
        : nothing
    }
  </ui-resizable>`
}

export { workspace }
