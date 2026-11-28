import { Component } from "@angular/core"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaViewport,
} from "@ui-sdk/angular/scroll-area"

@Component({
  imports: [ScrollArea, ScrollAreaContent, ScrollAreaViewport],
  template: `
    <div uiScrollArea>
      <div *uiScrollAreaViewport role="region" aria-label="Inbox">
        <div *uiScrollAreaContent>
          <ul>
            @for (message of messages; track message.subject) {
              <li>
                {{ message.from }}
                <span data-slot="hint">{{ message.subject }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly messages = [
    { from: "Hollis Grant", subject: "Launch checklist for Thursday" },
    { from: "Inès Moreau", subject: "Updated pricing page copy" },
    { from: "Kofi Mensah", subject: "Design review notes" },
    { from: "Wren Takahashi", subject: "Q4 roadmap draft" },
    { from: "Tomasz Wójcik", subject: "Re: Staging deploy failed" },
    { from: "Hollis Grant", subject: "Invoices for October" },
    { from: "Inès Moreau", subject: "Customer interview recordings" },
    { from: "Kofi Mensah", subject: "New icons for the dashboard" },
    { from: "Wren Takahashi", subject: "Offsite agenda" },
    { from: "Tomasz Wójcik", subject: "Database migration plan" },
  ]
}

export { Example }
