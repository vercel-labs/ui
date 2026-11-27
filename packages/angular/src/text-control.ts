import {
  computed,
  effect,
  ElementRef,
  HostAttributeToken,
  inject,
} from "@angular/core"

type TextStates = {
  value: string | undefined
  defaultValue: string | undefined
  name: string | undefined
  disabled: boolean | undefined
  readOnly: boolean | undefined
  required: boolean | undefined
}

// Writes a native text field's text: its default once, which the server
// renders and a form reset returns to, then only a controlled value.
function useTextValue(read: () => Pick<TextStates, "value" | "defaultValue">) {
  const el =
    inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(
      ElementRef
    ).nativeElement
  let rendered = false
  effect(() => {
    const { value, defaultValue } = read()
    if (!rendered) {
      rendered = true
      const text = value ?? defaultValue
      if (text !== undefined) {
        if (el.localName === "textarea") {
          el.textContent = text
        } else {
          el.setAttribute("value", text)
        }
      }
    }
    if (value !== undefined && el.value !== value) {
      el.value = value
    }
  })
}

// Keeps a native text field's own attributes and text in step with the
// directive's inputs, on the server too. Returns the states its part follows.
function useTextControl(read: () => TextStates) {
  const el =
    inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(
      ElementRef
    ).nativeElement
  // Read from the template, since the element may hold what the server wrote.
  const authored = (name: string) =>
    inject(new HostAttributeToken(name), { optional: true }) !== null
  const nativeReadOnly = authored("readonly")
  const named = authored("name")
  const states = computed(() => {
    const { disabled, readOnly, required } = read()
    return {
      disabled: !!disabled,
      readOnly: readOnly ?? nativeReadOnly,
      required: !!required,
    }
  })
  const written = new Set<string>()
  const flag = (name: string, on: boolean) => {
    if (on) {
      el.setAttribute(name, "")
      written.add(name)
    } else if (written.delete(name)) {
      el.removeAttribute(name)
    }
  }
  let gave: string | undefined
  effect(() => {
    const { disabled, readOnly, required } = states()
    flag("disabled", disabled)
    flag("readonly", readOnly)
    flag("required", required)
    const { name } = read()
    const current = el.getAttribute("name")
    // A name the author bound, like `[name]`, stays. The server's is ours.
    const bound = current !== null && current !== gave && current !== name
    if (named || bound) {
      return
    }
    if (name !== undefined) {
      el.setAttribute("name", name)
    } else if (gave !== undefined) {
      el.removeAttribute("name")
    }
    gave = name
  })
  useTextValue(read)
  return states
}

export { useTextControl, useTextValue }
