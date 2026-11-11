import { ComponentPoster, Poster } from "./home-posters"
import {
  AccordionIsland,
  AgentsIsland,
  AskIsland,
  CalendarIsland,
  CanvasIsland,
  ColorIsland,
  CommandIsland,
  FlowIsland,
  NumberInputIsland,
  OTPIsland,
  OperateIsland,
  RatingIsland,
  ResizableIsland,
  SegmentedIsland,
  SheetIsland,
  SliderIsland,
  SwitchIsland,
  TabsIsland,
  TimelineIsland,
  TokenInputIsland,
  ToolbarIsland,
  TreeIsland,
  WeekIsland,
} from "./home-islands"

type TileProps = { className?: string }

function CalendarTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="plus"
      title="Calendar."
      id="calendar"
      island={CalendarIsland}
    />
  )
}

function CommandTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      pattern="halftone"
      title="Command."
      id="command"
      island={CommandIsland}
    />
  )
}

function OTPTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      pattern="rules"
      title="OTP Input."
      id="otp-input"
      island={OTPIsland}
    />
  )
}

function RatingTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="dots"
      title="Rating."
      id="rating"
      island={RatingIsland}
    />
  )
}

function NumberInputTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      pattern="halftone"
      title="Number Input."
      id="number-input"
      island={NumberInputIsland}
    />
  )
}

function SwitchTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="hatch"
      title="Switch."
      id="switch"
      island={SwitchIsland}
    />
  )
}

function SliderTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="columns"
      title="Slider."
      id="slider"
      island={SliderIsland}
    />
  )
}

function SegmentedTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="rings"
      title="Segmented Control."
      id="segmented-control"
      island={SegmentedIsland}
    />
  )
}

function ColorTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      pattern="squares"
      title="Color Picker."
      id="color-picker"
      island={ColorIsland}
    />
  )
}

function TreeTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      pattern="isometric"
      title="Tree."
      id="tree"
      island={TreeIsland}
    />
  )
}

function TabsTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      pattern="ruler"
      title="Tabs."
      id="tabs"
      island={TabsIsland}
    />
  )
}

function TokenInputTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="crosshatch"
      title="Token Input."
      id="token-input"
      island={TokenInputIsland}
    />
  )
}

function AccordionTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="rules"
      title="Accordion."
      id="accordion"
      island={AccordionIsland}
    />
  )
}

function ResizableTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      pattern="columns"
      title="Resizable."
      id="resizable"
      island={ResizableIsland}
    />
  )
}

function ToolbarTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      tone="white"
      pattern="plus"
      title="Toolbar."
      id="toolbar"
      island={ToolbarIsland}
    />
  )
}

function AgentsTile(props: TileProps) {
  return (
    <Poster
      {...props}
      pattern="columns"
      body="justify-between gap-8"
      island={AgentsIsland}
    />
  )
}

function FlowTile(props: TileProps) {
  return (
    <Poster
      {...props}
      pattern="plus"
      body="justify-between gap-8"
      island={FlowIsland}
    />
  )
}

function AskPoster() {
  return (
    <Poster
      tone="white"
      pattern="grid"
      body="gap-10"
      className="lg:min-h-0"
      island={AskIsland}
    />
  )
}

function CanvasTile(props: TileProps) {
  return (
    <Poster
      {...props}
      pattern="dots"
      body="justify-between gap-8"
      island={CanvasIsland}
    />
  )
}

function TimelineTile(props: TileProps) {
  return (
    <Poster
      {...props}
      tone="white"
      pattern="ruler"
      body="justify-between gap-8"
      island={TimelineIsland}
    />
  )
}

function OperatePoster() {
  return (
    <Poster
      tone="white"
      pattern="grid"
      body="gap-6"
      className="max-sm:gap-6 lg:min-h-0"
      island={OperateIsland}
    />
  )
}

function SheetTile(props: TileProps) {
  return (
    <Poster
      {...props}
      tone="white"
      pattern="rules"
      body="justify-between gap-8"
      island={SheetIsland}
    />
  )
}

function WeekTile(props: TileProps) {
  return (
    <Poster
      {...props}
      tone="white"
      pattern="grid"
      body="justify-between gap-8"
      island={WeekIsland}
    />
  )
}

export {
  AccordionTile,
  AgentsTile,
  AskPoster,
  CalendarTile,
  CanvasTile,
  ColorTile,
  CommandTile,
  FlowTile,
  NumberInputTile,
  OTPTile,
  OperatePoster,
  RatingTile,
  ResizableTile,
  SegmentedTile,
  SheetTile,
  SliderTile,
  SwitchTile,
  TabsTile,
  TimelineTile,
  TokenInputTile,
  ToolbarTile,
  TreeTile,
  WeekTile,
}
