"use client"

import {
  createChange,
  createConnect,
  createMove,
  createRovingFocus,
  createTransfer,
  css,
  definePrimitive,
  live,
  spatialMove,
  type ConnectDraft,
  type MoveDraft,
  type MovePoint,
  type TransferDraft,
  type TransferLists,
} from "@ui-sdk/core"
import { createParts, usePart, type PartProps } from "@ui-sdk/react/primitive"
import { Toggle } from "@ui-sdk/react/toggle"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"
import * as React from "react"
import { Numeral, Title } from "./home-posters"

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]"
const label = "font-mono text-[10px] tracking-[0.06em] uppercase"
const action = "border-[#006bff] bg-[#006bff] text-white hover:bg-[#0059d6]"
const press = cn(
  "inline-flex h-7 min-w-7 shrink-0 cursor-default items-center justify-center gap-1.5 bg-background px-2 font-mono text-[10px] tracking-[0.06em] uppercase select-none hover:bg-foreground/[0.06] data-pressed:bg-foreground data-pressed:text-background [&_svg]:size-3.5",
  ink,
  ring
)

function useFit(width: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)
  React.useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / width)
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [width])
  return [ref, scale] as const
}

type CrewState = {
  lists: TransferLists
  focused: string | null
  moving: TransferDraft | null
}
type CrewOptions = {
  lists: TransferLists
  onListsChange?: (lists: TransferLists) => void
}

const lanes: Record<string, string> = {
  research: "Research",
  code: "Code",
  review: "Review",
  done: "Done",
}

const jobs: Record<string, { title: string; steps: string[] }> = {
  pricing: {
    title: "Compare pricing pages",
    steps: ["Thinking", "web_search pricing", "read 6 pages", "write table.md"],
  },
  feedback: {
    title: "Sort user feedback",
    steps: [
      "Thinking",
      "read feedback.csv",
      "group 212 notes",
      "write themes.md",
    ],
  },
  search: {
    title: "Add search to the docs",
    steps: [
      "Thinking",
      "grep Search",
      "read layout.tsx",
      "edit search.tsx",
      "run tests",
    ],
  },
  dark: {
    title: "Fix dark mode flash",
    steps: ["Thinking", "read theme.ts", "edit layout.tsx", "run tests"],
  },
  flaky: {
    title: "Fix the flaky test",
    steps: ["Thinking", "run tests ×20", "read date.test.ts", "edit date.ts"],
  },
  billing: {
    title: "Review the billing PR",
    steps: ["Thinking", "read diff", "run tests", "write review"],
  },
  readme: { title: "Update the README", steps: ["Done"] },
}

const start: TransferLists = {
  research: ["pricing", "feedback"],
  code: ["search", "dark", "flaky"],
  review: ["billing"],
  done: ["readme"],
}

const progressStart: Record<string, number> = {
  pricing: 0.55,
  search: 0.3,
  billing: 0.7,
  readme: 1,
}
const speeds: Record<string, number> = {
  research: 0.035,
  code: 0.025,
  review: 0.05,
}

const crew = definePrimitive({
  name: "crew",
  options: { lists: "value", onListsChange: "callback" },
  state: (options: CrewOptions): CrewState => ({
    lists: options.lists,
    focused: null,
    moving: null,
  }),
  sync: (options) => ({ lists: options.lists }),
  api: (context) => {
    const change = createChange(context)
    return {
      roving: createRovingFocus<CrewState, { value: string }>(context, {
        slot: "card",
        key: "focused",
        move: spatialMove(),
      }),
      transfer: createTransfer<CrewState>(context, {
        key: "lists",
        draft: "moving",
        set: (value, details) => change("lists", value, details),
        order: () => Object.keys(lanes),
        label: (key) => jobs[key]?.title,
        listLabel: (list) => lanes[list],
        createAutoScroll: false,
      }),
    }
  },
  slots: (slot) => ({
    root: slot<{}, { lists: TransferLists }>({
      state: (state, { api }) => ({ lists: api.transfer.lists(state) }),
    }),
    lane: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ role: "listbox" }),
      bind: (el, { api, key }) => api.transfer.bindList(el, key),
    }),
    card: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "option",
        "aria-selected": String(part.api.transfer.moving(state, part.key)),
        tabindex: part.api.roving.tabIndex(state, part),
        "data-dragging": part.api.transfer.dragging(state, part.key)
          ? ""
          : undefined,
        style: "touch-action:none;user-select:none",
      }),
      on: {
        keydown: (event, { el, api, key }) =>
          api.transfer.keydown(event, key) || api.roving.keydown(event, el!),
        pointerdown: (event, { api, key }) =>
          api.transfer.pointerdown(event, key),
      },
      bind: (el, part) => {
        const cleanups = [
          part.api.roving.bind(el, part),
          part.api.transfer.bindItem(el, part.key),
        ]
        return () => cleanups.forEach((cleanup) => cleanup())
      },
    }),
  }),
})

