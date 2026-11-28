import { Component } from "@angular/core"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOutlet,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/angular/drawer"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerOutlet,
    DrawerTitle,
    DrawerTrigger,
    Field,
    FieldLabel,
    Input,
    Textarea,
  ],
  template: `
    <ng-container uiDrawer>
      <div>
        <div
          uiDrawerOutlet
          [keyframes]="{ scale: [1, 0.94], borderRadius: ['0px', '24px'] }"
        >
          <div data-slot="row">
            <span>Inbox</span>
            <button uiDrawerTrigger data-variant="solid">Compose</button>
          </div>
          <ul data-slot="list">
            @for (message of messages; track message.from) {
              <li>
                <div>{{ message.from }}</div>
                <div data-slot="hint">{{ message.text }}</div>
              </li>
            }
          </ul>
        </div>
      </div>
      <div *uiDrawerBackdrop></div>
      <div *uiDrawerContent>
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <h2 uiDrawerTitle>New message</h2>
          <p uiDrawerDescription>Write a quick note to the team.</p>
        </div>
        <div uiField>
          <label uiFieldLabel>To</label>
          <input uiInput defaultValue="Design team" />
        </div>
        <div uiField>
          <label uiFieldLabel>Message</label>
          <textarea uiTextarea placeholder="What's new?"></textarea>
        </div>
        <div data-slot="stack">
          <button uiDrawerClose data-variant="solid" value="send">Send</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly messages = [
    { from: "Inès", text: "The proofs are back from the printer." },
    { from: "Kofi", text: "Lunch on Thursday?" },
    { from: "Wren", text: "Pushed the fix for the release build." },
    { from: "Tomasz", text: "Can you review the launch checklist?" },
  ]
}

export { Example }
