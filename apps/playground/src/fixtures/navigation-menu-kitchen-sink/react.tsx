import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  hasViewport,
  href,
  items,
  moreLinks,
  nestedLinks,
  type Item,
  type Variant,
} from "./variants"

function Chevron() {
  return (
    <svg
      className={classes.chevron}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 4.5 6 7.5l3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Link({
  variant,
  label,
  description,
  closeOnSelect,
}: {
  variant: Variant
  label: string
  description?: string
  closeOnSelect?: boolean
}) {
  return (
    <li>
      <NavigationMenuLink
        className={classes.link}
        href={href(variant, label)}
        closeOnSelect={closeOnSelect}
      >
        <span className={classes.linkTitle}>{label}</span>
        {description && (
          <span className={classes.linkDescription}>{description}</span>
        )}
      </NavigationMenuLink>
    </li>
  )
}

// A vertical menu inside the first panel, whose content is its own popup.
function Nested({ variant, env }: { variant: Variant; env: Env }) {
  return (
    <NavigationMenu
      orientation="vertical"
      className={classes.nestedRoot}
      onValueChange={(value, { reason }) =>
        env.log(`nested valueChange ${value} (${reason})`)
      }
    >
      <NavigationMenuList className={classes.list}>
        <NavigationMenuItem value="learn">
          <NavigationMenuTrigger className={classes.trigger}>
            Learn <Chevron />
          </NavigationMenuTrigger>
          <NavigationMenuContent className={classes.nestedContent}>
            <ul className={classes.links}>
              {nestedLinks.map((label) => (
                <Link key={label} variant={variant} label={label} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function Panel({
  variant,
  env,
  item,
}: {
  variant: Variant
  env: Env
  item: Item
}) {
  const [grown, setGrown] = React.useState(false)
  const first = item.value === "products"
  const menuCloses = variant.options?.closeOnSelect ?? true
  const links =
    first && variant.body === "long"
      ? Array.from({ length: 30 }, (_, index) => ({
          label: `Product ${index + 1}`,
          description: "",
        }))
      : item.links
  return (
    <NavigationMenuContent
      className={classes.content(variant, item.value, first && grown)}
      {...variant.content}
      anchor={hasViewport(variant) ? undefined : env.anchor}
    >
      <ul className={classes.links}>
        {links.map((link, index) => (
          <Link
            key={link.label}
            variant={variant}
            label={link.label}
            description={link.description}
            closeOnSelect={
              variant.linkCloseOnSelect && index === 0 ? !menuCloses : undefined
            }
          />
        ))}
        {grown &&
          moreLinks.map((label) => (
            <Link key={label} variant={variant} label={label} />
          ))}
      </ul>
      {first && variant.body === "dynamic" && (
        <button className={classes.more} onClick={() => setGrown(!grown)}>
          {grown ? "Show less" : "Show more"}
        </button>
      )}
      {first && variant.body === "nested" && (
        <Nested variant={variant} env={env} />
      )}
    </NavigationMenuContent>
  )
}

function VariantMenu({ variant, env }: { variant: Variant; env: Env }) {
  const [value, setValue] = React.useState<string | null>(null)

  // The select outside the menu shares the controlled value.
  React.useEffect(() => {
    const select = env.select
    if (!select) {
      return
    }
    const change = () => setValue(select.value || null)
    select.addEventListener("change", change)
    return () => select.removeEventListener("change", change)
  }, [env.select])
  React.useEffect(() => {
    if (env.select) {
      env.select.value = value ?? ""
    }
  }, [env.select, value])

  return (
    <NavigationMenu
      id={env.navId}
      aria-label={`Main ${variant.id}`}
      className={classes.root}
      {...variant.options}
      {...(variant.controlled && { value })}
      container={env.container}
      controller={env.controller}
      onValueChange={(next, details) => {
        env.log(`valueChange ${next} (${details.reason})`)
        if (variant.controlled && !details.canceled) {
          setValue(next)
        }
      }}
      onOpenChangeComplete={(open) => env.log(`openChangeComplete ${open}`)}
    >
      <NavigationMenuList className={classes.list}>
        {items.map((item) => (
          <NavigationMenuItem key={item.value} value={item.value}>
            <NavigationMenuTrigger
              className={classes.trigger}
              disabled={variant.disabled === item.value}
            >
              {item.label} <Chevron />
            </NavigationMenuTrigger>
            <Panel variant={variant} env={env} item={item} />
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink
            className={classes.topLink}
            href={href(variant, "pricing")}
            current={variant.activeLink !== false}
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator className={classes.indicator} />
      {hasViewport(variant) && (
        <NavigationMenuViewport
          className={classes.viewport(variant.animation)}
          {...(variant.viewport || {})}
          anchor={env.anchor}
        />
      )}
    </NavigationMenu>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantMenu variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
