<script lang="ts">
  import IssueBoard from "#lib/components/issue-board.svelte"
  import IssueDetail from "#lib/components/issue-detail.svelte"
  import IssueList from "#lib/components/issue-list.svelte"
  import IssueTabs from "#lib/components/issue-tabs.svelte"
  import IssueToolbar from "#lib/components/issue-toolbar.svelte"
  import Workspace from "#lib/components/workspace.svelte"
  import type { PageProps } from "./$types"

  let { data }: PageProps = $props()
</script>

<main class="flex min-h-0 flex-1 flex-col">
  <div class="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
    <IssueTabs query={data.query} counts={data.counts} />
    <IssueToolbar query={data.query} />
  </div>
  <Workspace sizes={data.sizes} open={data.issue !== null}>
    {#snippet list()}
      {#if data.query.view === "board"}
        <IssueBoard issues={data.matching} query={data.query} />
      {:else}
        <IssueList issues={data.matching} query={data.query} pageSize={data.pageSize} />
      {/if}
    {/snippet}
    {#snippet detail()}
      {#if data.issue}
        {#key data.issue.id}
          <IssueDetail issue={data.issue} query={data.query} />
        {/key}
      {/if}
    {/snippet}
  </Workspace>
</main>
