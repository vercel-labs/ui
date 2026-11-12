import { cn } from "cn"
import { Poster } from "./home-posters"

const behaviors = [
  {
    name: "createListbox",
    body: "Arrow keys move through options, and typing filters them.",
  },
  {
    name: "createTypeahead",
    body: "Type a few letters to jump to an item.",
  },
  {
    name: "createPopup",
    body: "Opens next to its button and stays on screen.",
  },
  {
    name: "createSelection",
    body: "Pick one or many, with Shift and Ctrl like a file manager.",
  },
  {
    name: "createReorder",
    body: "Sort a list with a pointer or the keyboard.",
  },
  {
    name: "createResize",
    body: "Resize boxes from their handles.",
  },
  { name: "createViewport", body: "Pan and zoom a canvas." },
  {
    name: "createVirtualizer",
    body: "Renders only the rows you can see.",
  },
]

function BehaviorsPoster() {
  return (
    <Poster tone="white" pattern="none" body="gap-10" className="lg:min-h-0!">
      <ul className="grid gap-x-4 @[40rem]:grid-cols-2 @[56rem]:grid-cols-4">
        {behaviors.map((behavior, index) => (
          <li
            key={behavior.name}
            className={cn(
              "flex flex-col gap-3 border-b border-foreground/15 pt-6 pb-8",
              index > 3 && "@max-[40rem]:hidden"
            )}
          >
            <span
              aria-hidden="true"
              className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <code className="truncate font-mono text-[15px] leading-tight">
                {behavior.name}
              </code>
              <span className="text-sm leading-snug text-pretty text-muted-foreground">
                {behavior.body}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <h2
          id="behaviors"
          className="scroll-mt-24 text-lg leading-[1.5] font-medium tracking-[-0.015em] text-pretty text-foreground sm:text-xl lg:text-2xl lg:leading-[1.45]"
        >
          We built 50+ behaviors for your agents.
        </h2>
      </div>
    </Poster>
  )
}

export { BehaviorsPoster }
