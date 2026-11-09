"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import * as React from "react"
import {
  PeoplePicker,
  PeoplePickerContent,
  PeoplePickerOption,
  PeoplePickerTrigger,
} from "./home-people-picker"
import { Poster } from "./home-posters"

const ink = "border border-foreground"
const label = "font-mono text-[11px] tracking-[0.06em] uppercase"

const prompt =
  "Build me a picker for assigning a teammate. I want to jump to someone by typing their name, use the arrow keys, and have it close when I click away."

const behaviors = [
  { name: "createPopup", body: "Opens next to the button, stays on screen, closes on Escape or a click outside." },
  { name: "createRovingFocus", body: "Moves between people with the arrow keys, with one Tab stop for the list." },
  { name: "createTypeahead", body: "Jumps to the person whose name you start typing." },
  { name: "createSelection", body: "Remembers who you picked and marks them as selected." },
]

const excerpt: { text: string; behavior?: string }[] = [
  { text: "const peoplePicker = definePrimitive({" },
  { text: '  name: "people-picker",' },
  { text: "  api: (context) => {" },
  { text: "    const change = createChange(context)" },
  { text: "    const popup = createPopup(context, { preset: popoverPreset })", behavior: "createPopup" },
  { text: '    const roving = createRovingFocus(context, { slot: "option", key: "stop" })', behavior: "createRovingFocus" },
  { text: "    const typeahead = createTypeahead()", behavior: "createTypeahead" },
  { text: "    const selection = createSelection(context, {", behavior: "createSelection" },
  { text: '      key: "value",', behavior: "createSelection" },
  { text: '      set: (value, details) => change("value", value, details),', behavior: "createSelection" },
  { text: "    })", behavior: "createSelection" },
  { text: "    return { ...popup, roving, typeahead, selection }" },
  { text: "  }," },
  { text: "  slots: (slot) => ({" },
  { text: "    trigger: popupTrigger(slot),", behavior: "createPopup" },
  { text: "    content: popupContent(slot),", behavior: "createPopup" },
  { text: "    option: slot({ bind: (el, part) => part.api.roving.bind(el, part) }),", behavior: "createRovingFocus" },
  { text: "  }),", },
  { text: "})" },
]

function Glyph({ name }: { name: string }) {
  const stroke = "stroke-foreground fill-none"
  return (
    <svg aria-hidden="true" viewBox="0 0 96 56" className="hidden h-12 w-20 shrink-0 overflow-visible @[30rem]:block @[64rem]:h-16 @[64rem]:w-28">
      {name === "createPopup" && (
        <>
          <rect x={8} y={4} width={80} height={14} className={cn(stroke, "fill-background")} />
          <path d="M76,9 l3,3 l3,-3" className={stroke} />
          <rect x={8} y={22} width={80} height={30} className={cn(stroke, "fill-background")} />
          <rect x={11} y={25} width={74} height={9} className="fill-foreground" />
        </>
      )}
      {name === "createTypeahead" &&
        ["G", "R", "A"].map((key, index) => (
          <g key={key}>
            <rect x={14 + index * 24} y={14} width={20} height={20} className={cn(stroke, "fill-background")} />
            <text x={24 + index * 24} y={28} textAnchor="middle" className="fill-foreground font-mono text-[10px]">
              {key}
            </text>
          </g>
        ))}
      {name === "createRovingFocus" &&
        ["↑", "↓"].map((key, index) => (
          <g key={key}>
            <rect x={24 + index * 26} y={16} width={22} height={22} className={cn(stroke, "fill-background")} />
            <text x={35 + index * 26} y={31} textAnchor="middle" className="fill-foreground font-mono text-[11px]">
              {key}
            </text>
          </g>
        ))}
      {name === "createSelection" &&
        [0, 1, 2].map((row) => (
          <g key={row}>
            <path d={`M8,${10 + row * 18} H64`} className={cn(stroke, row === 1 ? "" : "stroke-foreground/30")} />
            {row === 1 && <path d="M74,28 l4,4 l8,-9" className={cn(stroke, "[stroke-width:1.5]")} />}
          </g>
        ))}
    </svg>
  )
}


