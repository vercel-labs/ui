"use client"

import {
  createAgent,
  type AgentComponent,
  type AgentStep,
} from "@ui-sdk/react/agent"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@ui-sdk/react/number-input"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon, MinusIcon, PlusIcon } from "lucide-react"
import * as React from "react"

const agent = typeof window === "undefined" ? undefined : createAgent()

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]"
const label = "font-mono text-[10px] tracking-[0.06em] uppercase"

const regions = [
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "North America" },
  { value: "asia-pacific", label: "Asia Pacific" },
]

const plans = ["Hobby", "Pro", "Team"]

const fields = ["Region", "Plan", "Instances", "Preview deployments"]

const prompt: { text: string; ref?: string }[] = [
  { text: "Move the project to Asia Pacific", ref: "Region" },
  { text: ", " },
  { text: "switch to Pro", ref: "Plan" },
  { text: ", " },
  { text: "run 3 instances", ref: "Instances" },
  { text: " and " },
  { text: "turn on preview deployments", ref: "Preview deployments" },
  { text: "." },
]

const steps: AgentStep[] = [
  { ref: "Region", action: "setValue", args: ["Asia Pacific"] },
  { ref: "Plan", action: "setValue", args: ["pro"] },
  { ref: "Instances", action: "setValue", args: [3] },
  { ref: "Preview deployments", action: "setChecked", args: [true] },
]

type Entry =
  | { type: "user" }
  | { type: "call"; code: string; lines: string[] }
  | { type: "act"; ref: string; code: string; lines: string[] }
  | { type: "note"; text: string }

function stateOf(component: AgentComponent) {
  if ("checked" in component) {
    return String(component.checked)
  }
  return JSON.stringify(component.value)
}

function Field({
  name,
  changed,
  active,
  children,
}: {
  name: string
  changed: boolean
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div
      data-field={name}
      className={cn(
        "flex flex-col gap-2 outline-offset-[6px] transition-[outline-color,outline-width] duration-300",
        active
          ? "outline-2 outline-solid outline-[#006bff]"
          : changed
            ? "outline-1 outline-dashed outline-[#006bff]"
            : "outline-1 outline-dashed outline-transparent"
      )}
    >
      {children}
    </div>
  )
}

