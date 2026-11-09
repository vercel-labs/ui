import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/react/avatar"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  images,
  initialSource,
  sourceControls,
  statusMessage,
  type Person,
  type Source,
  type Variant,
} from "./variants"

function VariantAvatar({
  variant,
  person,
  index,
  env,
}: {
  variant: Variant
  person: Person
  index: number
  env: Env
}) {
  const [source, setSource] = React.useState<Source>(() =>
    initialSource(variant, person, index)
  )
  const isFirst = index === 0
  React.useEffect(() => {
    if (!isFirst || !variant.arrivesAfter || !person.image) {
      return
    }
    const timer = setTimeout(
      () => setSource(images[person.image!]),
      variant.arrivesAfter
    )
    return () => clearTimeout(timer)
  }, [isFirst, variant, person])
  React.useEffect(() => {
    if (isFirst && variant.sources) {
      env.controls(
        sourceControls.map(([label, next]) => [
          label,
          () => void setSource(next),
        ])
      )
    }
  }, [isFirst, variant, env])

  const imageProps = {
    className: variant.render === "image" ? classes.customImage : classes.image,
    src: source ?? undefined,
    alt: person.name,
    ...variant.imageProps,
  }
  return (
    <Avatar
      className={`${classes.avatar} ${classes.sizes[variant.size ?? "md"]}`}
      debug={variant.debug}
      render={
        variant.render === "root"
          ? (props, state) => (
              <div {...props} title={`Status: ${state.loadingStatus}`} />
            )
          : undefined
      }
      onLoadingStatusChange={(status, details) =>
        env.log(statusMessage(person, status, details.reason))
      }
    >
      {source !== undefined && (
        <AvatarImage
          {...imageProps}
          render={
            variant.render === "image"
              ? (props) => <img {...props} data-custom="" />
              : undefined
          }
        />
      )}
      <AvatarFallback className={classes.fallback} delay={variant.delay}>
        {variant.render === "fallback"
          ? (state) => state.loadingStatus
          : person.initials}
      </AvatarFallback>
    </Avatar>
  )
}

function VariantAvatars({ variant, env }: { variant: Variant; env: Env }) {
  const avatars = variant.people.map((person, index) => (
    <VariantAvatar
      key={person.name}
      variant={variant}
      person={person}
      index={index}
      env={env}
    />
  ))
  return variant.people.length > 1 ? (
    <div className={classes.group}>{avatars}</div>
  ) : (
    avatars
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantAvatars variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
