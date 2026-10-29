<script lang="ts">
  import { onDestroy } from "svelte"
  import {
    AlertDialog,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    createConfirm,
    type ConfirmOptions,
  } from "@ui-sdk/svelte/alert-dialog"
  import type { DialogContentState } from "@ui-sdk/svelte/dialog"
  import { OverlayHost, createOverlays } from "@ui-sdk/svelte/overlays"
  import { Toast, ToastDescription, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const overlays = createOverlays()
  const toast = createToaster({ overlays })
  const confirm = createConfirm({ overlays })

  let projects = $state(["Acme", "Globex"])

  async function remove(name: string, button: HTMLElement) {
    const yes = await confirm({
      title: `Delete ${name}?`,
      description: "This permanently deletes the project and its files.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
    })
    if (!yes) return
    const row = button.closest("li")!
    ;(row.nextElementSibling ?? row.previousElementSibling)?.querySelector("button")?.focus()
    projects = projects.filter((project) => project !== name)
    toast.success(`${name} deleted`, { priority: "assertive" })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<ul class="min-h-24 w-full max-w-xs divide-y divide-border">
  {#each projects as name (name)}
    <li class="flex items-center gap-3 py-2 text-sm">
      {name}
      <button
        class="ms-auto inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
        onclick={(event) => remove(name, event.currentTarget)}
      >
        Delete
      </button>
    </li>
  {/each}
</ul>
{#snippet toastItem()}
  <Toast class="absolute inset-x-0 z-[calc(100-var(--toast-index))] flex items-center gap-3 overflow-hidden rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[translate,scale,opacity,height,box-shadow] duration-300 in-data-[side=bottom]:bottom-0 in-data-[side=top]:top-0 [--y:calc(var(--dir)*var(--toast-index)*0.75rem)] [translate:var(--toast-swipe-x,0px)_calc(var(--y)+var(--toast-swipe-y,0px))] scale-[calc(1-var(--toast-index)*0.05)] not-data-front:not-data-expanded:h-(--toast-front-height) focus-visible:ring-3 focus-visible:ring-ring/30 data-expanded:scale-100 data-expanded:[--y:calc(var(--dir)*(var(--toast-offset)+var(--toast-index)*0.75rem))] data-starting-style:opacity-0 data-starting-style:[--y:calc(var(--dir)*-100%)] data-ending-style:opacity-0 data-swiping:transition-none motion-reduce:transition-none dark:ring-foreground/10">
    <div class="grid flex-1 gap-1">
      <ToastTitle class="font-medium" />
      <ToastDescription />
    </div>
  </Toast>
{/snippet}

<OverlayHost {overlays} toast={{ class: "m-4 w-[356px] max-w-[calc(100vw-2rem)] h-(--toast-front-height) outline-none [--dir:-1] data-[side=top]:[--dir:1] data-expanded:h-[calc(var(--toast-stack-height)+(var(--toast-count)-1)*0.75rem)]", children: toastItem }} />
<AlertDialog controller={confirm.controller}>
  <AlertDialogContent class="fixed top-1/2 left-1/2 grid w-full max-w-xs -translate-1/2 gap-4 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 backdrop:bg-black/30 supports-backdrop-filter:backdrop:backdrop-blur-sm data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-md dark:ring-foreground/10 motion-reduce:transition-none">
    {#snippet children(state: DialogContentState<ConfirmOptions>)}
      {@const question = state.payload}
      <AlertDialogTitle class="text-lg leading-none font-medium">{question?.title}</AlertDialogTitle>
      <AlertDialogDescription class="text-sm text-balance text-muted-foreground md:text-pretty">
        {question?.description}
      </AlertDialogDescription>
      <div class="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AlertDialogClose class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50">
          {question?.cancelLabel}
        </AlertDialogClose>
        <AlertDialogClose
          value="confirm"
          class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
        >
          {question?.confirmLabel}
        </AlertDialogClose>
      </div>
    {/snippet}
  </AlertDialogContent>
</AlertDialog>
