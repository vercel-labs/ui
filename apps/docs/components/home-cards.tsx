import { cn } from "cn"
import {
  AccordionIsland,
  CalendarIsland,
  ColorIsland,
  CommandIsland,
  NumberInputIsland,
  OTPIsland,
  RatingIsland,
  ResizableIsland,
  SegmentedIsland,
  SliderIsland,
  SwitchIsland,
  TabsIsland,
  TokenInputIsland,
  ToolbarIsland,
  TreeIsland,
} from "./home-islands"
import { grid, hatch } from "./home-patterns"

type CardProps = { className?: string }

function Card({
  id,
  name,
  className,
  children,
}: {
  id: string
  name: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "@container relative isolate min-w-0 border border-frame bg-background text-foreground",
        className
      )}
    >
      <h3 id={id} className="sr-only scroll-mt-24">
        {name}
      </h3>
      <div className="relative flex h-full min-h-[125cqi] flex-col px-(--card-x) py-[8cqi] [--card-x:8cqi] @[24rem]:[--card-x:12cqi]">
        {children}
      </div>
    </section>
  )
}

// Every look is opaque, so letters hide the patterns and lines behind them
// instead of blending with them.
const looks = {
  solid: "text-foreground",
  ghost: "text-[color-mix(in_oklab,var(--foreground)_35%,var(--background))]",
  dim: "text-[color-mix(in_oklab,var(--foreground)_60%,var(--background))]",
  outline:
    "text-background [-webkit-text-stroke:2px_var(--outline)] [paint-order:stroke_fill]",
}

function Display({
  look = "solid",
  className,
  children,
}: {
  look?: keyof typeof looks
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none block font-[450] tracking-[-0.055em] [line-height:0.86] whitespace-nowrap select-none [--outline:color-mix(in_oklab,var(--foreground)_80%,var(--background))] dark:[--outline:color-mix(in_oklab,var(--foreground)_32%,var(--background))]",
        looks[look],
        className
      )}
    >
      {children}
    </span>
  )
}

function Caption({
  lines,
  className,
}: {
  lines: string[]
  className?: string
}) {
  return (
    <p
      className={cn(
        "relative font-mono text-[9px] leading-[1.55] tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase @[26rem]:text-[10px] @[36rem]:text-[11px]",
        className
      )}
    >
      {lines.map((text) => (
        <span key={text} className="block">
          {text}
        </span>
      ))}
    </p>
  )
}

function Patch({
  kind = "hatch",
  className,
}: {
  kind?: "hatch" | "grid"
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      style={kind === "hatch" ? hatch : grid}
    />
  )
}

function Frame({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-[5cqi] border border-dashed border-[color-mix(in_oklab,var(--foreground)_20%,var(--background))]",
        className
      )}
    />
  )
}

const island = "relative flex w-full justify-center"

function ColorCard(props: CardProps) {
  return (
    <Card {...props} id="color-picker" name="Color Picker">
      <Caption
        lines={["Pick a color", "Drag or type a value"]}
        className="ms-[52%]"
      />
      <div className="mt-[3cqi] -mx-[4cqi] flex justify-between gap-[0.18em] text-[length:18.5cqi] @[24rem]:-mx-[8cqi]">
        <Display look="outline">Color</Display>
        <Display className="relative z-10">Picker</Display>
      </div>
      <ColorIsland className={cn(island, "-mt-[3cqi]")} />
    </Card>
  )
}

function TokenInputCard(props: CardProps) {
  return (
    <Card {...props} id="token-input" name="Token Input">
      <Frame />
      <div className="relative mt-[6cqi] text-[length:15.5cqi]">
        <Display look="ghost">Token</Display>
        <Display className="text-end">Input</Display>
      </div>
      <TokenInputIsland className={cn(island, "mt-[10cqi]")} />
      <Caption
        lines={["Write a prompt", "Add files, skills, a model"]}
        className="mt-auto ms-[28%] pt-[4cqi] @[24rem]:ms-[44%]"
      />
    </Card>
  )
}

function NumberInputCard(props: CardProps) {
  return (
    <Card {...props} id="number-input" name="Number Input">
      <NumberInputIsland className={cn(island, "mt-[8cqi]")} />
      <div className="relative mt-auto pt-[8cqi] text-[length:15.5cqi]">
        <Display look="ghost">Number</Display>
        <Display>Input</Display>
        <Caption
          lines={["Pick a number", "Type it, tap or drag", "the ruler"]}
          className="absolute start-[53%] bottom-[0.06em]"
        />
      </div>
    </Card>
  )
}

