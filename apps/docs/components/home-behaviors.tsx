import { cn } from "cn"
import { Poster, Title } from "./home-posters"

const behaviors = [
  { name: "createRovingFocus", group: "Focus", body: "Arrow keys move through a list, with one Tab stop." },
  { name: "createTypeahead", group: "Focus", body: "Type a few letters to jump to an item." },
  { name: "createPopup", group: "Popups", body: "Opens next to its button and stays on screen." },
  {
    name: "createSelection",
    group: "Selection",
    body: "Pick one or many, with Shift and Ctrl like a file manager.",
  },
  { name: "createReorder", group: "Drag and drop", body: "Sort a list with a pointer or the keyboard." },
  { name: "createResize", group: "Moving and resizing", body: "Resize boxes from their handles." },
  { name: "createViewport", group: "Canvas", body: "Pan and zoom a canvas." },
  { name: "createVirtualizer", group: "Lists", body: "Renders only the rows you can see." },
]

function BehaviorsPoster({ fig }: { fig?: string }) {
  return (
    <Poster
      fig={fig}
      head={"A FEW OF THE BEHAVIORS\nTHE REST ARE IN THE DOCS"}
      tone="white"
      pattern="none"
      body="gap-12"
    >
      <ul className="grid border-t border-foreground @[40rem]:grid-cols-2 @[72rem]:grid-cols-4">
        {behaviors.map((behavior, index) => (
          <li
            key={behavior.name}
            className={cn(
              "grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 border-b border-foreground/15 py-4 @[40rem]:pe-6 @[72rem]:py-5",
              index > 3 && "@max-[40rem]:hidden",
            )}
          >
            <span
              aria-hidden="true"
              className="pt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
                {behavior.group}
              </span>
              <code className="truncate font-mono text-[15px] leading-tight">{behavior.name}</code>
              <span className="text-sm leading-snug text-pretty text-muted-foreground">{behavior.body}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <Title id="behaviors" max={8} className="-ms-[0.05em]">
          Behaviors.
        </Title>
      </div>
    </Poster>
  )
}

export { BehaviorsPoster }
