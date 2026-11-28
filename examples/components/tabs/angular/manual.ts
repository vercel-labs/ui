import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/angular/tabs"

@Component({
  imports: [Field, FieldLabel, Input, Tabs, TabsList, TabsPanel, TabsTab],
  template: `
    <div uiTabs defaultValue="preview" activation="manual">
      <div uiTabsList aria-label="Snippet">
        <button uiTabsTab value="preview">Preview</button>
        <button uiTabsTab value="code">Code</button>
      </div>
      <div uiTabsPanel value="preview">
        Welcome back, Hollis. You have 3 unread messages.
      </div>
      <div uiTabsPanel value="code">
        <div uiField>
          <label uiFieldLabel>Source</label>
          <input uiInput [defaultValue]="snippet" />
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly snippet = '<Welcome name="Hollis" unread={3} />'
}

export { Example }
