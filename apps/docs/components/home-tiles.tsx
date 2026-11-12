import { Poster } from "./home-posters"
import {
  AgentsIsland,
  AskIsland,
  CanvasIsland,
  FlowIsland,
  OperateIsland,
  SheetIsland,
  TimelineIsland,
  WeekIsland,
} from "./home-islands"

type TileProps = { className?: string }

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
  AgentsTile,
  AskPoster,
  CanvasTile,
  FlowTile,
  OperatePoster,
  SheetTile,
  TimelineTile,
  WeekTile,
}