const code = [
  {
    "value": "react",
    "label": "React",
    "parts": {
      "name": "people-picker.ts",
      "code": "import { createParts } from \"@ui-sdk/react/primitive\"\n\nconst {\n  Root: PeoplePicker,\n  Trigger: PeoplePickerTrigger,\n  Content: PeoplePickerContent,\n  Option: PeoplePickerOption,\n} = createParts(peoplePicker, {\n  trigger: \"button\",\n  content: \"div\",\n  option: \"div\",\n})"
    },
    "usage": {
      "name": "assign-task.tsx",
      "code": "<PeoplePicker>\n  <PeoplePickerTrigger>Assign to</PeoplePickerTrigger>\n  <PeoplePickerContent>\n    {people.map((person) => (\n      <PeoplePickerOption key={person.value} value={person.value}>\n        {person.label}\n      </PeoplePickerOption>\n    ))}\n  </PeoplePickerContent>\n</PeoplePicker>"
    }
  },
  {
    "value": "vue",
    "label": "Vue",
    "parts": {
      "name": "people-picker.ts",
      "code": "import { createParts } from \"@ui-sdk/vue/primitive\"\n\nconst {\n  Root: PeoplePicker,\n  Trigger: PeoplePickerTrigger,\n  Content: PeoplePickerContent,\n  Option: PeoplePickerOption,\n} = createParts(peoplePicker, {\n  trigger: \"button\",\n  content: \"div\",\n  option: \"div\",\n})"
    },
    "usage": {
      "name": "AssignTask.vue",
      "code": "<PeoplePicker>\n  <PeoplePickerTrigger>Assign to</PeoplePickerTrigger>\n  <PeoplePickerContent>\n    <PeoplePickerOption v-for=\"person in people\" :key=\"person.value\" :value=\"person.value\">\n      {{ person.label }}\n    </PeoplePickerOption>\n  </PeoplePickerContent>\n</PeoplePicker>"
    }
  },
  {
    "value": "svelte",
    "label": "Svelte",
    "parts": {
      "name": "people-picker.ts",
      "code": "import { createParts } from \"@ui-sdk/svelte/primitive\"\n\nconst {\n  Root: PeoplePicker,\n  Trigger: PeoplePickerTrigger,\n  Content: PeoplePickerContent,\n  Option: PeoplePickerOption,\n} = createParts(peoplePicker, {\n  trigger: \"button\",\n  content: \"div\",\n  option: \"div\",\n})"
    },
    "usage": {
      "name": "AssignTask.svelte",
      "code": "<PeoplePicker>\n  <PeoplePickerTrigger>Assign to</PeoplePickerTrigger>\n  <PeoplePickerContent>\n    {#each people as person (person.value)}\n      <PeoplePickerOption value={person.value}>{person.label}</PeoplePickerOption>\n    {/each}\n  </PeoplePickerContent>\n</PeoplePicker>"
    }
  },
  {
    "value": "solid",
    "label": "Solid",
    "parts": {
      "name": "people-picker.ts",
      "code": "import { createParts } from \"@ui-sdk/solid/primitive\"\n\nconst {\n  Root: PeoplePicker,\n  Trigger: PeoplePickerTrigger,\n  Content: PeoplePickerContent,\n  Option: PeoplePickerOption,\n} = createParts(peoplePicker, {\n  trigger: \"button\",\n  content: \"div\",\n  option: \"div\",\n})"
    },
    "usage": {
      "name": "assign-task.tsx",
      "code": "<PeoplePicker>\n  <PeoplePickerTrigger>Assign to</PeoplePickerTrigger>\n  <PeoplePickerContent>\n    <For each={people}>\n      {(person) => <PeoplePickerOption value={person.value}>{person.label}</PeoplePickerOption>}\n    </For>\n  </PeoplePickerContent>\n</PeoplePicker>"
    }
  },
  {
    "value": "web",
    "label": "Web Components",
    "parts": {
      "name": "people-picker.ts",
      "code": "import { createParts, wrappedButton } from \"@ui-sdk/web\"\n\ncreateParts(peoplePicker, {\n  root: \"people-picker\",\n  trigger: { tag: \"people-picker-trigger\", target: wrappedButton },\n  content: \"people-picker-content\",\n  option: \"people-picker-option\",\n})"
    },
    "usage": {
      "name": "index.html",
      "code": "<people-picker>\n  <people-picker-trigger>\n    <button>Assign to</button>\n  </people-picker-trigger>\n  <people-picker-content>\n    <people-picker-option value=\"ada\">Ada Lovelace</people-picker-option>\n    <people-picker-option value=\"grace\">Grace Hopper</people-picker-option>\n  </people-picker-content>\n</people-picker>"
    }
  }
]

