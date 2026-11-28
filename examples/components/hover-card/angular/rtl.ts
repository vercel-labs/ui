import { Component } from "@angular/core"
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/angular/hover-card"

@Component({
  imports: [HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger],
  template: `
    <div dir="rtl">
      <ng-container uiHoverCard>
        <a uiHoverCardTrigger href="https://example.com/people/hollis"
          >هوليس غرانت</a
        >
        <div *uiHoverCardContent="{ align: 'start', sideOffset: 10 }">
          <div uiHoverCardArrow></div>
          <p>هوليس غرانت</p>
          <p>مهندس تصميم في فريق المدفوعات.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
