import { paginationRange } from "@ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row" data-variant="dots" role="group" aria-label="Slides"></div>
      <output data-slot="output"></output>
    </div>
  `
  const dots = root.querySelector('[role="group"]')!

  function show(slide: number) {
    const focused = dots.contains(document.activeElement)
    dots.innerHTML = paginationRange({ page: slide, pageCount: 20, siblings: 2, boundaries: 1 })
      .map((item) =>
        typeof item === "number"
          ? `<button type="button" data-slide="${item}" aria-label="Slide ${item}" ${item === slide ? 'aria-current="true"' : ""}></button>`
          : `<span aria-hidden="true"></span>`,
      )
      .join("")
    root.querySelector("output")!.textContent = `Slide ${slide} of 20`
    if (focused) {
      dots.querySelector<HTMLElement>(`[data-slide="${slide}"]`)?.focus()
    }
  }

  dots.addEventListener("click", (event) => {
    const dot = (event.target as Element).closest<HTMLElement>("[data-slide]")
    if (dot) {
      show(Number(dot.dataset.slide))
    }
  })
  show(1)
}

export { mount }
