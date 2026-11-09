import { fromText } from "@ui-sdk/core/token-input"
import { cn } from "cn"
import { html, nothing } from "lit-html"
import { people, personOf, type Comment, type Issue } from "tracker-data"
import { icon } from "../lib/icons"
import { addComment } from "../lib/tracker"
import { avatar, button, styles } from "../lib/ui"

const date = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
})
const triggers = [{ char: "@", type: "mention" }]

function mention(id: string, label: string) {
  const person = personOf(id)
  if (!person) {
    return html`@${label}`
  }
  return html`<ui-hover-card>
    <ui-hover-card-trigger>
      <a
        href=${`/?tab=all&assignee=${person.id}`}
        class="rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        @${person.name}
      </a>
    </ui-hover-card-trigger>
    <ui-hover-card-content side-offset="6" class=${styles.hoverCard}>
      <div class="flex items-center gap-3">
        ${avatar(person.name, { size: "lg", decorative: true })}
        <div class="grid gap-0.5">
          <p class="font-medium">${person.name}</p>
          <p class="text-muted-foreground">${person.role}</p>
        </div>
      </div>
      <p class="text-xs text-muted-foreground">Select to see their issues.</p>
    </ui-hover-card-content>
  </ui-hover-card>`
}

function commentItem(comment: Comment) {
  const author = personOf(comment.author)
  return html`<li class="flex gap-3">
    ${avatar(author?.name ?? "Unknown", { decorative: true })}
    <div class="grid min-w-0 flex-1 gap-1">
      <p class="flex items-baseline gap-2">
        <span class="font-medium">${author?.name}</span>
        <time
          datetime=${comment.createdAt}
          class="text-xs text-muted-foreground"
        >
          ${date.format(new Date(comment.createdAt))}
        </time>
      </p>
      <div class="leading-relaxed whitespace-pre-wrap">
        ${fromText(comment.body).map((segment) =>
          typeof segment === "string"
            ? segment
            : mention(segment.value, segment.label)
        )}
      </div>
    </div>
  </li>`
}

function send(issue: Issue, event: SubmitEvent) {
  event.preventDefault()
  const composer = (event.currentTarget as HTMLFormElement).querySelector(
    "ui-token-input"
  )
  if (!composer?.api.getLabel().trim()) {
    return
  }
  addComment(issue.id, composer.api.getText().trim())
  composer.api.clear()
}

function composer(issue: Issue) {
  return html`<form
    class="grid gap-2"
    @submit=${(event: SubmitEvent) => send(issue, event)}
  >
    <ui-token-input submit-shortcut="mod+enter">
      <ui-token-input-editor
        aria-label="Comment"
        placeholder="Leave a comment, type @ to mention someone"
        class="relative block min-h-20 overflow-y-auto rounded-2xl border border-transparent bg-input/50 px-2.5 py-2 text-base outline-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-empty:before:pointer-events-none data-empty:before:absolute data-empty:before:text-muted-foreground data-empty:before:content-[attr(aria-placeholder)] motion-reduce:transition-none md:text-sm"
      ></ui-token-input-editor>
      <template>
        <ui-token-input-token
          class="inline-flex items-center rounded-2xl bg-input px-1.5 align-baseline font-medium data-selected:ring-3 data-selected:ring-ring/30 dark:bg-input/60"
          >@<span data-token-label></span
        ></ui-token-input-token>
      </template>
      <ui-trigger-menu .triggers=${triggers}>
        <ui-trigger-menu-content
          class="max-h-[min(18rem,var(--available-height))] w-56 origin-(--transform-origin) scroll-py-1 overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"
        >
          <ui-trigger-menu-list>
            ${people.map(
              (person) =>
                html`<ui-trigger-menu-item
                  value=${person.id}
                  label=${person.name}
                  keywords=${person.role}
                  class="flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                >
                  ${avatar(person.name, { size: "sm", decorative: true })}
                  ${person.name}
                </ui-trigger-menu-item>`
            )}
          </ui-trigger-menu-list>
        </ui-trigger-menu-content>
      </ui-trigger-menu>
    </ui-token-input>
    <div class="flex items-center justify-end gap-3">
      <span class="text-xs text-muted-foreground"
        >⌘ or Ctrl + Enter to send</span
      >
      <button type="submit" class=${button({ size: "sm" })}>Comment</button>
    </div>
  </form>`
}

function issueActivity(issue: Issue) {
  return html`<ui-collapsible default-open class="grid gap-3">
    <ui-collapsible-trigger>
      <button
        class="group -ms-1.5 flex h-7 w-fit cursor-default items-center gap-1 rounded-xl px-1.5 text-sm font-medium outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        ${icon(
          "chevron-right",
          "size-4 text-muted-foreground transition-transform group-data-open:rotate-90 motion-reduce:transition-none rtl:rotate-180 rtl:group-data-open:rotate-90"
        )}
        Activity
        <span class="text-muted-foreground tabular-nums"
          >${issue.comments.length}</span
        >
      </button>
    </ui-collapsible-trigger>
    <ui-collapsible-panel
      class="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none"
    >
      <div class=${cn("grid gap-5", issue.comments.length > 0 && "pt-1")}>
        ${
          issue.comments.length > 0
            ? html`<ul class="grid gap-5">
                ${issue.comments.map(commentItem)}
              </ul>`
            : nothing
        }
        ${composer(issue)}
      </div>
    </ui-collapsible-panel>
  </ui-collapsible>`
}

export { issueActivity }
