import { Component, signal } from "@angular/core"
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/angular/accordion"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@ui-sdk/angular/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/angular/tabs"

type Plan = "free" | "pro"

@Component({
  selector: "app-root",
  imports: [
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldLabel,
    Input,
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationList,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsList,
    TabsPanel,
    TabsTab,
  ],
  template: `
    <div uiTabs [value]="plan()" (valueChange)="plan.set($event)">
      <div uiTabsList aria-label="Plans">
        <button uiTabsTab value="free">Free</button>
        <button uiTabsTab value="pro">Pro</button>
      </div>
      <div *uiTabsPanel="'free'; let panel">{{ panel.selected }}</div>
      <div uiTabsPanel value="pro">Pro</div>
    </div>

    <div uiAccordion [(value)]="open">
      <div uiAccordionItem value="free">
        <button uiAccordionTrigger>Free</button>
        <div *uiAccordionPanel="let panel">{{ panel.open }}</div>
      </div>
    </div>

    <ng-container uiDialog [(open)]="shown">
      <button uiDialogTrigger>Open</button>
      <div *uiDialogContent="let dialog">
        <h2 uiDialogTitle>Title {{ dialog.open }}</h2>
        <button uiDialogClose>Close</button>
      </div>
    </ng-container>

    <div uiField name="plan">
      <label uiFieldLabel>Plan</label>
      <input uiInput />
    </div>

    <ng-container uiSelect [(value)]="plan">
      <button uiSelectTrigger><span uiSelectValue></span></button>
      <div *uiSelectContent>
        <div uiSelectItem value="free">Free</div>
        <div uiSelectItem value="pro">Pro</div>
      </div>
    </ng-container>

    <nav uiPagination [(page)]="page" [pageCount]="3" [getHref]="href">
      <ul uiPaginationList #list="uiPaginationList">
        @for (item of list.state().items; track item) {
          @if (item !== "ellipsis-start" && item !== "ellipsis-end") {
            <li uiPaginationItem><a uiPaginationLink [page]="item"></a></li>
          }
        }
      </ul>
    </nav>
  `,
})
class App {
  readonly plan = signal<Plan | null>("free")
  readonly open = signal<Plan[]>([])
  readonly shown = signal(false)
  readonly page = signal(1)
  readonly href = (page: number) => `?page=${page}`
}

export { App }