const crewParts = createParts(crew, { root: "div", lane: "div", card: "div" })
const Crew = crewParts.Root
const CrewLane = crewParts.Lane
const CrewCard = crewParts.Card

function AgentsDemo() {
  const [lists, setLists] = React.useState(start)
  const [progress, setProgress] = React.useState(progressStart)
  const [running, setRunning] = React.useState(false)
  const latest = React.useRef({ lists, progress })
  latest.current = { lists, progress }
  const busy = ["research", "code", "review"].some(
    (lane) => lists[lane].length > 0
  )
  React.useEffect(() => {
    if (!running) {
      return
    }
    const id = window.setInterval(() => {
      const now = latest.current
      const next = { ...now.progress }
      let moved = now.lists
      for (const lane of Object.keys(speeds)) {
        const key = now.lists[lane][0]
        if (!key) {
          continue
        }
        next[key] = Math.min(1, (next[key] ?? 0) + speeds[lane])
        if (next[key] < 1) {
          continue
        }
        moved = {
          ...moved,
          [lane]: moved[lane].filter((item) => item !== key),
          done: [key, ...moved.done],
        }
      }
      setProgress(next)
      if (moved !== now.lists) {
        setLists(moved)
      }
      if (Object.keys(speeds).every((lane) => moved[lane].length === 0)) {
        setRunning(false)
      }
    }, 160)
    return () => window.clearInterval(id)
  }, [running])
  const onListsChange = (value: TransferLists) => {
    setLists(value)
    setProgress((current) => {
      const next = { ...current }
      for (const key of Object.keys(next)) {
        if (!value.done.includes(key) && next[key] >= 1) {
          next[key] = 0
        }
      }
      return next
    })
  }
  const restart = () => {
    setLists(start)
    setProgress({})
    setRunning(true)
  }
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <Title id="agents" max={6.5} className="-ms-[0.05em]">
          Agents.
        </Title>
        <div className="flex items-baseline gap-2">
          <Numeral className="text-[length:clamp(2rem,6cqi,3.5rem)]">
            {lists.done.length}/{Object.keys(jobs).length}
          </Numeral>
          <span className={cn(label, "text-muted-foreground")}>tasks done</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {busy ? (
            <Toggle
              aria-label={running ? "Pause the agents" : "Run the agents"}
              pressed={running}
              onPressedChange={setRunning}
              className={press}
            >
              {running ? "Pause" : "Run"}
            </Toggle>
          ) : (
            <button type="button" onClick={restart} className={press}>
              Run again
            </button>
          )}
          <span
            aria-live="polite"
            className={cn(label, "text-muted-foreground")}
          >
            {!busy ? "All done" : running ? "Working" : "Paused"}
          </span>
        </div>
        <Crew lists={lists} onListsChange={onListsChange}>
          {({ lists: shown }) => (
            <div className="grid grid-cols-2 gap-2 @[34rem]:grid-cols-4">
              {Object.keys(lanes).map((lane) => (
                <div
                  key={lane}
                  className={cn("flex min-w-0 flex-col bg-background", ink)}
                >
                  <div className="flex h-9 items-center justify-between gap-2 border-b border-foreground px-2.5">
                    <span className={label}>{lanes[lane]}</span>
                    {lane !== "done" && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2 transition-colors",
                          running && shown[lane].length
                            ? "animate-pulse bg-foreground"
                            : "bg-foreground/20"
                        )}
                      />
                    )}
                  </div>
                  <CrewLane
                    value={lane}
                    aria-label={lanes[lane]}
                    className="flex min-h-[20rem] flex-1 flex-col gap-2 p-2"
                  >
                    {shown[lane].map((key, index) => {
                      const job = jobs[key]
                      const done = lane === "done"
                      const active = !done && index === 0
                      const amount = progress[key] ?? 0
                      const step =
                        job.steps[
                          Math.min(
                            job.steps.length - 1,
                            Math.floor(amount * job.steps.length)
                          )
                        ]
                      return (
                        <CrewCard
                          key={key}
                          value={key}
                          className={cn(
                            "flex shrink-0 cursor-grab flex-col bg-background text-[13px] leading-snug data-dragging:opacity-30 aria-selected:border-dashed [&[data-drag-preview]]:shadow-lg",
                            ink,
                            ring,
                            done
                              ? "h-9 justify-center border-foreground/30 px-2.5 text-muted-foreground"
                              : "h-[5.25rem] justify-between p-2.5",
                            active && running && "border-2 p-[9px]"
                          )}
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span
                              className={done ? "truncate" : "line-clamp-2"}
                            >
                              {job.title}
                            </span>
                            {done && (
                              <CheckIcon
                                aria-hidden="true"
                                className="size-3.5 shrink-0"
                              />
                            )}
                          </span>
                          {!done && (
                            <span className="flex flex-col gap-1.5">
                              <span className="truncate font-mono text-[10px] text-muted-foreground">
                                {active ? `→ ${step}` : "Queued"}
                              </span>
                              <span
                                aria-hidden="true"
                                className="h-0.5 w-full bg-foreground/10"
                              >
                                <span
                                  className="block h-full bg-foreground transition-[width] duration-150"
                                  style={{ width: `${amount * 100}%` }}
                                />
                              </span>
                            </span>
                          )}
                        </CrewCard>
                      )
                    })}
                  </CrewLane>
                </div>
              ))}
            </div>
          )}
        </Crew>
      </div>
    </>
  )
}

