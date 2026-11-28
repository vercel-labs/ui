import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/angular/accordion"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
    Field,
    FieldLabel,
    Textarea,
    LucideChevronDown,
  ],
  template: `
    <div uiAccordion [defaultValue]="['reply']">
      <div uiAccordionItem value="reply">
        <h3 uiAccordionHeader>
          <button uiAccordionTrigger>
            Reply to this thread
            <svg lucideChevronDown></svg>
          </button>
        </h3>
        <div uiAccordionPanel keepMounted>
          <div uiField>
            <label uiFieldLabel>Message</label>
            <textarea
              uiTextarea
              [rows]="3"
              placeholder="Write a reply…"
            ></textarea>
          </div>
        </div>
      </div>
      <div uiAccordionItem value="formatting">
        <h3 uiAccordionHeader>
          <button uiAccordionTrigger>
            Formatting
            <svg lucideChevronDown></svg>
          </button>
        </h3>
        <div uiAccordionPanel>
          <p>Use **bold**, _italics_ and \`code\`. Links paste as previews.</p>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
