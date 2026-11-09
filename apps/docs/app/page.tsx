import { AskPoster } from "@/components/home-ask"
import { BehaviorsPoster } from "@/components/home-behaviors"
import { CopyPromptButton } from "@/components/copy-prompt"
import { OperatePoster } from "@/components/home-operate"
import { PhoneShot, PhoneStrip } from "@/components/home-more"
import { SelectBlueprint } from "@/components/home-select"
import { AgentsTile, FlowTile } from "@/components/home-agents"
import { SheetTile } from "@/components/home-sheet"
import { CanvasTile, TimelineTile } from "@/components/home-builds"
import { WeekTile } from "@/components/home-week"
import {
  AccordionTile,
  CalendarTile,
  ColorTile,
  CommandTile,
  NumberInputTile,
  Numeral,
  OTPTile,
  Poster,
  RatingTile,
  ResizableTile,
  SegmentedTile,
  SliderTile,
  StartPoster,
  SwitchTile,
  TabsTile,
  Title,
  TokenInputTile,
  ToolbarTile,
  TreeTile,
} from "@/components/home-posters"
import { Logo } from "@/components/logo"
import { MobileNav } from "@/components/mobile-nav"
import { Search } from "@/components/search"
import { sectionPages, sectionTree } from "@/lib/section-tree"
import { cn } from "cn"
import Link from "next/link"

const components = [
  { name: "Color Picker", Tile: ColorTile, phone: true },
  { name: "Token Input", Tile: TokenInputTile, phone: true },
  { name: "Calendar", Tile: CalendarTile, phone: true },
  { name: "Number Input", Tile: NumberInputTile, phone: true },
  { name: "Command", Tile: CommandTile, phone: true },
  { name: "Resizable", Tile: ResizableTile, phone: true },
  { name: "Switch", Tile: SwitchTile },
  { name: "Tabs", Tile: TabsTile },
  { name: "Slider", Tile: SliderTile },
  { name: "Accordion", Tile: AccordionTile },
  { name: "Rating", Tile: RatingTile },
  { name: "Tree", Tile: TreeTile },
  { name: "Segmented Control", Tile: SegmentedTile },
  { name: "OTP Input", Tile: OTPTile },
  { name: "Toolbar", Tile: ToolbarTile },
]

const builds = [
  { name: "Timeline", Tile: TimelineTile },
  { name: "Week", Tile: WeekTile },
  { name: "Agents", Tile: AgentsTile },
  { name: "Spreadsheet", Tile: SheetTile },
  { name: "Canvas", Tile: CanvasTile },
  { name: "Workflow", Tile: FlowTile },
]

const cross =
  "absolute top-0 size-[11px] before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-foreground after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-foreground"

function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative mb-4 h-[11px]", className)}>
      <span className="absolute inset-x-3.5 top-[5px] h-px bg-foreground" />
      <span className={cn(cross, "-start-[5px]")} />
      <span className={cn(cross, "-end-[5px]")} />
    </div>
  )
}

function fig(index: number) {
  return `FIG. ${String(index).padStart(2, "0")}`
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <Rule className="mt-20 sm:mt-28" />
      <div className="flex flex-col gap-4 pt-3 sm:gap-5 sm:pt-5">
        <h2 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-6xl sm:leading-[1.08] lg:text-7xl">
          {title}
        </h2>
        <p className="max-w-[50rem] text-lg leading-[1.5] tracking-[-0.015em] text-pretty text-foreground/70 sm:text-xl lg:text-2xl lg:leading-[1.45]">
          {children}
        </p>
      </div>
      <div aria-hidden="true" className="h-8 sm:h-10" />
    </>
  )
}