type Step = {
  value: string
  label: string
  kind: string
  input: boolean
  output: boolean
}
type Wire = { from: string; to: string }
type FlowState = {
  layout: Layout
  positions: Record<string, MovePoint>
  edges: Wire[]
  focused: string | null
  moving: MoveDraft | null
  connecting: ConnectDraft | null
}
type FlowOptions = {
  layout: Layout
  edges: Wire[]
  onEdgesChange?: (edges: Wire[]) => void
  scale?: number
}

const node = { width: 150, height: 56 }

const steps: Step[] = [
  {
    value: "email",
    label: "New email",
    kind: "Trigger",
    input: false,
    output: true,
  },
  {
    value: "docs",
    label: "Fetch docs",
    kind: "Tool",
    input: false,
    output: true,
  },
  {
    value: "summarize",
    label: "Summarize",
    kind: "Model",
    input: true,
    output: true,
  },
  {
    value: "slack",
    label: "Send to Slack",
    kind: "Action",
    input: true,
    output: false,
  },
]

const layouts = {
  wide: {
    world: { width: 640, height: 400 },
    vertical: false,
    placed: {
      email: { x: 24, y: 64 },
      docs: { x: 24, y: 280 },
      summarize: { x: 252, y: 172 },
      slack: { x: 466, y: 172 },
    } as Record<string, MovePoint>,
  },
  tall: {
    world: { width: 320, height: 470 },
    vertical: true,
    placed: {
      email: { x: 4, y: 16 },
      docs: { x: 166, y: 16 },
      summarize: { x: 85, y: 206 },
      slack: { x: 85, y: 396 },
    } as Record<string, MovePoint>,
  },
}
type Layout = keyof typeof layouts

const wired: Wire[] = [
  { from: "email:out", to: "summarize:in" },
  { from: "docs:out", to: "summarize:in" },
]

const nodeOf = (port: string) => port.slice(0, port.lastIndexOf(":"))
const stepOf = (key: string) => steps.find((step) => step.value === key)!

