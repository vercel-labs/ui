import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

function VariantPagination({ variant, env }: { variant: Variant; env: Env }) {
  const [page, setPage] = React.useState(1)
  const [controller] = React.useState(() =>
    variant.controller ? createPaginationController() : undefined
  )
  React.useEffect(() => {
    if (!controller) {
      return
    }
    env.controls([
      ["next()", () => controller.next()],
      ["previous()", () => controller.previous()],
      ["first()", () => controller.first()],
      ["last()", () => controller.last()],
      ["setPage(5)", () => controller.setPage(5)],
      ["getPage()", () => controller.getPage()],
      ["getPageCount()", () => controller.getPageCount()],
    ])
  }, [controller, env])
  const text = variant.steps === "text"
  return (
    <Pagination
      aria-label={variant.title}
      {...variant.options}
      {...(variant.controlled && { page })}
      getHref={
        variant.links
          ? (target) => `#kitchen-${variant.id}-${target}`
          : undefined
      }
      controller={controller}
      onPageChange={(next, details) => {
        if (variant.cancel) {
          return details.cancel()
        }
        if (variant.controlled) {
          setPage(next)
        }
        env.log(`pageChange ${next} (${details.reason}, ${details.source})`)
      }}
    >
      <PaginationList className={classes.list}>
        {({ items }) => (
          <>
            {!text && (
              <PaginationItem>
                <PaginationFirst
                  className={classes.step}
                  aria-label="First page"
                >
                  «
                </PaginationFirst>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationPrevious
                className={classes.step}
                aria-label={text ? undefined : "Previous page"}
              >
                {text ? "‹ Previous" : "‹"}
              </PaginationPrevious>
            </PaginationItem>
            {items.map((item) => (
              <PaginationItem key={item}>
                {typeof item === "number" ? (
                  <PaginationLink className={classes.link} page={item} />
                ) : (
                  <PaginationEllipsis className={classes.ellipsis} />
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className={classes.step}
                aria-label={text ? undefined : "Next page"}
              >
                {text ? "Next ›" : "›"}
              </PaginationNext>
            </PaginationItem>
            {!text && (
              <PaginationItem>
                <PaginationLast className={classes.step} aria-label="Last page">
                  »
                </PaginationLast>
              </PaginationItem>
            )}
          </>
        )}
      </PaginationList>
    </Pagination>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantPagination variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
