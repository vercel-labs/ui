<script lang="ts">
  import { fromText } from "@ui-sdk/core/token-input"
  import { enhance, type SubmitFunction } from "$app/forms"
  import { refreshAll } from "$app/navigation"
  import { page } from "$app/state"
  import Mention from "#lib/components/mention.svelte"
  import { Avatar } from "#ui/avatar"
  import { Button } from "#ui/button"
  import { toast } from "#ui/toast"
  import {
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
  } from "#ui/collapsible"
  import {
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
  } from "#ui/token-input"
  import {
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuItem,
    TriggerMenuList,
  } from "#ui/trigger-menu"
  import { cn } from "cn"
  import { people, personOf, type Issue } from "tracker-data"

  interface Props {
    issue: Issue
  }

  let { issue }: Props = $props()

  const mentions = people.map((person) => ({
    value: person.id,
    label: person.name,
    keywords: [person.role],
  }))
  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  })

  let pending = $state(false)

  const submit: SubmitFunction = () => {
    pending = true
    return async ({ formElement, result, update }) => {
      pending = false
      if (result.type === "success") {
        formElement.reset()
        await refreshAll()
      } else {
        toast.error("Couldn't post your comment. Try again.")
        await update({ reset: false })
      }
    }
  }
</script>

<Collapsible defaultOpen class="grid gap-3">
  <CollapsibleTrigger class="-ms-1.5 w-fit">
    Activity
    <span class="text-muted-foreground tabular-nums"
      >{issue.comments.length}</span
    >
  </CollapsibleTrigger>
  <CollapsiblePanel>
    <div class={cn("grid gap-5", issue.comments.length > 0 && "pt-1")}>
      {#if issue.comments.length > 0}
        <ul class="grid gap-5">
          {#each issue.comments as comment (comment.id)}
            {const author = $derived(personOf(comment.author))}
            <li class="flex gap-3">
              <Avatar name={author?.name ?? "Unknown"} decorative />
              <div class="grid min-w-0 flex-1 gap-1">
                <p class="flex items-baseline gap-2">
                  <span class="font-medium">{author?.name}</span>
                  <time
                    datetime={comment.createdAt}
                    class="text-xs text-muted-foreground"
                  >
                    {date.format(new Date(comment.createdAt))}
                  </time>
                </p>
                <div class="leading-relaxed whitespace-pre-wrap">
                  {#each fromText(comment.body) as segment, index (index)}
                    {#if typeof segment === "string"}{segment}{:else}<Mention
                        id={segment.value}
                        label={segment.label}
                      />{/if}
                  {/each}
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
      <form
        method="POST"
        action="?{page.url.searchParams}&/comment"
        use:enhance={submit}
        class="grid gap-2"
      >
        <input type="hidden" name="id" value={issue.id} />
        <TokenInput name="body" submitShortcut="mod+enter">
          <TokenInputEditor
            aria-label="Comment"
            placeholder="Leave a comment, type @ to mention someone"
          />
          <TriggerMenu
            triggers={[{ char: "@", type: "mention", items: mentions }]}
          >
            <TriggerMenuContent>
              <TriggerMenuList>
                {#snippet children(state)}
                  {#each state.items as typeof mentions as item (item.value)}
                    <TriggerMenuItem value={item.value} label={item.label}>
                      <Avatar name={item.label} size="sm" decorative />
                      {item.label}
                    </TriggerMenuItem>
                  {/each}
                {/snippet}
              </TriggerMenuList>
            </TriggerMenuContent>
          </TriggerMenu>
          {#snippet token(token)}
            <TokenInputToken>@{token.label}</TokenInputToken>
          {/snippet}
        </TokenInput>
        <div class="flex items-center justify-end gap-3">
          <span class="text-xs text-muted-foreground"
            >⌘ or Ctrl + Enter to send</span
          >
          <Button type="submit" size="sm" disabled={pending}
            >{pending ? "Sending…" : "Comment"}</Button
          >
        </div>
      </form>
    </div>
  </CollapsiblePanel>
</Collapsible>