function portPoint(state: FlowState, port: string) {
  const key = nodeOf(port)
  const at = state.positions[key]
  const drag = state.moving?.keys.includes(key) ? state.moving : null
  const out = port.endsWith(":out")
  const vertical = layouts[state.layout].vertical
  return {
    x:
      at.x +
      (drag?.dx ?? 0) +
      (vertical ? node.width / 2 : out ? node.width : 0),
    y:
      at.y +
      (drag?.dy ?? 0) +
      (vertical ? (out ? node.height : 0) : node.height / 2),
  }
}

function curve(
  state: FlowState,
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  if (layouts[state.layout].vertical) {
    const reach = Math.max(40, Math.abs(to.y - from.y) / 2)
    return `M${from.x},${from.y} C${from.x},${from.y + reach} ${to.x},${to.y - reach} ${to.x},${to.y}`
  }
  const reach = Math.max(40, Math.abs(to.x - from.x) / 2)
  return `M${from.x},${from.y} C${from.x + reach},${from.y} ${to.x - reach},${to.y} ${to.x},${to.y}`
}

const flow = definePrimitive({
  name: "flow",
  options: {
    layout: "value",
    edges: "value",
    onEdgesChange: "callback",
    scale: "number",
  },
  state: (options: FlowOptions): FlowState => ({
    layout: options.layout,
    positions: layouts[options.layout].placed,
    edges: options.edges,
    focused: null,
    moving: null,
    connecting: null,
  }),
  sync: (options) => ({ edges: options.edges }),
  live: ["connecting"],
  api: (context) => {
    const { store } = context
    const change = createChange(context)
    const scale = () => context.options().scale ?? 1
    const roving = createRovingFocus<FlowState, { value: string }>(context, {
      slot: "node",
      key: "focused",
      move: spatialMove(),
    })
    const move = createMove<FlowState>(context, {
      key: "positions",
      draft: "moving",
      set: (value, details) => change("positions", value, details),
      step: () => 8,
      scale,
      bounds: () => {
        const { world } = layouts[store.get().layout]
        return {
          minX: 0,
          minY: 0,
          maxX: world.width - node.width,
          maxY: world.height - node.height,
        }
      },
      label: (key) => stepOf(key).label,
    })
    const linked = (from: string, to: string) =>
      store.get().edges.some((edge) => edge.from === from && edge.to === to)
    const connect = createConnect<FlowState>(context, {
      slot: "port",
      draft: "connecting",
      canConnect: (from, to) =>
        from.endsWith(":out") &&
        to.endsWith(":in") &&
        nodeOf(from) !== nodeOf(to) &&
        !linked(from, to),
      point: (clientX, clientY) => {
        const box = context.element("root")!.getBoundingClientRect()
        return {
          x: (clientX - box.left) / scale(),
          y: (clientY - box.top) / scale(),
        }
      },
      label: (port) =>
        `${stepOf(nodeOf(port)).label} ${port.endsWith(":out") ? "output" : "input"}`,
      connect: (from, to, details) =>
        change("edges", [...store.get().edges, { from, to }], details),
    })
    return {
      roving,
      move,
      connect,
      nodeKeydown(event: KeyboardEvent, el: HTMLElement, key: string) {
        if (connect.keydown(event) || move.keydown(event, key)) {
          return
        }
        const letter = event.key.toLowerCase()
        if (
          letter === "c" &&
          !event.ctrlKey &&
          !event.metaKey &&
          stepOf(key).output
        ) {
          event.preventDefault()
          connect.start(`${key}:out`)
        } else if (event.key === "Backspace" || event.key === "Delete") {
          event.preventDefault()
          const edges = store
            .get()
            .edges.filter(
              (edge) => nodeOf(edge.from) !== key && nodeOf(edge.to) !== key
            )
          change("edges", edges, { reason: "delete-key", event })
        } else {
          roving.keydown(event, el)
        }
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, { edges: Wire[] }>({
      state: (state) => ({ edges: state.edges }),
      attrs: (state) => {
        const { world } = layouts[state.layout]
        return {
          style: css({
            position: "relative",
            width: `${world.width}px`,
            height: `${world.height}px`,
          }),
        }
      },
    }),
    node: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => {
        const at = state.positions[part.key]
        const links = state.edges
          .filter((edge) => nodeOf(edge.from) === part.key)
          .map((edge) => stepOf(nodeOf(edge.to)).label)
        return {
          role: "button",
          "aria-roledescription": "node",
          "aria-description": links.length
            ? `Connected to ${links.join(", ")}.`
            : undefined,
          tabindex: part.api.roving.tabIndex(state, part),
          "data-dragging": part.api.move.dragging(state, part.key)
            ? ""
            : undefined,
          style: `${css({
            position: "absolute",
            left: `${at.x}px`,
            top: `${at.y}px`,
            width: `${node.width}px`,
            height: `${node.height}px`,
            "touch-action": "none",
          })};${part.api.move.style(state, part.key) ?? ""}`,
        }
      },
      on: {
        keydown: (event, { el, api, key }) => api.nodeKeydown(event, el!, key),
        pointerdown: (event, { el, api, key }) =>
          api.move.pointerdown(event, key, el!),
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
    port: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ "aria-hidden": "true", style: "touch-action:none" }),
      live: live<FlowState, any, { value: string }>((state, { api, key }) => ({
        "data-connect": api.connect.role(state, key),
      })),
      on: {
        pointerdown: (event, { el, api, key }) => {
          event.stopPropagation()
          api.connect.pointerdown(event, key, el!)
        },
      },
    }),
    edge: slot<{ value: string; from: string; to: string }>({
      props: { value: "string", from: "string", to: "string" },
      attrs: (state, { props }) => ({
        d: curve(
          state,
          portPoint(state, props.from),
          portPoint(state, props.to)
        ),
      }),
    }),
    wire: slot({
      live: live<FlowState, any, {}>((state) => {
        const draft = state.connecting
        if (!draft) {
          return { d: "" }
        }
        return {
          d: curve(
            state,
            portPoint(state, draft.from),
            draft.to ? portPoint(state, draft.to) : draft
          ),
        }
      }),
    }),
  }),
})

