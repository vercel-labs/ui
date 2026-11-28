import { Component } from "@angular/core"
import {
  createMenuController,
  Menu,
  type MenuAction,
  MenuCheckboxItem,
  type MenuCheckedChange,
  MenuContent,
  MenuContextTrigger,
  type MenuDataItem,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
  type MenuValueChange,
} from "@ui-sdk/angular/menu"
import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverTitle,
} from "@ui-sdk/angular/popover"
import {
  createTabsController,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/angular/tabs"
import {
  alignmentFixture,
  alignmentOptions,
} from "../../../../../tests/fixtures/alignment"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuContextTrigger,
    MenuItem,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuTrigger,
    Popover,
    PopoverContent,
    PopoverTitle,
    Tabs,
    TabsList,
    TabsPanel,
    TabsTab,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>

      <ul class="rows">
        @for (row of f.rows; track row) {
          <li>
            Row {{ row }}
            <button
              uiMenuTrigger
              [controller]="rowMenu"
              [payload]="row"
              [attr.aria-label]="'Actions for ' + row"
            >
              …
            </button>
          </li>
        }
      </ul>
      <ng-container
        uiMenu
        [controller]="rowMenu"
        (action)="onRowAction($event)"
        (openChangeComplete)="complete.set($event ? 'open' : 'closed')"
      >
        <div
          *uiMenuContent="{ keepMounted: options.keepMounted }; let menu"
          class="popup"
        >
          <div class="payload" [textContent]="'Row ' + menu.payload"></div>
          @for (item of f.rowActions; track item.value) {
            <div
              uiMenuItem
              class="item"
              [value]="item.value"
              (select)="onSelect(item.value)"
            >
              {{ item.label }}
            </div>
          }
        </div>
      </ng-container>

      <ng-container uiPopover modal="trap-focus" [controller]="details">
        <div *uiPopoverContent="let popover" class="popup">
          <form method="dialog">
            <h2 uiPopoverTitle class="title">Details</h2>
            <p
              class="payload"
              [textContent]="'Details for ' + popover.payload"
            ></p>
            <button value="save">Save</button>
            <button value="cancel">Cancel</button>
          </form>
        </div>
      </ng-container>
      <button (click)="showDetails('button')">Show details</button>

      <ng-container uiMenu (action)="action.set($event.value)">
        <div uiMenuContextTrigger class="canvas">Canvas</div>
        <div *uiMenuContent class="popup">
          @for (item of f.canvasActions; track item.value) {
            <div uiMenuItem class="item" [value]="item.value">
              {{ item.label }}
            </div>
          }
        </div>
      </ng-container>

      <ng-container
        uiMenu
        [items]="dataItems"
        (checkedChange)="onCheckedChange($event)"
        (valueChange)="onValueChange($event)"
      >
        <button uiMenuTrigger>Data</button>
        <div *uiMenuContent class="popup">
          @for (entry of dataItems; track $index) {
            @if (entry.type === "checkbox") {
              <div uiMenuCheckboxItem class="item" [value]="entry.value">
                <span *uiMenuItemIndicator class="indicator">✓</span>
                {{ entry.label }}
              </div>
            } @else if (entry.type === "radio-group") {
              <div uiMenuRadioGroup [name]="entry.name">
                @for (radio of entry.items; track radio.value) {
                  <div uiMenuRadioItem class="item" [value]="radio.value">
                    <span *uiMenuItemIndicator class="indicator">•</span>
                    {{ radio.label }}
                  </div>
                }
              </div>
            }
          }
        </div>
      </ng-container>

      <ng-container uiMenu>
        <button uiMenuTrigger>View</button>
        <div *uiMenuContent class="popup">
          @for (value of ["ruler", "guides"]; track value) {
            <div uiMenuCheckboxItem class="item" [value]="value">
              <span *uiMenuItemIndicator class="indicator">✓</span>
              {{ value === "ruler" ? "Ruler" : "Guides" }}
            </div>
          }
        </div>
      </ng-container>

      <div
        uiTabs
        class="tabs"
        hiddenUntilFound
        [controller]="sections"
        (valueChange)="tabChanges.set(tabChanges() + 1)"
      >
        <div uiTabsList class="tablist scrolling" aria-label="Sections">
          @for (section of f.sections; track section) {
            <button uiTabsTab class="tab" [value]="section.toLowerCase()">
              {{ section }}
            </button>
          }
        </div>
        @for (section of f.sections; track section) {
          <div uiTabsPanel class="panel" [value]="section.toLowerCase()">
            The {{ section }} section
          </div>
        }
      </div>
      <button (click)="sections.select('hotel')">Show the last section</button>

      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last result">{{ result() }}</output>
      <output aria-label="Last complete">{{ complete() }}</output>
      <output aria-label="Last change">{{ change() }}</output>
      <output aria-label="Tab changes">{{ tabChanges() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = alignmentFixture
  readonly options = alignmentOptions()
  readonly rowMenu = createMenuController<string>()
  readonly details = createPopoverController<string>()
  readonly sections = createTabsController()
  readonly dataItems: MenuDataItem[] = [
    { type: "checkbox", value: "grid", label: "Grid" },
    {
      type: "radio-group",
      name: "sort",
      items: [
        { value: "name", label: "Name" },
        { value: "date", label: "Date" },
      ],
    },
  ]
  readonly action = state("")
  readonly result = state("")
  readonly complete = state("")
  readonly change = state("")
  readonly tabChanges = state(0)

  showDetails(payload: string) {
    this.details
      .open({ payload })
      .then((closed) =>
        this.result.set(`${closed.reason}:${closed.returnValue ?? ""}`)
      )
  }

  onRowAction(action: MenuAction) {
    this.action.set(`${action.value}:${this.rowMenu.getPayload()}`)
  }

  onSelect(value: string) {
    if (value === "details") {
      this.showDetails(String(this.rowMenu.getPayload()))
    }
  }

  onCheckedChange(change: MenuCheckedChange) {
    this.change.set(`checked:${change.value}:${change.checked}`)
  }

  onValueChange(change: MenuValueChange) {
    this.change.set(`value:${change.group}:${change.value}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
