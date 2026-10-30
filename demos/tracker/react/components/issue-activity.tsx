"use client"

import { fromText } from "@ui-sdk/core/token-input"
import { cn } from "cn"
import Link from "next/link"
import { useState, useTransition } from "react"
import { people, personOf, type Comment, type Issue } from "tracker-data"
import { addComment } from "@/app/actions"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "@/components/ui/toast"
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

const mentions = people.map((person) => ({ value: person.id, label: person.name, keywords: [person.role] }))

function Mention({ id, label }: { id: string; label: string }) {
  const person = personOf(id)
  if (!person) return <>@{label}</>
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<Link href={`/?tab=all&assignee=${person.id}`} />}
        className="rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        @{person.name}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-center gap-3">
          <Avatar name={person.name} size="lg" decorative />
          <div className="grid gap-0.5">
            <p className="font-medium">{person.name}</p>
            <p className="text-muted-foreground">{person.role}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Select to see their issues.</p>
      </HoverCardContent>
    </HoverCard>
  )
}

function CommentBody({ body }: { body: string }) {
  return fromText(body).map((segment, index) =>
    typeof segment === "string" ? (
      <span key={index}>{segment}</span>
    ) : (
      <Mention key={index} id={segment.value} label={segment.label} />
    ),
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const author = personOf(comment.author)
  return (
    <li className="flex gap-3">
      <Avatar name={author?.name ?? "Unknown"} decorative />
      <div className="grid min-w-0 flex-1 gap-1">
        <p className="flex items-baseline gap-2">
          <span className="font-medium">{author?.name}</span>
          <time dateTime={comment.createdAt} className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(
              new Date(comment.createdAt),
            )}
          </time>
        </p>
        <div className="leading-relaxed whitespace-pre-wrap">
          <CommentBody body={comment.body} />
        </div>
      </div>
    </li>
  )
}

function Composer({ issue }: { issue: Issue }) {
  const [composer] = useState(createTokenInputController)
  const [pending, startTransition] = useTransition()

  function send() {
    const body = composer.getText()
    if (pending || !composer.getLabel().trim()) return
    startTransition(async () => {
      try {
        await addComment(issue.id, body)
        composer.clear()
      } catch {
        toast.error("Couldn't post your comment. Try again.")
      }
    })
  }

  return (
    <div className="grid gap-2">
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
              {(state) =>
                (state.items as typeof mentions).map((item) => (
                  <TriggerMenuItem key={item.value} value={item.value} label={item.label}>
                    <Avatar name={item.label} size="sm" decorative />
                    {item.label}
                  </TriggerMenuItem>
                ))
              }
            </TriggerMenuList>
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
      <div className="flex items-center justify-end gap-3">
        <span className="text-xs text-muted-foreground">⌘ or Ctrl + Enter to send</span>
        <Button size="sm" onClick={send} disabled={pending}>
          {pending ? "Sending…" : "Comment"}
        </Button>
      </div>
    </div>
  )
}

function IssueActivity({ issue }: { issue: Issue }) {
  return (
    <Collapsible defaultOpen className="grid gap-3">
      <CollapsibleTrigger className="-ms-1.5 w-fit">
        Activity
        <span className="text-muted-foreground tabular-nums">{issue.comments.length}</span>
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className={cn("grid gap-5", issue.comments.length > 0 && "pt-1")}>
          {issue.comments.length > 0 && (
            <ul className="grid gap-5">
              {issue.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </ul>
          )}
          <Composer issue={issue} />
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}

export { IssueActivity }
