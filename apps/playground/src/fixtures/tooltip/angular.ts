import { Component } from "@angular/core"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import {
  createTooltipController,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"
import {
  tooltipContentOptions,
  tooltipFixture,
  tooltipOptions,
  tooltipParts,
} from "../../../../../tests/fixtures/tooltip"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipShortcut,
    TooltipTrigger,
  ],
  template: `
    <div class="fixture tooltip-page">
      <button>Before</button>
      <ng-container
        uiTooltip
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [toggleable]="options.toggleable"
        [closeOnPress]="options.closeOnPress"
        [type]="options.type"
        [disabled]="options.disabled"
        [container]="options.container"
        [controller]="controller"
        [defaultOpen]="parts.open"
        [shortcut]="f.save.shortcut"
      >
        <button
          uiTooltipTrigger
          [disabled]="parts.nativeDisabled"
          (click)="action.set('save')"
        >
          {{ f.save.trigger }}
        </button>
        <div *uiTooltipContent="content" class="tooltip">
          <div uiTooltipArrow class="arrow"></div>
          {{ f.save.content }}
          <kbd uiTooltipShortcut></kbd>
        </div>
      </ng-container>
      <div class="toolbar" role="group" aria-label="Formatting">
        @for (item of f.toolbar; track item.content) {
          <ng-container
            uiTooltip
            [delay]="options.delay"
            [closeDelay]="options.closeDelay"
            [toggleable]="options.toggleable"
            [closeOnPress]="options.closeOnPress"
            [type]="options.type"
            [disabled]="options.disabled"
            [container]="options.container"
          >
            <button uiTooltipTrigger>
              <span aria-hidden="true">{{ item.icon }}</span>
            </button>
            <div *uiTooltipContent class="tooltip">{{ item.content }}</div>
          </ng-container>
        }
      </div>
      <ng-container uiPopover [container]="options.container">
        <ng-container
          uiTooltip
          [delay]="options.delay"
          [closeDelay]="options.closeDelay"
          [toggleable]="options.toggleable"
          [closeOnPress]="options.closeOnPress"
          [type]="options.type"
          [disabled]="options.disabled"
          [container]="options.container"
        >
          <button uiPopoverTrigger uiTooltipTrigger>
            {{ f.profile.trigger }}
          </button>
          <div *uiTooltipContent class="tooltip">{{ f.profile.content }}</div>
        </ng-container>
        <div *uiPopoverContent="{ sideOffset: 8 }" class="popup">
          <h2 uiPopoverTitle class="title">{{ f.profile.popover }}</h2>
          <div class="actions">
            <ng-container
              uiTooltip
              [delay]="options.delay"
              [closeDelay]="options.closeDelay"
              [toggleable]="options.toggleable"
              [closeOnPress]="options.closeOnPress"
              [type]="options.type"
              [disabled]="options.disabled"
              [container]="options.container"
            >
              <button uiTooltipTrigger>{{ f.profile.help.trigger }}</button>
              <div *uiTooltipContent class="tooltip">
                {{ f.profile.help.content }}
              </div>
            </ng-container>
            <button uiPopoverClose>{{ f.profile.close }}</button>
          </div>
        </div>
      </ng-container>
      <ng-container
        uiTooltip
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        toggleable
        [closeOnPress]="options.closeOnPress"
        [type]="options.type"
        [disabled]="options.disabled"
        [container]="options.container"
      >
        <button uiTooltipTrigger [attr.aria-label]="f.info.trigger">
          <span aria-hidden="true">i</span>
        </button>
        <div *uiTooltipContent class="tooltip">{{ f.info.content }}</div>
      </ng-container>
      @if (parts.disabled) {
        <ng-container
          uiTooltip
          [delay]="options.delay"
          [closeDelay]="options.closeDelay"
          [toggleable]="options.toggleable"
          [closeOnPress]="options.closeOnPress"
          [type]="options.type"
          [disabled]="options.disabled"
          [container]="options.container"
        >
          <button
            uiTooltipTrigger
            aria-disabled="true"
            (click)="publish($event)"
          >
            {{ f.publish.trigger }}
          </button>
          <div *uiTooltipContent class="tooltip">{{ f.publish.content }}</div>
        </ng-container>
      }
      @if (parts.iconPopover) {
        <ng-container uiPopover [container]="options.container">
          <ng-container
            uiTooltip
            [delay]="options.delay"
            [closeDelay]="options.closeDelay"
            [toggleable]="options.toggleable"
            [closeOnPress]="options.closeOnPress"
            [type]="options.type"
            [disabled]="options.disabled"
            [container]="options.container"
          >
            <button uiPopoverTrigger uiTooltipTrigger>
              <span aria-hidden="true">{{ f.iconPopover.icon }}</span>
            </button>
            <div *uiTooltipContent class="tooltip">
              {{ f.iconPopover.content }}
            </div>
          </ng-container>
          <div *uiPopoverContent class="popup">{{ f.iconPopover.popover }}</div>
        </ng-container>
        <ng-container uiPopover [container]="options.container">
          <button uiPopoverTrigger>
            <span aria-hidden="true">{{ f.iconPopover.unnamed }}</span>
          </button>
          <div *uiPopoverContent class="popup">{{ f.iconPopover.popover }}</div>
        </ng-container>
      }
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">Open with controller</button>
      @if (parts.shortcut) {
        <button uiTooltipTrigger [controller]="controller">
          {{ f.shortcut.trigger }} <kbd uiTooltipShortcut></kbd>
        </button>
      }
    </div>
  `,
})
class Fixture {
  readonly f = tooltipFixture
  readonly controller = createTooltipController()
  readonly options: {
    delay: number
    closeDelay?: number
    toggleable?: boolean
    closeOnPress?: boolean
    type?: "label" | "description"
    disabled?: boolean
    container?: HTMLElement | null
  } = tooltipOptions()
  readonly content = tooltipContentOptions()
  readonly parts = tooltipParts()
  readonly action = state("")

  publish(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement
    if (button.getAttribute("aria-disabled") !== "true") {
      this.action.set(this.f.publish.action)
    }
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