function SwitchCard(props: CardProps) {
  return (
    <Card {...props} id="switch" name="Switch">
      <Patch className="inset-x-[6cqi] top-[6cqi] h-[58cqi]" />
      <SwitchIsland className={cn(island, "mt-[21cqi]")} />
      <div className="mt-auto flex flex-col gap-[5cqi] pt-[8cqi]">
        <Display className="text-[length:17cqi]">Switch</Display>
        <Caption lines={["Turn things on and off", "Tap a switch"]} />
      </div>
    </Card>
  )
}

function ResizableCard(props: CardProps) {
  return (
    <Card {...props} id="resizable" name="Resizable">
      <Patch kind="grid" className="inset-x-[5cqi] top-[5cqi] h-[57cqi]" />
      <Caption
        lines={["Resize the panels", "Drag the line"]}
        className="mt-[7cqi] text-center"
      />
      <ResizableIsland className={cn(island, "mt-[8cqi]")} />
      <Display
        look="outline"
        className="relative z-10 -mt-[8cqi] -ms-[3.5cqi] w-[76cqi] text-[length:29cqi] [line-height:0.8] @[24rem]:w-[72cqi]"
      >
        Resiz-
        <span className="block text-end">able</span>
      </Display>
    </Card>
  )
}

function SliderCard(props: CardProps) {
  return (
    <Card {...props} id="slider" name="Slider">
      <Patch className="inset-x-[5cqi] top-[5cqi] h-[13.5cqi]" />
      <Display look="dim" className="relative mt-[1cqi] text-[length:16cqi]">
        Slider
      </Display>
      <SliderIsland className={cn(island, "mt-auto mb-[6cqi] pt-[10cqi]")} />
    </Card>
  )
}

function CommandCard(props: CardProps) {
  return (
    <Card {...props} id="command" name="Command">
      <Display look="outline" className="mt-[1cqi] text-[length:14.5cqi]">
        Command
      </Display>
      <CommandIsland className={cn(island, "z-10 -mt-[1.6cqi]")} />
      <div className="mt-[4cqi] flex justify-between gap-4">
        <Caption lines={["Search everything"]} />
        <Caption lines={["Type, then tap a result"]} className="text-end" />
      </div>
    </Card>
  )
}

function AccordionCard(props: CardProps) {
  return (
    <Card {...props} id="accordion" name="Accordion">
      <Patch className="start-[5cqi] inset-y-[5cqi] w-[28cqi]" />
      <Display
        look="ghost"
        className="relative ms-[36%] mt-[1cqi] text-[length:15.5cqi]"
      >
        Accor-
        <br />
        dion
      </Display>
      <AccordionIsland className={cn(island, "mt-[12cqi]")} />
      <Caption
        lines={["One section open at a time", "Tap a title to open it"]}
        className="mt-auto ms-[36%] pt-[6cqi]"
      />
    </Card>
  )
}

function RatingCard(props: CardProps) {
  return (
    <Card {...props} id="rating" name="Rating">
      <Frame />
      <Caption
        lines={["Rate it", "Tap a star"]}
        className="mt-[14cqi] text-center"
      />
      <RatingIsland className={cn(island, "mt-[22cqi]")} />
      <Display
        look="outline"
        className="mt-auto mb-[3cqi] pt-[8cqi] text-center text-[length:17cqi]"
      >
        Rating
      </Display>
    </Card>
  )
}

function SegmentedCard(props: CardProps) {
  return (
    <Card {...props} id="segmented-control" name="Segmented Control">
      <Frame />
      <Patch kind="grid" className="inset-x-[5cqi] bottom-[5cqi] h-[39cqi]" />
      <Display
        look="outline"
        className="relative mt-[1cqi] text-[length:15.5cqi]"
      >
        Seg-
        <br />
        mented
      </Display>
      <SegmentedIsland className={cn(island, "mt-auto pt-[10cqi]")} />
      <div className="relative mt-[4cqi] flex items-start justify-between gap-4">
        <Caption lines={["Pick one option", "Tap to switch"]} />
        <Display className="text-end text-[length:15.5cqi]">
          Con-
          <br />
          trol
        </Display>
      </div>
    </Card>
  )
}