const people = [
  { value: "ada", label: "Ada Lovelace", role: "Design" },
  { value: "alan", label: "Alan Turing", role: "Engineering" },
  { value: "grace", label: "Grace Hopper", role: "Engineering" },
  { value: "hedy", label: "Hedy Lamarr", role: "Research" },
  { value: "katherine", label: "Katherine Johnson", role: "Data" },
  { value: "margaret", label: "Margaret Hamilton", role: "Engineering" },
]

function Step({
  index,
  title,
  active,
  next,
  last = false,
  children,
}: {
  index: number
  title: string
  active: boolean
  next?: boolean
  last?: boolean
  children: React.ReactNode
}) {
  const number = cn(
    label,
    "flex size-7 shrink-0 items-center justify-center border border-foreground bg-background tabular-nums transition-colors duration-300 @[40rem]:size-10",
    active && "bg-foreground text-background",
  )
  return (
    <li className="grid grid-cols-1 @[40rem]:grid-cols-[2.5rem_minmax(0,1fr)] @[40rem]:gap-x-8">
      <div className="hidden flex-col items-center @[40rem]:flex">
        <span className={number}>{index}</span>
        {!last && (
          <span
            aria-hidden="true"
            className={cn("w-px flex-1 transition-colors duration-300", next ? "bg-foreground" : "bg-foreground/20")}
          />
        )}
      </div>
      <div className={cn("flex min-w-0 flex-col gap-6", !last && "pb-12 @[40rem]:pb-16")}>
        <h3
          className={cn(
            "flex min-h-7 items-start gap-3 text-2xl leading-tight font-[450] tracking-[-0.035em] text-balance transition-opacity duration-300 @[40rem]:min-h-10 @[40rem]:items-center @[40rem]:text-4xl",
            !active && "opacity-40",
          )}
        >
          <span className={cn(number, "mt-0.5 @[40rem]:hidden")}>{index}</span>
          {title}
        </h3>
        {children}
      </div>
    </li>
  )
}

function Picker() {
  const [value, setValue] = React.useState(["grace"])
  const assignee = people.find((person) => person.value === value[0])
  return (
    <div className="flex flex-col gap-2">
      <span className={cn(label, "text-muted-foreground")}>Assign to</span>
      <PeoplePicker value={value} onValueChange={setValue}>
        <PeoplePickerTrigger
          className={cn(
            "flex h-12 w-full items-center gap-3 bg-background px-3 text-start text-base outline-none hover:bg-foreground/[0.03] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]",
            ink,
          )}
        >
          <span className="flex-1 truncate">{assignee?.label ?? "Pick someone"}</span>
          <ChevronDownIcon aria-hidden="true" className="size-4" />
        </PeoplePickerTrigger>
        <PeoplePickerContent className="max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto bg-background p-1 ring-1 ring-foreground outline-none">
          {people.map((person) => (
            <PeoplePickerOption
              key={person.value}
              value={person.value}
              className="group/option flex h-11 cursor-default items-center gap-3 px-2 text-[15px] outline-none select-none hover:bg-foreground/[0.06] focus:bg-foreground focus:text-background"
            >
              <span className="flex-1">{person.label}</span>
              <span className="font-mono text-[10px] tracking-[0.06em] uppercase opacity-60">{person.role}</span>
              <CheckIcon aria-hidden="true" className="invisible size-4 group-aria-selected/option:visible" />
            </PeoplePickerOption>
          ))}
        </PeoplePickerContent>
      </PeoplePicker>
    </div>
  )
}

const tab =
  "h-10 shrink-0 px-3 font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase transition-colors outline-none select-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[#006bff] data-selected:bg-foreground data-selected:text-background"

const panelHeight = (lines: number) => `calc(${lines} * 1.6 * 13px + 8.5rem + 1px)`

