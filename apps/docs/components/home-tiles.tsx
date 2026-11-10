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

type TileProps = { className?: string; fig?: string }

function CalendarTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"PICK YOUR DATES\nDRAG ACROSS THEM\nOR USE THE ARROWS"}
      touch={"PICK YOUR DATES\nTAP A START, THEN AN END"}
      tone="white"
      pattern="plus"
      title="Calendar."
      id="calendar"
      name="calendar"
      island={CalendarIsland}
    />
  )
}

function CommandTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"SEARCH EVERYTHING\nTYPE, THEN PRESS ENTER"}
      touch={"SEARCH EVERYTHING\nTYPE, THEN TAP A RESULT"}
      pattern="halftone"
      title="Command."
      id="command"
      name="command"
      island={CommandIsland}
    />
  )
}

function OTPTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"ENTER THE CODE WE SENT\nPASTING IT WORKS TOO"}
      pattern="rules"
      title="OTP Input."
      id="otp-input"
      name="otp-input"
      island={OTPIsland}
    />
  )
}

function RatingTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"RATE IT\nHOVER TO PREVIEW A SCORE"}
      touch={"RATE IT\nTAP A STAR"}
      tone="white"
      pattern="dots"
      title="Rating."
      id="rating"
      name="rating"
      island={RatingIsland}
    />
  )
}

function NumberInputTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"PICK A NUMBER\nTYPE IT, CLICK OR USE\nTHE ARROWS"}
      touch={"PICK A NUMBER\nTYPE IT, TAP OR DRAG\nTHE RULER"}
      pattern="halftone"
      title="Number Input."
      id="number-input"
      name="number-input"
      island={NumberInputIsland}
    />
  )
}

function SwitchTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"TURN THINGS ON AND OFF\nCLICK OR PRESS SPACE"}
      touch={"TURN THINGS ON AND OFF\nTAP A SWITCH"}
      tone="white"
      pattern="hatch"
      title="Switch."
      id="switch"
      name="switch"
      island={SwitchIsland}
    />
  )
}

function SliderTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"SET THE VOLUME\nDRAG, CLICK OR USE\nTHE ARROWS"}
      touch={"SET THE VOLUME\nDRAG OR TAP THE TRACK"}
      tone="white"
      pattern="columns"
      title="Slider."
      id="slider"
      name="slider"
      island={SliderIsland}
    />
  )
}

function SegmentedTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"PICK ONE OPTION\nCLICK OR USE THE ARROWS"}
      touch={"PICK ONE OPTION\nTAP TO SWITCH"}
      tone="white"
      pattern="rings"
      title="Segmented Control."
      id="segmented-control"
      name="segmented-control"
      island={SegmentedIsland}
    />
  )
}

function ColorTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"PICK A COLOR\nDRAG OR TYPE A VALUE"}
      pattern="squares"
      title="Color Picker."
      id="color-picker"
      name="color-picker"
      island={ColorIsland}
    />
  )
}

function TreeTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"OPEN A FOLDER\nRIGHT ARROW OPENS\nLEFT ARROW CLOSES"}
      touch={"OPEN A FOLDER\nTAP TO OPEN OR CLOSE IT"}
      pattern="isometric"
      title="Tree."
      id="tree"
      name="tree"
      island={TreeIsland}
    />
  )
}

function TabsTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"SWITCH TABS\nCLICK OR USE THE ARROWS"}
      touch={"SWITCH TABS\nTAP ONE TO OPEN IT"}
      pattern="ruler"
      title="Tabs."
      id="tabs"
      name="tabs"
      island={TabsIsland}
    />
  )
}

function TokenInputTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"WRITE A PROMPT\nADD FILES, SKILLS, A MODEL"}
      tone="white"
      pattern="crosshatch"
      title="Token Input."
      id="token-input"
      name="token-input"
      island={TokenInputIsland}
    />
  )
}

function AccordionTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"ONE SECTION OPEN AT A TIME\n⌘F FINDS TEXT IN CLOSED ONES"}
      touch={"ONE SECTION OPEN AT A TIME\nTAP A TITLE TO OPEN IT"}
      tone="white"
      pattern="rules"
      title="Accordion."
      id="accordion"
      name="accordion"
      island={AccordionIsland}
    />
  )
}

function ResizableTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"RESIZE THE PANELS\nDRAG THE LINE OR\nUSE THE ARROWS"}
      touch={"RESIZE THE PANELS\nDRAG THE LINE"}
      pattern="columns"
      title="Resizable."
      id="resizable"
      name="resizable"
      island={ResizableIsland}
    />
  )
}

function ToolbarTile(props: TileProps) {
  return (
    <ComponentPoster
      {...props}
      head={"FORMAT THE TEXT\nTAB ONCE, THEN USE THE ARROWS"}
      touch={"FORMAT THE TEXT\nTAP A BUTTON TO TURN IT ON"}
      tone="white"
      pattern="plus"
      title="Toolbar."
      id="toolbar"
      name="toolbar"
      island={ToolbarIsland}
    />
  )
}

function AgentsTile(props: TileProps) {
  return (
    <Poster
      {...props}
      head={
        "A BOARD FOR THREE AGENTS\nDRAG A TASK TO HAND IT OVER\nOR USE SPACE AND THE ARROWS"
      }
      touch={"A BOARD FOR THREE AGENTS\nDRAG A TASK TO HAND IT OVER"}
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
      head={
        "WIRE UP A WORKFLOW\nDRAG FROM ONE DOT TO ANOTHER\nOR PRESS C TO CONNECT"
      }
      touch={"WIRE UP A WORKFLOW\nDRAG FROM ONE DOT TO ANOTHER"}
      pattern="plus"
      body="justify-between gap-8"
      island={FlowIsland}
    />
  )
}

function AskPoster({ fig }: { fig?: string }) {
  return (
    <Poster
      fig={fig}
      head={"ASKING YOUR AGENT\nFOR A NEW COMPONENT"}
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
      head={"A SMALL DESIGN TOOL\nDRAG, RESIZE, CHANGE COLORS"}
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
      head={"A VIDEO TIMELINE\nDRAG CLIPS, TRIM THE ENDS\nSCRUB TO WATCH"}
      tone="white"
      pattern="ruler"
      body="justify-between gap-8"
      island={TimelineIsland}
    />
  )
}

function OperatePoster({ fig }: { fig?: string }) {
  return (
    <Poster
      fig={fig}
      head={"AN AGENT CHANGING SETTINGS\nIT READS THE FORM, THEN FILLS IT IN"}
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
      head={"A SPREADSHEET WITH AI\nSELECT CELLS, THEN PRESS RUN\n⌘Z UNDOES IT"}
      touch={"A SPREADSHEET WITH AI\nSELECT CELLS, THEN TAP RUN"}
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
      head={
        "PLAN YOUR WEEK\nDRAG A MEETING TO ANOTHER DAY\nPULL THE BOTTOM TO MAKE IT LONGER"
      }
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
