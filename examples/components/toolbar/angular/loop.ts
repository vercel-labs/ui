import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Toolbar, ToolbarButton } from "@ui-sdk/angular/toolbar"

@Component({
  imports: [Toolbar, ToolbarButton],
  template: `
    <div uiToolbar [loop]="false" aria-label="Pages">
      @for (label of ["First", "Previous", "Next", "Last"]; track label) {
        <button uiToolbarButton (click)="log(\`\${label} page\`)">
          {{ label }}
        </button>
      }
    </div>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