function Code({
  lines,
  framework,
  onFrameworkChange,
}: {
  lines: number
  framework: string
  onFrameworkChange: (value: string) => void
}) {
  return (
    <Tabs
      value={framework}
      onValueChange={(value) => onFrameworkChange(String(value))}
      className={cn("flex min-w-0 flex-col bg-background", ink)}
    >
      <TabsList className="flex overflow-x-auto border-b border-foreground [scrollbar-width:none]">
        {code.map((entry) => (
          <TabsTab key={entry.value} value={entry.value} className={tab}>
            {entry.label === "Web Components" ? (
              <>
                Web<span className="hidden @[30rem]:inline"> Components</span>
              </>
            ) : (
              entry.label
            )}
          </TabsTab>
        ))}
      </TabsList>
      {code.map((entry) => (
        <TabsPanel
          key={entry.value}
          value={entry.value}
          className="overflow-x-auto overflow-y-hidden outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[#006bff]"
          style={{ height: panelHeight(lines) }}
        >
          {([entry.parts, entry.usage] as const).map((part, index) => (
            <div key={part.name} className={cn(index > 0 && "border-t border-foreground/15")}>
              <p className="px-4 pt-4 font-mono text-[11px] text-muted-foreground">{part.name}</p>
              <pre className="p-4 font-mono text-[13px] leading-[1.6]">
                <code>{part.code}</code>
              </pre>
            </div>
          ))}
        </TabsPanel>
      ))}
    </Tabs>
  )
}

