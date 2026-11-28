import { afterNextRender, DestroyRef, inject, signal } from "@angular/core"
import {
  createAsyncOptions,
  type AsyncOptionsContext,
  type AsyncOptionsOptions,
  type AsyncOptionsState,
} from "@ui-sdk/core/async-options"

/**
 * Options loaded for what the user types, latest first. Returns the state as
 * a signal, and `setQuery`, for a combobox with `[filter]="false"`. Call it
 * in a field initializer.
 * @stable
 */
function useAsyncOptions<Item>(
  load: (
    query: string,
    context: AsyncOptionsContext
  ) => Promise<Item[] | { items: Item[]; hasMore?: boolean }>,
  options?: AsyncOptionsOptions
) {
  // A component is made on the server too, so an `immediate` load starts once
  // it renders. Until then it shows as loading, so nothing says "no match" first.
  const helper = createAsyncOptions<Item>(load, {
    ...options,
    immediate: false,
  })
  const immediate = !!options?.immediate
  const initial = helper.getState()
  const state = signal<AsyncOptionsState<Item>>(
    immediate ? { ...initial, status: "loading" } : initial
  )
  const unsubscribe = helper.subscribe(() => state.set(helper.getState()))
  afterNextRender(() => {
    if (immediate && helper.getState() === initial) {
      helper.reload()
    }
  })
  inject(DestroyRef).onDestroy(() => {
    unsubscribe()
    helper.cancel()
  })
  return {
    /** The items, the status, whether more pages exist and the last error. */
    state: state.asReadonly(),
    setQuery: helper.setQuery,
    reload: helper.reload,
    loadMore: helper.loadMore,
  }
}

export { createAsyncOptions } from "@ui-sdk/core/async-options"
export type {
  AsyncOptions,
  AsyncOptionsContext,
  AsyncOptionsOptions,
  AsyncOptionsState,
  AsyncOptionsStatus,
} from "@ui-sdk/core/async-options"

export { useAsyncOptions }