export default function HomePage() {
  const core = sectionTree("core")
  const pages = core ? sectionPages(core) : []

  return (
    <div className="relative flex flex-1 flex-col">
      <MobileNav registry={process.env.NPM_REGISTRY} />
      <Search pages={pages} />
      <main data-width="wide" className="container flex-1 pt-6 pb-24 sm:pt-10">
        <h1 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-6xl sm:leading-[1.08] lg:text-7xl">
          A library of behaviors for agents to build the next generation of user interfaces.
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 lg:grid-cols-2 lg:gap-4">
          <div className="flex flex-col gap-3 max-lg:contents lg:gap-4">
            <Poster
              fig="FIG. 01"
              head={"WHAT IS UI SDK?\nTHE SHORT VERSION"}
              tone="gray"
              pattern="rings"
              body="gap-10"
              className="flex-1"
            >
              <p className="-ms-[0.04em] text-[length:clamp(2.75rem,17cqi,6.5rem)] leading-[0.82] font-[450] tracking-[-0.06em]">
                /wait-what
              </p>
              <div className="flex max-w-[46rem] min-w-0 flex-col items-start gap-5 text-xl leading-[1.5] tracking-[-0.02em] text-pretty text-foreground 2xl:text-[1.375rem] [&_code]:border [&_code]:border-foreground/20 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8em] [&_code]:whitespace-nowrap [&_code]:text-foreground">
                <p className="text-2xl leading-[1.4] tracking-[-0.025em] sm:leading-[1.3] 2xl:text-[1.75rem]">
                  Say we give an agent a Select component. It can build a Select. Makes sense, right?
                </p>
                <p>
                  But what if, instead, we gave it the pieces that make up a Select? The popup (
                  <code>createPopup</code>), the list (<code>createListbox</code>), and finding an option by
                  typing (<code>createTypeahead</code>).
                </p>
                <p>
                  Now not only can it build a Select, but it can build an autocomplete, a combobox or even a
                  new component we haven’t thought of yet.
                </p>
                <p className="flex items-center gap-2">
                  That’s
                  <span className="flex items-center">
                    <Logo
                      role="img"
                      aria-hidden={false}
                      aria-label="UI SDK"
                      focusable="false"
                      className="inline-block h-[1em] w-auto"
                    />
                    .
                  </span>
                </p>
                <p>
                  We abstracted the complex interactions of user interfaces into reusable behaviors. And we
                  taught agents how to build and how to use them.
                </p>
              </div>
            </Poster>
            <div className="grid gap-3 max-lg:order-last sm:grid-cols-2 lg:gap-4">
              <Link
                href="/docs"
                className="group/docs flex h-16 items-center justify-between gap-4 bg-foreground px-6 text-xl font-[450] tracking-[-0.03em] whitespace-nowrap text-background transition-colors outline-none hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] sm:h-20 sm:px-8 sm:text-2xl"
              >
                Read the Docs
              </Link>
              <CopyPromptButton
                registry={process.env.NPM_REGISTRY}
                className="flex h-16 items-center justify-between gap-4 bg-[#006bff] px-6 text-start text-xl font-[450] tracking-[-0.03em] whitespace-nowrap text-white transition-colors outline-none hover:bg-[#0059d6] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] sm:h-20 sm:px-8 sm:text-2xl"
              >
                Copy Prompt
              </CopyPromptButton>
            </div>
          </div>
          <Poster
            fig="FIG. 02"
            head={"WHAT'S INSIDE A SELECT\nHOVER A PART TO FIND IT"}
            touch={"WHAT'S INSIDE A SELECT\nTAP A PART TO FIND IT"}
            tone="white"
            pattern="blueprint"
            body="justify-between gap-8"
          >
            <SelectBlueprint />
            <Title id="inside-a-select" max={20} className="-me-[0.05em] self-end text-end">
              Inside a Select.
            </Title>
          </Poster>
        </div>
        <Rule className="mt-20 sm:mt-28" />
        <div className="flex flex-col gap-4 pt-3 sm:gap-5 sm:pt-5">
          <h2 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-6xl sm:leading-[1.08] lg:text-7xl">
            Behaviors? What are those?
          </h2>
          <p className="max-w-[50rem] text-lg leading-[1.5] tracking-[-0.015em] text-pretty text-foreground/70 sm:text-xl lg:text-2xl lg:leading-[1.45]">
            They are the pieces that make a component work: keyboard navigation, focus, selection, popups, drag
            and drop, and screen reader support.
          </p>
        </div>
        <div className="mt-8 sm:mt-10">
          <BehaviorsPoster fig={fig(3)} />
        </div>
        <Rule className="mt-20 sm:mt-28" />
        <div className="flex flex-col gap-4 pt-3 sm:gap-5 sm:pt-5">
          <h2 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-6xl sm:leading-[1.08] lg:text-7xl">
            How do I use behaviors <br className="hidden sm:inline" />
            to build components?
          </h2>
          <p className="max-w-[50rem] text-lg leading-[1.5] tracking-[-0.015em] text-pretty text-foreground/70 sm:text-xl lg:text-2xl lg:leading-[1.45]">
            You don’t. Ask your agent. We made them really good at it. The agent picks the behaviors it needs and
            puts them together in your framework.
          </p>
        </div>
        <div className="mt-8 sm:mt-10">
          <AskPoster fig={fig(4)} />
        </div>
        <Section
          title={
            <>
              We built a component library <br className="hidden sm:inline" />
              to get you started.
            </>
          }
        >
          Every component is made from the same behaviors and works in React, Vue, Svelte, Solid and Web
          Components.
        </Section>
        <PhoneStrip
          names={components.filter((item) => item.phone).map((item) => item.name)}
          className="relative grid grid-cols-1 gap-3 max-sm:-mx-6 max-sm:flex max-sm:gap-6 max-sm:snap-x max-sm:snap-mandatory max-sm:-my-2 max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:overscroll-x-contain max-sm:px-6 max-sm:py-2 max-sm:[scrollbar-width:none] lg:grid-cols-2 lg:gap-4 min-[90rem]:grid-cols-3"
        >
          {components.map((item, index) => (
            <item.Tile
              key={item.name}
              fig={fig(index + 5)}
              className={cn(
                "max-sm:w-[calc(100vw-5rem)] max-sm:shrink-0 max-sm:snap-center max-sm:gap-8",
                !item.phone && "max-sm:hidden",
                index === components.length - 1 && "lg:col-span-2 min-[90rem]:col-span-1",
              )}
            />
          ))}
        </PhoneStrip>
        <Section
          title={
            <>
              We taught agents to generate <br className="hidden sm:inline" />
              any interface from behaviors.
            </>
          }
        >
          Add the UI SDK skill to your agent. It learns all the behaviors and how they fit together. It writes
          less code and gets more of it right.
        </Section>
        <PhoneStrip
          names={builds.map((item) => item.name)}
          className="relative grid grid-cols-1 gap-3 max-sm:-mx-6 max-sm:flex max-sm:gap-6 max-sm:snap-x max-sm:snap-mandatory max-sm:-my-2 max-sm:items-start max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:overscroll-x-contain max-sm:px-6 max-sm:py-2 max-sm:[scrollbar-width:none] lg:grid-cols-2 lg:gap-4"
        >
          {builds.map((item, index) => (
            <PhoneShot key={item.name} width={720}>
              <item.Tile fig={fig(index + components.length + 5)} />
            </PhoneShot>
          ))}
        </PhoneStrip>
        <Rule className="mt-20 sm:mt-28" />
        <div className="flex flex-col gap-4 pt-3 sm:gap-5 sm:pt-5">
          <h2 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-6xl sm:leading-[1.08] lg:text-7xl">
            And we made them really good <br className="hidden sm:inline" />
            at using what they build.
          </h2>
          <p className="max-w-[50rem] text-lg leading-[1.5] tracking-[-0.015em] text-pretty text-foreground/70 sm:text-xl lg:text-2xl lg:leading-[1.45]">
            They read the page and work the controls directly, without screenshots. That makes them more than
            twice as fast, at less than half the cost.
          </p>
        </div>
        <div className="mt-8 sm:mt-10">
          <OperatePoster fig={fig(components.length + builds.length + 5)} />
        </div>
        <div className="mt-3 lg:mt-4">
          <StartPoster fig={fig(components.length + builds.length + 6)} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:mt-4 lg:gap-4">
          <Link
            href="/docs/components"
            className="flex h-16 items-center bg-foreground px-6 text-xl font-[450] tracking-[-0.03em] whitespace-nowrap text-background transition-colors outline-none hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] sm:h-20 sm:px-8 sm:text-2xl"
          >
            Browse Components
          </Link>
          <CopyPromptButton
            registry={process.env.NPM_REGISTRY}
            className="flex h-16 items-center justify-between gap-4 bg-[#006bff] px-6 text-start text-xl font-[450] tracking-[-0.03em] whitespace-nowrap text-white transition-colors outline-none hover:bg-[#0059d6] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] sm:h-20 sm:px-8 sm:text-2xl"
          >
            Copy Prompt
          </CopyPromptButton>
        </div>
      </main>
    </div>
  )
}
