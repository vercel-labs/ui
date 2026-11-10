"use client"

import { cn } from "cn"
import * as React from "react"

function PhoneMore({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const reveal = () => {
      const target =
        location.hash &&
        ref.current?.querySelector(
          `[id="${CSS.escape(location.hash.slice(1))}"]`
        )
      if (!target || target.getClientRects().length) {
        return
      }
      setOpen(true)
      requestAnimationFrame(() => target.scrollIntoView())
    }
    reveal()
    window.addEventListener("hashchange", reveal)
    return () => window.removeEventListener("hashchange", reveal)
  }, [])

  return (
    <div
      ref={ref}
      data-more=""
      data-open={open ? "" : undefined}
      className="flex flex-col gap-3"
    >
      {children}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 border border-foreground bg-background font-mono text-[12px] tracking-[0.06em] uppercase transition-colors outline-none hover:bg-foreground/[0.06] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] sm:hidden"
          )}
        >
          {label}
        </button>
      )}
    </div>
  )
}

function PhoneStrip({
  names,
  className,
  children,
}: {
  names: string[]
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const current = React.useRef(0)

  const onScroll = () => {
    const element = ref.current
    if (!element) {
      return
    }
    const center = element.scrollLeft + element.clientWidth / 2
    const cards = ([...element.children] as HTMLElement[]).filter(
      (card) => card.offsetParent
    )
    const distance = (card: HTMLElement) =>
      Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
    const next = cards.indexOf(
      cards.reduce((best, card) =>
        distance(card) < distance(best) ? card : best
      )
    )
    if (next === current.current) {
      return
    }
    current.current = next
    setIndex(next)
  }

  const go = (next: number) => {
    const element = ref.current
    const card =
      element &&
      ([...element.children] as HTMLElement[]).filter(
        (card) => card.offsetParent
      )[next]
    if (!element || !card) {
      return
    }
    element.scrollTo({
      left: card.offsetLeft - (element.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    })
  }

  const advance = () => {
    if (index === names.length - 1) {
      setPlaying(false)
    } else {
      go(index + 1)
    }
  }

  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={() => setPlaying(false)}
        className={className}
      >
        {children}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
        <div className="flex h-10 items-center bg-foreground/[0.06] px-[7px]">
          {names.map((name, position) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              aria-current={position === index ? "true" : undefined}
              onClick={() => {
                setPlaying(false)
                go(position)
              }}
              className="group flex h-6 items-center px-[9px] outline-none"
            >
              <span className="relative h-1.5 w-1.5 overflow-hidden bg-foreground/25 transition-[width] duration-300 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[#006bff] group-aria-[current=true]:w-6">
                {position === index && (
                  <span
                    key={`${index}-${playing}`}
                    onAnimationEnd={advance}
                    className="absolute inset-y-0 start-0 w-full origin-left bg-foreground rtl:origin-right"
                    style={
                      playing
                        ? { animation: "strip-fill 4s linear forwards" }
                        : undefined
                    }
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (!playing && index === names.length - 1) {
              go(0)
            }
            setPlaying(!playing)
          }}
          className="relative grid h-10 place-items-center bg-foreground/[0.06] px-4 text-[13px] font-medium transition-colors outline-none hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff] *:[grid-area:1/1]"
        >
          <span className={playing ? "invisible" : undefined}>Play</span>
          <span className={playing ? undefined : "invisible"}>Pause</span>
        </button>
      </div>
    </>
  )
}

let shotObserver: ResizeObserver | undefined
const shots = new Map<Element, () => () => void>()

// Every shot reads its size before any shot writes, since each write restyles
// a whole shot and would make the next read lay out again.
function resizeShots(entries: ResizeObserverEntry[]) {
  const resized = new Set<() => () => void>()
  for (const entry of entries) {
    const measure = shots.get(entry.target)
    if (measure) {
      resized.add(measure)
    }
  }
  const writes = [...resized].map((measure) => measure())
  for (const write of writes) {
    write()
  }
}

function PhoneShot({
  width,
  children,
}: {
  width: number
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inner = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = ref.current
    const shot = inner.current
    if (!element || !shot) {
      return
    }
    const phone = matchMedia("(width < 40rem)")
    const measure = () => {
      const isPhone = phone.matches
      const scale = isPhone ? element.clientWidth / width : 1
      const height = isPhone ? shot.offsetHeight * scale : 0
      return () => {
        if (shot.inert !== isPhone) {
          shot.inert = isPhone
        }
        if (isPhone) {
          element.style.setProperty("--shot-scale", String(scale))
          element.style.setProperty("--shot-height", `${height}px`)
        }
      }
    }
    const update = () => measure()()
    shotObserver ??= new ResizeObserver(resizeShots)
    shots.set(element, measure)
    shots.set(shot, measure)
    shotObserver.observe(element)
    shotObserver.observe(shot)
    phone.addEventListener("change", update)
    return () => {
      shotObserver?.unobserve(element)
      shotObserver?.unobserve(shot)
      shots.delete(element)
      shots.delete(shot)
      phone.removeEventListener("change", update)
    }
  }, [width])

  return (
    <div
      ref={ref}
      className="sm:contents max-sm:h-(--shot-height,30rem) max-sm:w-[calc(100vw-5rem)] max-sm:shrink-0 max-sm:snap-center max-sm:overflow-hidden"
    >
      <div
        ref={inner}
        style={{ "--shot-width": `${width}px` } as React.CSSProperties}
        className="sm:contents max-sm:flex max-sm:w-(--shot-width) max-sm:min-h-[62rem] max-sm:origin-top-left max-sm:[&>section>div:nth-child(4)]:justify-center max-sm:[&>section>div:nth-child(4)]:gap-10 max-sm:scale-(--shot-scale,0.45) max-sm:flex-col max-sm:*:flex-1"
      >
        {children}
      </div>
    </div>
  )
}

export { PhoneMore, PhoneShot, PhoneStrip }