function PromptCard({ building, onSend, className }: { building: boolean; onSend: () => void; className?: string }) {
  return (
    <div className={cn("flex max-w-3xl flex-col border border-foreground bg-foreground text-background", className)}>
      <p className="flex-1 p-5 text-lg leading-[1.5] tracking-[-0.015em] text-pretty @[40rem]:p-7 @[40rem]:text-2xl @[40rem]:leading-[1.4]">
        {prompt}
        <span
          aria-hidden="true"
          className={cn(
            "ms-1 inline-block h-[1em] w-2 translate-y-[0.15em] bg-background",
            building ? "opacity-0" : "animate-caret-blink",
          )}
        />
      </p>
      <div className="flex items-center justify-between gap-3 border-t border-background/25 p-3 ps-5 @[40rem]:ps-7">
        <span aria-live="polite" className={cn(label, "min-w-0 truncate text-background/60")}>
          {building ? "Building..." : "Press Send to try it"}
        </span>
        <button
          type="button"
          onClick={onSend}
          className="inline-flex h-11 shrink-0 items-center gap-3 bg-background px-4 @[26rem]:px-5 font-mono text-[13px] tracking-[0.06em] text-foreground uppercase transition-colors outline-none hover:bg-background/85 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function Behaviors({
  step,
  lit,
  onHover,
}: {
  step: number
  lit: string | null | undefined
  onHover: React.Dispatch<React.SetStateAction<string | null>>
}) {
  return (
    <ul className="grid gap-px border border-foreground bg-foreground @[40rem]:grid-cols-2 @[64rem]:gap-3 @[64rem]:border-0 @[64rem]:bg-transparent">
      {behaviors.map((behavior, index) => (
        <li
          key={behavior.name}
          onPointerEnter={(event) => event.pointerType === "mouse" && onHover(behavior.name)}
          onPointerLeave={(event) => event.pointerType === "mouse" && onHover(null)}
          onClick={() => onHover((current) => (current === behavior.name ? null : behavior.name))}
          className={cn(
            "flex cursor-default items-center gap-4 bg-background p-4 transition-shadow duration-300 [&>*]:transition-[opacity,translate] [&>*]:duration-300 @[64rem]:flex-col @[64rem]:items-start @[64rem]:p-5 @[64rem]:outline @[64rem]:outline-foreground",
            lit === behavior.name && "shadow-[inset_0_0_0_2px_#006bff] [&_code]:text-[#006bff]",
            !(step >= 1 && step * 1.5 > index) && "[&>*]:translate-y-1 [&>*]:opacity-25",
          )}
        >
          <Glyph name={behavior.name} />
          <span className="flex min-w-0 flex-col gap-1">
            <code className="font-mono text-[15px] @[64rem]:text-base">{behavior.name}</code>
            <span className="text-sm leading-[1.45] text-pretty text-muted-foreground @[64rem]:text-[15px] @[64rem]:leading-[1.5]">
              {behavior.body}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function Result() {
  return (
    <div className={cn("flex min-h-72 flex-col justify-center bg-background p-5 @[36rem]:p-10", ink)}>
      <Picker />
    </div>
  )
}

const views = [
  { value: "ask", label: "Ask", title: "You ask your agent for a picker." },
  { value: "behaviors", label: "Build", title: "It builds one from behaviors." },
  { value: "component", label: "Component", title: "You get a new component." },
] as const

type View = (typeof views)[number]["value"]

function AskPoster({ fig }: { fig?: string }) {
  const [step, setStep] = React.useState(4)
  const [view, setView] = React.useState<View>("ask")
  const [framework, setFramework] = React.useState("react")
  const [hovered, setHovered] = React.useState<string | null>(null)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const building = step < 4
  const lit = hovered ?? (step >= 1 && step < 4 ? behaviors[Math.min(Math.floor(step * 1.5) - 1, 3)]?.name : null)
  const send = () => {
    timers.current.forEach(clearTimeout)
    setStep(0)
    timers.current = [1, 2, 3, 4].map((next) => setTimeout(() => setStep(next), next * 700))
  }
  const sendOnPhone = () => {
    send()
    setView("behaviors")
    timers.current.push(setTimeout(() => setView("component"), 4 * 700 + 900))
  }
  const current = views.find((entry) => entry.value === view)!
  return (
    <Poster
      fig={fig}
      head={"ASKING YOUR AGENT\nFOR A NEW COMPONENT"}
      tone="white"
      pattern="grid"
      body="gap-10"
      className="lg:min-h-0"
    >
      <div className="flex flex-col gap-6 @[40rem]:hidden">
        <div role="group" aria-label="Steps" className={cn("grid grid-cols-3", ink)}>
          {views.map((entry, index) => (
            <button
              key={entry.value}
              type="button"
              aria-pressed={view === entry.value}
              onClick={() => {
                timers.current.forEach(clearTimeout)
                setStep(4)
                setView(entry.value)
              }}
              className={cn(
                label,
                "flex h-10 items-center justify-center gap-1.5 border-s border-foreground text-muted-foreground transition-colors outline-none first:border-s-0 focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[#006bff] aria-pressed:bg-foreground aria-pressed:text-background",
              )}
            >
              <span className="tabular-nums opacity-60">{index + 1}</span>
              {entry.label}
            </button>
          ))}
        </div>
        <div className="flex min-h-[30rem] flex-col gap-5">
          <h3 aria-live="polite" className="text-2xl leading-tight font-[450] tracking-[-0.035em] text-balance">
            {current.title}
          </h3>
          {view === "ask" && <PromptCard building={building} onSend={sendOnPhone} className="flex-1" />}
          {view === "behaviors" && <Behaviors step={step} lit={lit} onHover={setHovered} />}
          {view === "component" && <Result />}
        </div>
      </div>
      <ol className="hidden flex-col @[40rem]:flex">
        <Step index={1} title="You ask your agent for a picker." active next={step >= 1}>
          <PromptCard building={building} onSend={send} />
        </Step>
        <Step index={2} title="It builds one from behaviors." active={step >= 1} next={step >= 4}>
          <div className="grid @[64rem]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] @[64rem]:gap-6">
            <Behaviors step={step} lit={lit} onHover={setHovered} />
            <div className={cn(ink, "flex min-w-0 flex-col border-t-0 bg-background @[64rem]:border-t")}>
              <div className="flex h-10 items-center justify-between gap-3 border-b border-foreground px-4">
                <span className="font-mono text-[11px] whitespace-nowrap text-muted-foreground">people-picker.ts</span>
                <span className={cn(label, "hidden whitespace-nowrap text-muted-foreground @[30rem]:inline")}>
                  The important part
                </span>
              </div>
              <pre className="overflow-x-auto py-4 font-mono text-[12px] leading-[1.6] [scrollbar-width:none] @[40rem]:text-[13px]">
                <code className="block min-w-fit">
                  {excerpt.map((line, index) => (
                    <span
                      key={index}
                      className={cn(
                        "block px-4 transition-colors duration-200",
                        line.behavior && lit === line.behavior && "bg-[#006bff] text-white",
                        line.behavior && lit && lit !== line.behavior && "opacity-60",
                      )}
                    >
                      {line.text || " "}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </Step>
        <Step index={3} title="You get a new component, in your framework." active={step >= 4} last>
          {step < 4 ? (
            <Placeholder lines={22} />
          ) : (
            <div className="grid gap-4 @[64rem]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @[64rem]:gap-6">
              <Result />
              <Code lines={22} framework={framework} onFrameworkChange={setFramework} />
            </div>
          )}
        </Step>
      </ol>
    </Poster>
  )
}

function Placeholder({ lines }: { lines: number }) {
  return (
    <div
      className="flex items-center justify-center border border-dashed border-foreground/40"
      style={{ height: `calc(${panelHeight(lines)} + 2.5rem + 2px)` }}
    >
      <span className={cn(label, "text-muted-foreground")}>Putting it together</span>
    </div>
  )
}

export { AskPoster }
