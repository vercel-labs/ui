import { fromText } from "@ui-sdk/core/token-input"
import { For, Show } from "solid-js"
import { people, personOf, type Comment, type Issue } from "tracker-data"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  createTokenInputController,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
} from "@/components/ui/token-input"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@/components/ui/trigger-menu"
import { addComment } from "@/lib/tracker"

const mentions = people.map((person) => ({ value: person.id, label: person.name, keywords: [person.role] }))
const date = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" })

function Mention(props: { id: string; label: string }) {
  return (
    <Show when={personOf(props.id)} fallback={<>@{props.label}</>}>
      {(person) => (
        <HoverCard>
          <HoverCardTrigger
            render={(attributes) => <a {...attributes} href={`/?tab=all&assignee=${person().id}`} />}
            class="rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            @{person().name}
          </HoverCardTrigger>
          <HoverCardContent>
            <div class="flex items-center gap-3">
              <Avatar name={person().name} size="lg" decorative />
              <div class="grid gap-0.5">
                <p class="font-medium">{person().name}</p>
                <p class="text-muted-foreground">{person().role}</p>
              </div>
            </div>
            <p class="text-xs text-muted-foreground">Select to see their issues.</p>
          </HoverCardContent>
        </HoverCard>
      )}
    </Show>
  )
}

function CommentItem(props: { comment: Comment }) {
  const author = () => personOf(props.comment.author)
  return (
    <li class="flex gap-3">
      <Avatar name={author()?.name ?? "Unknown"} decorative />
      <div class="grid min-w-0 flex-1 gap-1">
        <p class="flex items-baseline gap-2">
          <span class="font-medium">{author()?.name}</span>
          <time datetime={props.comment.createdAt} class="text-xs text-muted-foreground">
            {date.format(new Date(props.comment.createdAt))}
          </time>
        </p>
        <div class="leading-relaxed whitespace-pre-wrap">
          <For each={fromText(props.comment.body)}>
            {(segment) =>
              typeof segment === "string" ? segment : <Mention id={segment.value} label={segment.label} />
            }
          </For>
        </div>
      </div>
    </li>
  )
}

function Composer(props: { issue: Issue }) {
  const composer = createTokenInputController()

  function send() {
    if (!composer.getLabel().trim()) return
    addComment(props.issue.id, composer.getText().trim())
    composer.clear()
  }

  return (
    <div class="grid gap-2">
      <TokenInput
        controller={composer}
        submitShortcut="mod+enter"
        onSubmit={send}
        renderToken={(token) => <TokenInputToken>@{token.label}</TokenInputToken>}
      >
        <TokenInputEditor aria-label="Comment" placeholder="Leave a comment, type @ to mention someone" />
        <TriggerMenu triggers={[{ char: "@", type: "mention", items: mentions }]}>
          <TriggerMenuContent>
            <TriggerMenuList>
              {(state) => (
                <For each={state.items as typeof mentions}>
                  {(item) => (
                    <TriggerMenuItem value={item.value} label={item.label}>
                      <Avatar name={item.label} size="sm" decorative />
                      {item.label}
                    </TriggerMenuItem>
                  )}
                </For>
              )}
            </TriggerMenuList>
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
      <div class="flex items-center justify-end gap-3">
        <span class="text-xs text-muted-foreground">⌘ or Ctrl + Enter to send</span>
        <Button size="sm" onClick={send}>
          Comment
        </Button>
      </div>
    </div>
  )
}

function IssueActivity(props: { issue: Issue }) {
  return (
    <Collapsible defaultOpen class="grid gap-3">
      <CollapsibleTrigger class="-ms-1.5 w-fit">
        Activity
        <span class="text-muted-foreground tabular-nums">{props.issue.comments.length}</span>
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div class={["grid gap-5", { "pt-1": props.issue.comments.length > 0 }]}>
          <Show when={props.issue.comments.length > 0}>
            <ul class="grid gap-5">
              <For each={props.issue.comments}>{(comment) => <CommentItem comment={comment} />}</For>
            </ul>
          </Show>
          <Composer issue={props.issue} />
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}

export { IssueActivity }
