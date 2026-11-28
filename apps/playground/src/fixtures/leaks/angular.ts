import { Component } from "@angular/core"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/angular/accordion"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/angular/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@ui-sdk/angular/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/angular/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/angular/hover-card"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/angular/menu"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/angular/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/angular/slider"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/angular/tabs"
import { Toolbar, ToolbarButton } from "@ui-sdk/angular/toolbar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"
import { Tree, TreeItems } from "@ui-sdk/angular/tree"
import { Waterfall } from "@ui-sdk/angular/waterfall"
import {
  exposeLayers,
  leakComponent,
  leakTreeItems,
  leakWaterfallItems,
  perfItems,
} from "../../../../../tests/fixtures/perf"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
    Resizable,
    ResizableHandle,
    ResizablePanel,
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    Tabs,
    TabsIndicator,
    TabsList,
    TabsPanel,
    TabsTab,
    Toolbar,
    ToolbarButton,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    Tree,
    TreeItems,
    Waterfall,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      @if (mounted()) {
        @switch (component) {
          @case ("menu") {
            <ng-container uiMenu>
              <button uiMenuTrigger>Open</button>
              <div *uiMenuContent class="popup">
                @for (item of items; track item.value) {
                  <div uiMenuItem class="item" [value]="item.value">
                    {{ item.label }}
                  </div>
                }
              </div>
            </ng-container>
          }
          @case ("select") {
            <ng-container uiSelect [defaultValue]="items[0].value">
              <button uiSelectTrigger aria-label="Open" class="trigger">
                <span uiSelectValue></span>
              </button>
              <div *uiSelectContent class="popup list-popup">
                @for (item of items; track item.value) {
                  <div
                    uiSelectItem
                    class="item"
                    [value]="item.value"
                    [label]="item.label"
                  >
                    {{ item.label }}
                  </div>
                }
              </div>
            </ng-container>
          }
          @case ("combobox") {
            <ng-container uiCombobox>
              <input uiComboboxInput aria-label="Open" class="input" />
              <div *uiComboboxContent class="popup list-popup">
                <div uiComboboxList>
                  @for (item of items; track item.value) {
                    <div
                      uiComboboxItem
                      class="item"
                      [value]="item.value"
                      [label]="item.label"
                    >
                      {{ item.label }}
                    </div>
                  }
                </div>
              </div>
            </ng-container>
          }
          @case ("autocomplete") {
            <ng-container uiAutocomplete>
              <input uiAutocompleteInput aria-label="Open" class="input" />
              <div *uiAutocompleteContent class="popup list-popup">
                <div uiAutocompleteList>
                  @for (item of items; track item.value) {
                    <div uiAutocompleteItem class="item" [value]="item.label">
                      {{ item.label }}
                    </div>
                  }
                </div>
              </div>
            </ng-container>
          }
          @case ("popover") {
            <ng-container uiPopover>
              <button uiPopoverTrigger>Open</button>
              <div *uiPopoverContent class="popup" aria-label="Details">
                Details.
                <button uiPopoverClose>Close</button>
              </div>
            </ng-container>
          }
          @case ("dialog") {
            <ng-container uiDialog>
              <button uiDialogTrigger>Open</button>
              <div *uiDialogContent class="dialog">
                <h2 uiDialogTitle class="title">Delete it?</h2>
                <p uiDialogDescription class="description">
                  This can't be undone.
                </p>
                <button uiDialogClose>Cancel</button>
              </div>
            </ng-container>
          }
          @case ("drawer") {
            <ng-container uiDrawer>
              <button uiDrawerTrigger>Open</button>
              <div *uiDrawerBackdrop class="backdrop"></div>
              <div *uiDrawerContent class="dialog">
                <h2 uiDrawerTitle class="title">Move goal</h2>
                <p uiDrawerDescription class="description">
                  Set your daily goal.
                </p>
                <button uiDrawerClose>Cancel</button>
              </div>
            </ng-container>
          }
          @case ("tooltip") {
            <ng-container uiTooltip>
              <button uiTooltipTrigger>Open</button>
              <div *uiTooltipContent class="tooltip">A hint.</div>
            </ng-container>
          }
          @case ("hover-card") {
            <ng-container uiHoverCard [delay]="0">
              <a uiHoverCardTrigger href="#profile">Open</a>
              <div *uiHoverCardContent class="hover-card-content">
                A profile.
              </div>
            </ng-container>
          }
          @case ("slider") {
            <div uiSlider name="volume" [defaultValue]="50">
              <div uiSliderControl class="slider-control">
                <div uiSliderTrack class="slider-track">
                  <div uiSliderIndicator class="slider-indicator"></div>
                  <div
                    uiSliderThumb
                    class="slider-thumb"
                    aria-label="Volume"
                  ></div>
                </div>
              </div>
            </div>
          }
          @case ("accordion") {
            <div uiAccordion>
              <div uiAccordionItem value="first">
                <h3 uiAccordionHeader>
                  <button uiAccordionTrigger class="accordion-trigger">
                    Open
                  </button>
                </h3>
                <div *uiAccordionPanel class="accordion-panel">An answer.</div>
              </div>
              <div uiAccordionItem value="second">
                <h3 uiAccordionHeader>
                  <button uiAccordionTrigger class="accordion-trigger">
                    Second
                  </button>
                </h3>
                <div *uiAccordionPanel class="accordion-panel">
                  Another answer.
                </div>
              </div>
            </div>
          }
          @case ("collapsible") {
            <div uiCollapsible>
              <button uiCollapsibleTrigger>Open</button>
              <div *uiCollapsiblePanel class="collapsible-panel">Details.</div>
            </div>
          }
          @case ("tabs") {
            <div uiTabs class="tabs" [defaultValue]="items[0].value">
              <div uiTabsList class="tablist" aria-label="Pages">
                @for (item of items; track item.value) {
                  <button uiTabsTab class="tab" [value]="item.value">
                    {{ item.label }}
                  </button>
                }
                <span uiTabsIndicator class="indicator"></span>
              </div>
              @for (item of items; track item.value) {
                <div *uiTabsPanel="item.value" class="panel">
                  {{ item.label }} content.
                </div>
              }
            </div>
          }
          @case ("toolbar") {
            <div uiToolbar class="toolbar" aria-label="Formatting">
              @for (item of items; track item.value) {
                <button uiToolbarButton>{{ item.label }}</button>
              }
            </div>
          }
          @case ("tree") {
            <div uiTree class="tree" aria-label="Files" [items]="treeItems">
              <div uiTreeItems></div>
            </div>
          }
          @case ("waterfall") {
            <div
              uiWaterfall
              class="waterfall"
              aria-label="Trace"
              [items]="waterfallItems"
            ></div>
          }
          @case ("resizable") {
            <div uiResizable class="resizable">
              <div
                uiResizablePanel
                id="first"
                class="resizable-panel"
                [defaultSize]="50"
              ></div>
              <div
                uiResizableHandle
                class="resizable-handle"
                aria-label="Handle"
              ></div>
              <div
                uiResizablePanel
                id="second"
                class="resizable-panel"
                [defaultSize]="50"
              ></div>
            </div>
          }
          @case ("scroll-area") {
            <div uiScrollArea class="scroll-area" [scrollHideDelay]="50">
              <div
                *uiScrollAreaViewport
                class="scroll-area-viewport"
                role="region"
                aria-label="Items"
              >
                <div *uiScrollAreaContent>
                  @for (line of lines; track line.value) {
                    <p class="scroll-area-item">{{ line.label }}</p>
                  }
                </div>
              </div>
              <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
                <div uiScrollAreaThumb class="scroll-area-thumb"></div>
              </div>
            </div>
          }
        }
      }
      <button (click)="mounted.set(!mounted())">Toggle</button>
    </div>
  `,
})
class Fixture {
  readonly component = leakComponent()
  readonly items = perfItems(3)
  readonly lines = perfItems(30)
  readonly treeItems = leakTreeItems()
  readonly waterfallItems = leakWaterfallItems()
  readonly mounted = state(true)
}

function mount(root: HTMLElement) {
  exposeLayers()
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
