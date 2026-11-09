import { createTooltipController } from "@ui-sdk/core/tooltip"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "@ui-sdk/react/tooltip"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  tooltipContentOptions,
  tooltipFixture,
  tooltipOptions,
  tooltipParts,
} from "tests/fixtures/tooltip.ts"

const controller = createTooltipController()

const parts = tooltipParts()

function Fixture() {
  const [action, setAction] = React.useState("")
  const options = tooltipOptions()
  const { save, toolbar, profile, info, publish, iconPopover } = tooltipFixture
  return (
    <div className="fixture tooltip-page">
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
        <TooltipContent className="tooltip" {...tooltipContentOptions()}>
          <TooltipArrow className="arrow" />
          {save.content}
          <TooltipShortcut />
        </TooltipContent>
      </Tooltip>
      <div className="toolbar" role="group" aria-label="Formatting">
        {toolbar.map((item) => (
          <Tooltip key={item.content} {...options}>
            <TooltipTrigger>
              <span aria-hidden="true">{item.icon}</span>
            </TooltipTrigger>
            <TooltipContent className="tooltip">{item.content}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <Popover container={options.container}>
        <Tooltip {...options}>
          <TooltipTrigger
            render={<PopoverTrigger>{profile.trigger}</PopoverTrigger>}
          />
          <TooltipContent className="tooltip">{profile.content}</TooltipContent>
        </Tooltip>
        <PopoverContent className="popup" sideOffset={8}>
          <PopoverTitle className="title">{profile.popover}</PopoverTitle>
          <div className="actions">
            <Tooltip {...options}>
              <TooltipTrigger>{profile.help.trigger}</TooltipTrigger>
              <TooltipContent className="tooltip">
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
        <TooltipContent className="tooltip">{info.content}</TooltipContent>
      </Tooltip>
      {parts.disabled && (
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
          <TooltipContent className="tooltip">{publish.content}</TooltipContent>
        </Tooltip>
      )}
      {parts.iconPopover && (
        <>
          <Popover container={options.container}>
            <Tooltip {...options}>
              <TooltipTrigger
                render={
                  <PopoverTrigger>
                    <span aria-hidden="true">{iconPopover.icon}</span>
                  </PopoverTrigger>
                }
              />
              <TooltipContent className="tooltip">
                {iconPopover.content}
              </TooltipContent>
            </Tooltip>
            <PopoverContent className="popup">
              {iconPopover.popover}
            </PopoverContent>
          </Popover>
          <Popover container={options.container}>
            <PopoverTrigger>
              <span aria-hidden="true">{iconPopover.unnamed}</span>
            </PopoverTrigger>
            <PopoverContent className="popup">
              {iconPopover.popover}
            </PopoverContent>
          </Popover>
        </>
      )}
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.open()}>Open with controller</button>
      {parts.shortcut && (
        <TooltipTrigger controller={controller}>
          {tooltipFixture.shortcut.trigger} <TooltipShortcut />
        </TooltipTrigger>
      )}
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