const flowParts = createParts(flow, {
  root: "div",
  node: "div",
  port: "span",
  wire: "path",
})
const Flow = flowParts.Root
const FlowNode = flowParts.Node
const FlowPort = flowParts.Port
const FlowWire = flowParts.Wire

function FlowEdge({ edge, ...props }: { edge: Wire } & PartProps<"path">) {
  return usePart(
    flow,
    "edge",
    { value: `${edge.from}>${edge.to}`, from: edge.from, to: edge.to },
    props,
    "path"
  )
}

function order(edges: Wire[]) {
  const level: Record<string, number> = {}
  for (const step of steps) {
    if (!step.input) {
      level[step.value] = 0
    }
  }
  for (let pass = 0; pass < steps.length; pass++) {
    for (const edge of edges) {
      const from = level[nodeOf(edge.from)]
      if (from === undefined) {
        continue
      }
      const to = nodeOf(edge.to)
      level[to] = Math.max(level[to] ?? 0, from + 1)
    }
  }
  return level
}

const port =
  "absolute size-2.5 cursor-crosshair border border-foreground bg-background after:absolute after:-inset-2 data-[connect=candidate]:border-2 data-[connect=source]:bg-foreground data-[connect=target]:bg-foreground"

function FlowDemo() {
  const [edges, setEdges] = React.useState(wired)
  const [run, setRun] = React.useState<Record<string, "running" | "done">>({})
  const [frame, fit] = useFit(layouts.wide.world.width)
  const layout: Layout = fit * layouts.wide.world.width < 480 ? "tall" : "wide"
  const { world, vertical } = layouts[layout]
  const width = fit * layouts.wide.world.width
  const scale = layout === "tall" ? Math.min(1, width / world.width) : fit
  const timers = React.useRef<number[]>([])
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const level = order(edges)
  const sent = level.slack !== undefined
  const done = Object.values(run).filter((value) => value === "done").length
  const finished = done > 0 && done === Object.keys(level).length
  const go = () => {
    timers.current.forEach(clearTimeout)
    setRun({})
    const depth = Math.max(...Object.values(level))
    const keys = (at: number) =>
      Object.keys(level).filter((key) => level[key] === at)
    timers.current = Array.from({ length: depth + 1 }, (_, at) => [
      window.setTimeout(
        () =>
          setRun((current) => ({
            ...current,
            ...Object.fromEntries(keys(at).map((key) => [key, "running"])),
          })),
        at * 700 + 50
      ),
      window.setTimeout(
        () =>
          setRun((current) => ({
            ...current,
            ...Object.fromEntries(keys(at).map((key) => [key, "done"])),
          })),
        at * 700 + 650
      ),
    ]).flat()
  }
  const onEdgesChange = (value: Wire[]) => {
    setEdges(value)
    setRun({})
  }
  const status = finished
    ? sent
      ? "Posted a summary to #support"
      : "Nothing sent. Wire up Send to Slack."
    : Object.values(run).includes("running")
      ? "Running"
      : sent
        ? "Ready"
        : "Drag from Summarize to Send to Slack"
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <Title id="workflow" max={6.5} className="-ms-[0.05em]">
          Workflow.
        </Title>
        <div className="flex items-baseline gap-2">
          <Numeral className="text-[length:clamp(2rem,6cqi,3.5rem)]">
            {done}/{steps.length}
          </Numeral>
          <span className={cn(label, "text-muted-foreground")}>steps run</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={go} className={cn(press, action)}>
            Run
          </button>
          <span
            aria-live="polite"
            className={cn(label, "text-muted-foreground")}
          >
            {status}
          </span>
        </div>
        <div ref={frame} className={cn("overflow-hidden bg-background", ink)}>
          <div
            className="mx-auto"
            style={{ height: world.height * scale, width: world.width * scale }}
          >
            <div
              dir="ltr"
              style={{
                width: world.width,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              <Flow
                key={layout}
                layout={layout}
                edges={edges}
                onEdgesChange={onEdgesChange}
                scale={scale}
                aria-label="Workflow"
              >
                {({ edges: shown }) => (
                  <>
                    <svg
                      aria-hidden="true"
                      width={world.width}
                      height={world.height}
                      className="pointer-events-none absolute inset-0 overflow-visible fill-none"
                    >
                      {shown.map((edge) => (
                        <FlowEdge
                          key={`${edge.from}>${edge.to}`}
                          edge={edge}
                          className={cn(
                            "stroke-[1.5] transition-colors",
                            run[nodeOf(edge.from)] === "done"
                              ? "stroke-foreground [stroke-width:2.5]"
                              : "stroke-foreground"
                          )}
                        />
                      ))}
                      <FlowWire className="stroke-foreground stroke-[1.5] [stroke-dasharray:4_4]" />
                    </svg>
                    {steps.map((step) => {
                      const state = run[step.value]
                      return (
                        <FlowNode
                          key={step.value}
                          value={step.value}
                          aria-label={`${step.kind}, ${step.label}`}
                          className={cn(
                            "flex cursor-grab flex-col justify-center gap-1 bg-background px-3 transition-colors select-none data-dragging:cursor-grabbing",
                            ink,
                            ring,
                            state === "running" && "border-2 px-[11px]",
                            state === "done" && "bg-foreground text-background"
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                label,
                                state ? "opacity-80" : "text-muted-foreground"
                              )}
                            >
                              {step.kind}
                            </span>
                            {state === "running" && (
                              <span
                                aria-hidden="true"
                                className="size-1.5 animate-pulse bg-current"
                              />
                            )}
                            {state === "done" && (
                              <CheckIcon
                                aria-hidden="true"
                                className="size-3"
                              />
                            )}
                          </span>
                          <span className="text-[14px] font-medium">
                            {step.label}
                          </span>
                          {step.input && (
                            <FlowPort
                              value={`${step.value}:in`}
                              className={cn(
                                port,
                                vertical
                                  ? "-top-[5px] left-1/2 -translate-x-1/2"
                                  : "top-1/2 -left-[5px] -translate-y-1/2"
                              )}
                            />
                          )}
                          {step.output && (
                            <FlowPort
                              value={`${step.value}:out`}
                              className={cn(
                                port,
                                vertical
                                  ? "-bottom-[5px] left-1/2 -translate-x-1/2"
                                  : "top-1/2 -right-[5px] -translate-y-1/2"
                              )}
                            />
                          )}
                        </FlowNode>
                      )
                    })}
                  </>
                )}
              </Flow>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { AgentsDemo, FlowDemo }
