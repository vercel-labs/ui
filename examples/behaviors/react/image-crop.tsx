import * as React from "react"
import { cropImage, type ImageRotation } from "@ui-sdk/core/image"

const quarters = [
  ["#ef4444", 0, 0],
  ["#22c55e", 200, 0],
  ["#3b82f6", 0, 150],
  ["#eab308", 200, 150],
] as const

function paint(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d")!
  for (const [color, x, y] of quarters) {
    context.fillStyle = color
    context.fillRect(x, y, 200, 150)
  }
}

function Example() {
  const source = React.useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = React.useState<ImageRotation>(0)
  const [flipX, setFlipX] = React.useState(false)
  const [circle, setCircle] = React.useState(false)
  const [result, setResult] = React.useState<{ url: string; file: File }>()

  React.useEffect(() => paint(source.current!), [])
  React.useEffect(() => () => result && URL.revokeObjectURL(result.url), [result])

  async function crop() {
    const file = await cropImage(
      source.current!,
      { x: 0, y: 0, width: 150, height: 150, rotation, flipX },
      { width: 96, shape: circle ? "circle" : "rectangle" },
    )
    setResult({ url: URL.createObjectURL(file), file })
  }

  return (
    <div data-slot="stack">
      <div data-slot="image-crop-stage">
        <canvas
          ref={source}
          width={400}
          height={300}
          aria-label="Four colored quarters"
          role="img"
          style={{ transform: `scale(${flipX ? -1 : 1}, 1) rotate(${rotation}deg)` }}
        />
      </div>
      <div data-slot="row">
        <label data-slot="label">
          Rotation
          <select
            value={rotation}
            onChange={(event) => setRotation(Number(event.target.value) as ImageRotation)}
          >
            {[0, 90, 180, 270].map((degrees) => (
              <option key={degrees} value={degrees}>
                {degrees}°
              </option>
            ))}
          </select>
        </label>
        <label data-slot="label">
          <input type="checkbox" checked={flipX} onChange={(event) => setFlipX(event.target.checked)} />
          Flip
        </label>
        <label data-slot="label">
          <input type="checkbox" checked={circle} onChange={(event) => setCircle(event.target.checked)} />
          Circle
        </label>
        <button type="button" onClick={crop}>
          Crop
        </button>
      </div>
      {result && (
        <div data-slot="row">
          <img data-slot="image-crop-result" src={result.url} alt="The cropped image" />
          <p>
            {result.file.name}, {result.file.type}, {result.file.size} bytes
          </p>
        </div>
      )}
    </div>
  )
}

export { Example }