function CalendarCard(props: CardProps) {
  return (
    <Card {...props} id="calendar" name="Calendar">
      <Display className="mt-[1cqi] text-center text-[length:16cqi]">
        Calendar
      </Display>
      <CalendarIsland className={cn(island, "mt-[4cqi]")} />
      <Caption
        lines={["Pick your dates", "Tap a start, then an end"]}
        className="mt-auto pt-[5cqi] text-center"
      />
    </Card>
  )
}

function TabsCard(props: CardProps) {
  return (
    <Card {...props} id="tabs" name="Tabs">
      <div className="-me-(--card-x) mt-[1cqi] flex gap-[1.5cqi] overflow-hidden text-[length:16cqi]">
        <Display>Tabs</Display>
        <Display look="outline">Tabs</Display>
        <Display look="outline">Tabs</Display>
      </div>
      <TabsIsland className={cn(island, "mt-[6cqi]")} />
      <Caption
        lines={["Switch tabs", "Tap one to open it"]}
        className="mt-auto pt-[5cqi]"
      />
    </Card>
  )
}

// Dashed guides that line up with the code's six boxes, since both use the
// same columns.
function OTPGuides() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-(--card-x) inset-y-0 grid grid-cols-[1fr_2rem_1fr]"
    >
      {[0, 2].map((column) => (
        <div
          key={column}
          style={{ gridColumn: column + 1 }}
          className="grid grid-cols-3"
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="-ms-px border-x border-dashed border-[color-mix(in_oklab,var(--foreground)_20%,var(--background))] first:ms-0"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function OTPCard(props: CardProps) {
  return (
    <Card {...props} id="otp-input" name="OTP Input">
      <OTPGuides />
      <div className="relative mt-[5cqi]">
        <Display look="outline" className="-ms-[1.5cqi] text-[length:27cqi]">
          OTP
        </Display>
        <div className="-mt-[5cqi] flex items-end justify-between gap-4">
          <Caption
            lines={["Enter the code we sent", "Pasting it works too"]}
            className="mb-[5cqi]"
          />
          <Display className="text-[length:18cqi]">Input</Display>
        </div>
      </div>
      <OTPIsland className={cn(island, "mt-[13cqi]")} />
    </Card>
  )
}

function TreeCard(props: CardProps) {
  return (
    <Card {...props} id="tree" name="Tree">
      <Patch className="inset-x-[5cqi] top-[5cqi] h-[58cqi]" />
      <div className="relative mt-[1cqi] flex items-start gap-[7cqi] text-[length:16cqi]">
        <Display>Tree</Display>
        <Caption
          lines={["Open a folder", "Tap to open or close it"]}
          className="mt-[2cqi]"
        />
      </div>
      <Display
        look="outline"
        className="relative ms-[12cqi] -mt-[1cqi] text-[length:16cqi]"
      >
        Tree
      </Display>
      <Display
        look="outline"
        className="relative ms-[12cqi] -mt-[1cqi] text-[length:16cqi]"
      >
        Tree
      </Display>
      <TreeIsland className={cn(island, "z-10 -mt-[6cqi]")} />
    </Card>
  )
}

function ToolbarCard(props: CardProps) {
  return (
    <Card {...props} id="toolbar" name="Toolbar">
      <Patch className="start-[5cqi] top-[5cqi] size-[31cqi]" />
      <Patch className="start-[36cqi] top-[36cqi] size-[31cqi]" />
      <Patch className="start-[5cqi] bottom-[5cqi] size-[31cqi]" />
      <ToolbarIsland className={cn(island, "mt-[36cqi]")} />
      <div className="relative mt-auto ms-[calc(39cqi-var(--card-x))] pt-[10cqi]">
        <Caption lines={["Format the text", "Tap a button to turn it on"]} />
        <Display className="mt-[4cqi] text-[length:17cqi]">Toolbar</Display>
      </div>
    </Card>
  )
}

export {
  AccordionCard,
  CalendarCard,
  ColorCard,
  CommandCard,
  NumberInputCard,
  OTPCard,
  RatingCard,
  ResizableCard,
  SegmentedCard,
  SliderCard,
  SwitchCard,
  TabsCard,
  TokenInputCard,
  ToolbarCard,
  TreeCard,
}