function Settings({
  changed,
  active,
}: {
  changed: string[]
  active: string | null
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col gap-4 bg-background p-4 @[36rem]:gap-6 @[36rem]:p-8",
        ink
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-lg font-medium tracking-[-0.02em]">
          Project settings
        </span>
        <span className={cn(label, "text-muted-foreground")}>acme/web</span>
      </div>
      <Field
        name="Region"
        changed={changed.includes("Region")}
        active={active === "Region"}
      >
        <Select defaultValue="europe" items={regions}>
          <SelectLabel className={cn(label, "text-muted-foreground")}>
            Region
          </SelectLabel>
          <SelectTrigger
            className={cn(
              "flex h-11 w-full items-center justify-between gap-3 bg-background px-3 text-[15px]",
              ink,
              ring
            )}
          >
            <SelectValue />
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </SelectTrigger>
          <SelectContent className="max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto bg-background p-1 ring-1 ring-foreground outline-none">
            {regions.map((region) => (
              <SelectItem
                key={region.value}
                value={region.value}
                className="flex h-10 cursor-default items-center justify-between gap-3 px-3 text-[15px] outline-none select-none data-highlighted:bg-foreground data-highlighted:text-background"
              >
                {region.label}
                <SelectItemIndicator>
                  <CheckIcon aria-hidden="true" className="size-4" />
                </SelectItemIndicator>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field
        name="Plan"
        changed={changed.includes("Plan")}
        active={active === "Plan"}
      >
        <span aria-hidden="true" className={cn(label, "text-muted-foreground")}>
          Plan
        </span>
        <SegmentedControl
          aria-label="Plan"
          defaultValue="hobby"
          className={cn("relative grid grid-cols-3 bg-background", ink)}
        >
          <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) bg-foreground transition-[left,width] duration-200" />
          {plans.map((plan) => (
            <SegmentedControlItem
              key={plan}
              value={plan.toLowerCase()}
              className={cn(
                "relative h-10 text-[14px] text-muted-foreground transition-colors data-checked:text-background",
                ring
              )}
            >
              {plan}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Field>
      <Field
        name="Instances"
        changed={changed.includes("Instances")}
        active={active === "Instances"}
      >
        <span aria-hidden="true" className={cn(label, "text-muted-foreground")}>
          Instances
        </span>
        <NumberInput defaultValue={1} min={1} max={10}>
          <NumberInputGroup
            aria-label="Instances"
            className={cn(
              "flex h-11 w-full items-center bg-background",
              ink,
              "has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]"
            )}
          >
            <NumberInputDecrement
              aria-label="Fewer instances"
              className="flex h-full w-11 items-center justify-center border-e border-foreground outline-none hover:bg-foreground/[0.06] [&_svg]:size-4"
            >
              <MinusIcon aria-hidden="true" />
            </NumberInputDecrement>
            <NumberInputControl
              aria-label="Instances"
              className="w-full min-w-0 flex-1 bg-transparent text-center text-[15px] tabular-nums outline-none pointer-coarse:text-base"
            />
            <NumberInputIncrement
              aria-label="More instances"
              className="flex h-full w-11 items-center justify-center border-s border-foreground outline-none hover:bg-foreground/[0.06] [&_svg]:size-4"
            >
              <PlusIcon aria-hidden="true" />
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
      </Field>
      <Field
        name="Preview deployments"
        changed={changed.includes("Preview deployments")}
        active={active === "Preview deployments"}
      >
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px]">Preview deployments</span>
            <span className="hidden text-sm text-muted-foreground @[36rem]:inline">
              A link for every pull request.
            </span>
          </span>
          <Switch
            aria-label="Preview deployments"
            className={cn(
              "group/switch inline-flex h-5 w-9 shrink-0 items-center bg-background p-[3px] transition-colors data-checked:bg-foreground",
              ink,
              ring
            )}
          >
            <SwitchThumb className="size-3 bg-foreground transition-transform group-data-checked/switch:translate-x-4 group-data-checked/switch:bg-background rtl:group-data-checked/switch:-translate-x-4" />
          </Switch>
        </label>
      </Field>
    </div>
  )
}

function Prompt({
  active,
  changed,
}: {
  active: string | null
  changed: string[]
}) {
  return prompt.map((part, index) => (
    <span
      key={index}
      className={cn(
        "box-decoration-clone transition-colors duration-300",
        part.ref && active === part.ref && "bg-[#006bff] text-white",
        part.ref &&
          changed.includes(part.ref) &&
          active !== part.ref &&
          "underline decoration-[#006bff] decoration-dashed underline-offset-4"
      )}
    >
      {part.text}
    </span>
  ))
}

function OperateDemo() {
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [running, setRunning] = React.useState(false)
  const [changed, setChanged] = React.useState<string[]>([])
  const [active, setActive] = React.useState<string | null>(null)
  const [form, setForm] = React.useState(0)
  const timers = React.useRef<number[]>([])
  const log = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])
  React.useEffect(() => {
    const element = log.current
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [entries])
  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      timers.current.push(window.setTimeout(resolve, ms))
    })
  const sent = entries.length > 0
  const last = entries[entries.length - 1]
  const status = !last
    ? "Press Send and watch the form"
    : last.type === "user"
      ? "Reading the page"
      : last.type === "call"
        ? "agent.snapshot()"
        : last.type === "act"
          ? `agent.act(${last.ref})`
          : "Done. Four settings changed"
  const send = async () => {
    if (!agent || running || sent) {
      return
    }
    setRunning(true)
    setEntries([{ type: "user" }])
    await wait(600)
    const seen = agent
      .snapshot()
      .filter((component) => fields.includes(component.label ?? ""))
    setEntries((current) => [
      ...current,
      {
        type: "call",
        code: "snapshot()",
        lines: seen.map(
          (component) =>
            `${component.component} "${component.label}" ${stateOf(component)}`
        ),
      },
    ])
    await wait(900)
    for (const step of steps) {
      setActive(step.ref)
      setEntries((current) => [
        ...current,
        {
          type: "act",
          ref: step.ref,
          code: `act({ steps: [{ ref: "${step.ref}", action: "${step.action}", args: ${JSON.stringify(step.args ?? [])} }] })`,
          lines: [],
        },
      ])
      await wait(650)
      const result = await agent.act({ steps: [step] })
      const changes = result.steps.flatMap((entry) => entry.changes ?? [])
      setChanged((current) => [
        ...current,
        ...changes.map((change) => change.label ?? ""),
      ])
      setEntries((current) =>
        current.map((entry) =>
          entry.type === "act" && entry.ref === step.ref
            ? {
                ...entry,
                lines: changes.map(
                  (change) => `${change.key} → ${JSON.stringify(change.value)}`
                ),
              }
            : entry
        )
      )
      await wait(450)
    }
    setActive(null)
    await wait(300)
    setEntries((current) => [
      ...current,
      {
        type: "note",
        text: "I moved the project to Asia Pacific, switched it to Pro, set it to 3 instances and turned on preview deployments.",
      },
    ])
    setRunning(false)
  }
  const reset = () => {
    timers.current.forEach(clearTimeout)
    setRunning(false)
    setActive(null)
    setEntries([])
    setChanged([])
    setForm((current) => current + 1)
  }
  return (
    <>
      <div
        className={cn(
          "flex min-w-0 flex-col @max-[56rem]:border-0 @[56rem]:bg-background",
          ink
        )}
      >
        <div className="hidden h-10 items-center gap-4 border-b border-foreground px-4 @[56rem]:flex">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 border border-foreground" />
            <span className="size-2.5 border border-foreground" />
            <span className="size-2.5 border border-foreground" />
          </span>
          <span
            className={cn(
              label,
              "flex-1 truncate text-center text-muted-foreground"
            )}
          >
            acme/web · Settings
          </span>
          <span aria-hidden="true" className="w-[2.875rem]" />
        </div>
        <div className="grid gap-2 @[56rem]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @[56rem]:gap-0">
          <div className="order-2 flex min-w-0 flex-col @[56rem]:order-1 @[56rem]:h-[48rem] @[56rem]:border-e @[56rem]:border-foreground">
            <div className="hidden h-[3.25rem] items-center border-b border-foreground/15 px-4 @[56rem]:flex">
              <span className={cn(label, "text-muted-foreground")}>Agent</span>
            </div>
            <div
              ref={log}
              aria-live="polite"
              className="hidden min-h-0 flex-1 flex-col overflow-y-auto p-4 [scrollbar-width:thin] @[56rem]:flex"
            >
              <div className="mt-auto flex flex-col gap-3">
                {!sent && (
                  <p className="text-sm text-pretty text-muted-foreground">
                    Send the message below and watch the agent read the form and
                    fill it in.
                  </p>
                )}
                {entries.map((entry, index) =>
                  entry.type === "user" ? (
                    <p
                      key={index}
                      className="ms-6 bg-foreground px-3.5 py-2.5 text-[15px] leading-[1.45] text-pretty text-background"
                    >
                      <Prompt active={active} changed={changed} />
                    </p>
                  ) : entry.type === "note" ? (
                    <p key={index} className="text-[15px]">
                      {entry.text}
                    </p>
                  ) : (
                    <div
                      key={index}
                      className={cn(
                        "flex flex-col gap-1 border-s-2 ps-3 font-mono text-[11.5px] leading-[1.55] transition-colors duration-300",
                        entry.type === "act" && active === entry.ref
                          ? "border-[#006bff]"
                          : "border-foreground/20"
                      )}
                    >
                      <span
                        className={cn(
                          "w-fit box-decoration-clone break-words transition-colors duration-300",
                          entry.type === "act" &&
                            active === entry.ref &&
                            "bg-[#006bff] text-white"
                        )}
                      >
                        <span aria-hidden="true" className="opacity-50">
                          →{" "}
                        </span>
                        agent.{entry.code}
                      </span>
                      {entry.lines.length > 0 && (
                        <span className="whitespace-pre-wrap text-muted-foreground">
                          {entry.lines.join("\n")}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="@[56rem]:p-3">
              <div className="flex flex-col border border-foreground bg-foreground text-background">
                <p
                  className={cn(
                    "min-h-[4.5rem] p-4 text-[15px] leading-[1.45] text-pretty",
                    sent && "@[56rem]:text-background/40"
                  )}
                >
                  {sent ? (
                    <>
                      <span className="hidden @[56rem]:inline">
                        Ask the agent to change something
                      </span>
                      <span className="@[56rem]:hidden">
                        <Prompt active={active} changed={changed} />
                      </span>
                    </>
                  ) : (
                    <Prompt active={null} changed={[]} />
                  )}
                </p>
                <div className="flex items-center justify-end gap-3 border-t border-background/25 p-2">
                  <button
                    type="button"
                    onClick={sent && !running ? reset : send}
                    disabled={running}
                    className="inline-flex h-9 items-center gap-2.5 bg-background px-4 font-mono text-[12px] tracking-[0.06em] text-foreground uppercase transition-colors outline-none hover:bg-background/85 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] disabled:opacity-50"
                  >
                    {running ? "Working" : sent ? "Reset" : "Send"}
                  </button>
                </div>
              </div>
            </div>
            <p
              aria-live="polite"
              className="order-first flex h-7 items-center gap-2 font-mono text-[11px] text-muted-foreground @[56rem]:hidden"
            >
              <span aria-hidden="true">→</span>
              <span className="truncate">{status}</span>
            </p>
          </div>
          <div className="order-1 flex min-w-0 items-center justify-center @[36rem]:border @[36rem]:border-foreground @[36rem]:bg-background @[36rem]:bg-[radial-gradient(circle,color-mix(in_oklab,var(--foreground)_18%,transparent)_1px,transparent_1.5px)] @[36rem]:bg-size-[16px_16px] @[36rem]:p-10 @[56rem]:order-2 @[56rem]:border-0">
            <Settings key={form} changed={changed} active={active} />
          </div>
        </div>
      </div>
    </>
  )
}

export { OperateDemo }
