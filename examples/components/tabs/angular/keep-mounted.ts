import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/angular/tabs"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [
    Field,
    FieldLabel,
    Tabs,
    TabsIndicator,
    TabsList,
    TabsPanel,
    TabsTab,
    Textarea,
  ],
  template: `
    <div uiTabs defaultValue="reply">
      <div uiTabsList aria-label="Comment">
        <button uiTabsTab value="reply">Reply</button>
        <button uiTabsTab value="formatting">Formatting</button>
        <span uiTabsIndicator></span>
      </div>
      <div uiTabsPanel value="reply">
        <div uiField>
          <label uiFieldLabel>Message</label>
          <textarea
            uiTextarea
            [rows]="3"
            placeholder="Write a reply…"
          ></textarea>
        </div>
      </div>
      <div uiTabsPanel value="formatting">
        <p>Use **bold**, _italics_ and \`code\` to format your reply.</p>
        <p>Paste a link on its own line to show a preview.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
