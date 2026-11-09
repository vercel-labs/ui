import { createTooltipController } from "@ui-sdk/core/tooltip"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "@ui-sdk/solid/tooltip"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  tooltipContentOptions,
  tooltipFixture,
  tooltipOptions,
  tooltipParts,
} from "tests/fixtures/tooltip.ts"

const controller = createTooltipController()

function Fixture() {
  // Read here, not at module level, so the server reads each request's URL.
  const parts = tooltipParts()
  const options = tooltipOptions()
  const [action, setAction] = createSignal("")
  const { save, toolbar, profile, info, publish, iconPopover } = tooltipFixture
  return (
    <div class="fixture tooltip-page">
      <button>Before</button>
      <Tooltip
        {...options}
        controller={controller}
        defaultOpen={parts.open}
        shortcut={save.shortcut}
      >
        <TooltipTrigger
          disabled={parts.nativeDisabled}
          onClick={() => setAction("save")}
        >
          {save.trigger}
        </TooltipTrigger>
        <TooltipContent class="tooltip" {...tooltipContentOptions()}>
          <TooltipArrow class="arrow" />
          {save.content}
          <TooltipShortcut />
        </TooltipContent>
      </Tooltip>
      <div class="toolbar" role="group" aria-label="Formatting">
        <For each={toolbar}>
          {(item) => (
            <Tooltip {...options}>
              <TooltipTrigger>
                <span aria-hidden="true">{item.icon}</span>
              </TooltipTrigger>
              <TooltipContent class="tooltip">{item.content}</TooltipContent>
            </Tooltip>
          )}
        </For>
      </div>
      <Popover container={options.container}>
        <Tooltip {...options}>
          <TooltipTrigger
            render={(props) => (
              <PopoverTrigger {...props}>{profile.trigger}</PopoverTrigger>
            )}
          />
          <TooltipContent class="tooltip">{profile.content}</TooltipContent>
        </Tooltip>
        <PopoverContent class="popup" sideOffset={8}>
          <PopoverTitle class="title">{profile.popover}</PopoverTitle>
          <div class="actions">
            <Tooltip {...options}>
              <TooltipTrigger>{profile.help.trigger}</TooltipTrigger>
              <TooltipContent class="tooltip">
                {profile.help.content}
              </TooltipContent>
            </Tooltip>
            <PopoverClose>{profile.close}</PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip {...options} toggleable>
        <TooltipTrigger aria-label={info.trigger}>
          <span aria-hidden="true">i</span>
        </TooltipTrigger>
        <TooltipContent class="tooltip">{info.content}</TooltipContent>
      </Tooltip>
      <Show when={parts.disabled}>
        <Tooltip {...options}>
          <TooltipTrigger
            aria-disabled="true"
            onClick={(event) =>
              event.currentTarget.getAttribute("aria-disabled") !== "true" &&
              setAction(publish.action)
            }
          >
            {publish.trigger}
          </TooltipTrigger>
          <TooltipContent class="tooltip">{publish.content}</TooltipContent>
        </Tooltip>
      </Show>
      <Show when={parts.iconPopover}>
        <Popover container={options.container}>
          <Tooltip {...options}>
            <TooltipTrigger
              render={(props) => (
                <PopoverTrigger {...props}>
                  <span aria-hidden="true">{iconPopover.icon}</span>
                </PopoverTrigger>
              )}
            />
            <TooltipContent class="tooltip">
              {iconPopover.content}
            </TooltipContent>
          </Tooltip>
          <PopoverContent class="popup">{iconPopover.popover}</PopoverContent>
        </Popover>
        <Popover container={options.container}>
          <PopoverTrigger>
            <span aria-hidden="true">{iconPopover.unnamed}</span>
          </PopoverTrigger>
          <PopoverContent class="popup">{iconPopover.popover}</PopoverContent>
        </Popover>
      </Show>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.open()}>Open with controller</button>
      <Show when={parts.shortcut}>
        <TooltipTrigger controller={controller}>
          {tooltipFixture.shortcut.trigger} <TooltipShortcut />
        </TooltipTrigger>
      </Show>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
