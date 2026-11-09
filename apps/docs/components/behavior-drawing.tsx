const LAYERS = [
  { name: "createPopup", detail: "Open. Position. Dismiss.", y: 150 },
  { name: "createListbox", detail: "Navigate and select.", y: 302 },
  { name: "createTypeahead", detail: "Type to focus.", y: 454 },
]
const ENVIRONMENTS = ["Development", "Staging", "Production"]
const DESCRIPTION =
  "An environment selector separated into three layers. The popup provides the trigger and floating surface. The listbox holds Development, Staging, and Production, with Staging selected. Typeahead moves focus to Production when someone types pro. Every option remains visible."

function BehaviorDrawing() {
  return (
    <figure className="w-full min-w-0 text-foreground">
      <svg
        viewBox="44 60 552 472"
        role="img"
        aria-label="The behaviors inside an environment selector"
        className="block h-auto w-full overflow-visible font-sans"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <desc>{DESCRIPTION}</desc>
        <g
          className="hidden"
          aria-hidden="true"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.75"
          strokeWidth="1.2"
        >
          <path d="M34 60h20M44 50v20M586 60h20M596 50v20M34 532h20M44 522v20M586 532h20M596 522v20" />
        </g>
        <BehaviorLayers />
        <g stroke="var(--muted-foreground)" strokeWidth="0.8">
          <path d="M352.8 150L392 145h14" />
          <path d="M323.96 319.52L392 297h14" />
          <path d="M307.24 494.4L392 449h14" />
        </g>
        <g fill="currentColor">
          <circle cx="352.8" cy="150" r="2.4" />
          <circle cx="323.96" cy="319.52" r="2.4" />
          <circle cx="307.24" cy="494.4" r="2.4" />
        </g>
        {LAYERS.map((layer, index) => (
          <g key={layer.name} transform={`translate(416 ${layer.y})`}>
            <rect
              x="0"
              y="-41"
              width="27"
              height="21"

              stroke="var(--muted-foreground)"
              strokeOpacity="0.45"
              strokeWidth="0.7"
            />
            <text x="5" y="-26" fill="var(--muted-foreground)" fontSize="11" letterSpacing="1">
              0{index + 1}
            </text>
            <text fill="currentColor" fontSize="17" className="font-mono">
              {layer.name}
            </text>
            <text y="25" fill="var(--muted-foreground)" fontSize="13">
              {layer.detail}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="sr-only">
        Popup, listbox, and typeahead are separate building blocks you can combine.
      </figcaption>
    </figure>
  )
}

function BehaviorLayers() {
  return (
    <>
      <g stroke="var(--muted-foreground)" strokeOpacity="0.4" strokeWidth="0.65" strokeDasharray="8 4 2 4">
        <path d="M116 78v328M368 117.2v328M53.68 163.28v328M305.68 202.48v328" />
      </g>
      <g stroke="var(--muted-foreground)" strokeOpacity="0.35" strokeWidth="0.7">
        <path d="M108 394h16m-8-8v16M360 433.2h16m-8-8v16M45.68 479.28h16m-8-8v16M297.68 518.48h16m-8-8v16" />
      </g>

      <g stroke="var(--muted-foreground)" strokeOpacity="0.5" strokeWidth="0.7">
        {[90, 242, 394].map((y) => (
          <path key={y} d={`M112 ${y}h8M364 ${y + 39.2}h8M49.68 ${y + 85.28}h8M301.68 ${y + 124.48}h8`} />
        ))}
      </g>

      <g transform="matrix(0.9 0.14 -0.38 0.52 116 394)">
        <LayerPlate />
        <g stroke="var(--muted-foreground)" strokeOpacity="0.35" strokeWidth="0.7">
          <path d="M12 12h8m-8 0v8M268 12h-8m8 0v8M12 152h8m-8 0v-8M268 152h-8m8 0v-8" />
        </g>
        {ENVIRONMENTS.map((name, index) => (
          <g key={name} transform={`translate(16 ${16 + index * 44})`}>
            <rect
              width="248"
              height="36"

              fill={index === 2 ? "var(--muted)" : "none"}
              stroke={index === 2 ? "currentColor" : "var(--border)"}
              strokeWidth={index === 2 ? 1.7 : 0.7}
              vectorEffect="non-scaling-stroke"
            />
            {index === 2 && (
              <rect
                x="-3"
                y="-3"
                width="254"
                height="42"

                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <text x="14" y="24" fill={index === 2 ? "currentColor" : "var(--muted-foreground)"} fontSize="16">
              {name}
            </text>
            {index === 1 && (
              <path
                d="M222 17l4 4 7-8"
                stroke="var(--muted-foreground)"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        ))}
        <path
          d="M249 33h25v89h-11m5-5-5 5 5 5"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      <g transform="matrix(0.9 0.14 -0.38 0.52 116 242)">
        <LayerPlate />
        <rect x="10" y="10" width="260" height="144" stroke="var(--border)" strokeWidth="0.6" />
        {ENVIRONMENTS.map((name, index) => (
          <g key={name} transform={`translate(16 ${16 + index * 44})`}>
            <rect
              width="248"
              height="36"

              fill={index === 1 ? "var(--muted)" : "var(--canvas)"}
              stroke="var(--border)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="18" cy="18" r="3" stroke="var(--muted-foreground)" strokeWidth="0.8" />
            <text x="34" y="24" fill="currentColor" fontSize="16">
              {name}
            </text>
            {index === 1 && (
              <path
                d="M222 17l4 4 7-8"
                stroke="currentColor"
                strokeWidth="1.3"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        ))}
        <path d="M276 24v116" stroke="var(--border)" strokeWidth="1.2" />
        <path d="M276 26v42" stroke="var(--muted-foreground)" strokeOpacity="0.6" strokeWidth="1.2" />
      </g>

      <g transform="matrix(0.9 0.14 -0.38 0.52 116 90)">
        <g transform="translate(0 4)">
          <rect
            y="-56"
            width="280"
            height="38"

            fill="var(--muted)"
            stroke="var(--muted-foreground)"
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <rect
          y="-56"
          width="280"
          height="38"

          fill="var(--canvas)"
          stroke="currentColor"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <text x="16" y="-31" fill="currentColor" fontSize="16">
          Staging
        </text>
        <path d="M242-43v14" stroke="var(--border)" />
        <path d="M254-39l5 5 5-5" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path
          d="M12-13v11M268-13v11"
          stroke="var(--muted-foreground)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <LayerPlate strong />
        <rect
          x="14"
          y="14"
          width="252"
          height="136"

          stroke="var(--muted-foreground)"
          strokeOpacity="0.55"
          strokeWidth="0.7"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M129 75h22m-11-11v22"
          stroke="var(--muted-foreground)"
          strokeOpacity="0.45"
          strokeWidth="0.8"
        />
        <text
          x="140"
          y="113"
          textAnchor="middle"
          fill="var(--muted-foreground)"
          fontSize="12"
          letterSpacing="1.5"
        >
          POPUP SURFACE
        </text>
        <g stroke="var(--muted-foreground)" strokeWidth="0.7" strokeOpacity="0.55">
          <path d="M6 18v-7q0-5 5-5h7M262 6h7q5 0 5 5v7M6 146v7q0 5 5 5h7M262 158h7q5 0 5-5v-7" />
        </g>
      </g>
    </>
  )
}

function LayerPlate({ strong = false }: { strong?: boolean }) {
  return (
    <>
      <rect
        y="6"
        width="280"
        height="164"

        fill="var(--muted)"
        stroke="var(--muted-foreground)"
        strokeOpacity="0.6"
        strokeWidth="0.7"
        vectorEffect="non-scaling-stroke"
      />
      <g stroke="var(--muted-foreground)" strokeOpacity="0.45" strokeWidth="0.5">
        {Array.from({ length: 32 }, (_, index) => (
          <path key={index} d={`M${14 + index * 8} 165l4 5`} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <rect
        width="280"
        height="164"

        fill="var(--canvas)"
        stroke="var(--muted-foreground)"
        strokeOpacity="0.75"
        strokeWidth="0.7"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 154q0 10 10 10h260q10 0 10-10"
        stroke="currentColor"
        strokeOpacity={strong ? 0.9 : 0.65}
        strokeWidth={strong ? 1.4 : 1.1}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 154v6q0 10 10 10h260q10 0 10-10v-6"
        stroke="var(--muted-foreground)"
        strokeOpacity="0.6"
        strokeWidth="0.65"
        vectorEffect="non-scaling-stroke"
      />
    </>
  )
}

export { BehaviorDrawing }
