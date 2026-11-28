import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { Button } from "@ui-sdk/angular/button"

@Component({
  imports: [Button, LucideChevronRight],
  template: `
    <div data-slot="row" dir="rtl">
      <button uiButton>
        متابعة
        <svg lucideChevronRight></svg>
      </button>
      <button uiButton>إلغاء</button>
    </div>
  `,
})
class Example {}

export { Example }
