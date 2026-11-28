import {
  booleanAttribute,
  numberAttribute,
  type InputSignalWithTransform,
} from "@angular/core"

// An input left out stays undefined, so core's default applies, and a bare
// attribute like `disabled` reads as true.
const optionalBoolean = (value: unknown) =>
  value === undefined ? undefined : booleanAttribute(value)

// A number written as an attribute arrives as a string.
const optionalNumber = (value: unknown) =>
  value === undefined ? undefined : numberAttribute(value)

// A number that may be `null`, like a rating with no score yet.
const nullableNumber = (value: unknown) =>
  value === undefined || value === null
    ? (value as null | undefined)
    : numberAttribute(value)

// The `*` form leaves a part's other attributes on the element inside its
// template, where they aren't inputs. So it takes them as one object, like
// `*uiPopoverContent="{ side: 'bottom' }"`. A bare attribute gives "".
const starInputs = <Props>(value: Partial<Props> | "" | undefined) =>
  value || undefined

// The type of such an input, written out so declarations name `Props` itself.
type StarInput<Props> = InputSignalWithTransform<
  Partial<Props> | undefined,
  Partial<Props> | "" | undefined
>

// A part's props: what its own inputs set, over what the `*` form gave.
function withStar<Props extends object>(
  star: Partial<Props> | undefined,
  own: Props
) {
  if (!star) {
    return own
  }
  const props = { ...star } as Props
  for (const key in own) {
    if (own[key] !== undefined) {
      props[key] = own[key]
    }
  }
  return props
}

export {
  nullableNumber,
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
}
