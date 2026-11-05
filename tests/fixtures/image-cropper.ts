// The image cropper every implementation renders. Labels, sizes and order
// are the contract the specs rely on, so change them here and nowhere else.
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">',
  '<rect width="200" height="150" fill="#ef4444"/>',
  '<rect x="200" width="200" height="150" fill="#22c55e"/>',
  '<rect y="150" width="200" height="150" fill="#3b82f6"/>',
  '<rect x="200" y="150" width="200" height="150" fill="#eab308"/>',
  "</svg>",
].join("")

const imageCropperFixture = {
  label: "Photo",
  alt: "Four colored squares",
  src: `data:image/svg+xml,${encodeURIComponent(svg)}`,
  handles: ["nw", "ne", "se", "sw", "e"] as const,
}

// A crop as the outputs show it, like "50,0,300,300 r90 fx".
function describeCrop(crop: {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  flipX: boolean
  flipY: boolean
}) {
  const flips = `${crop.flipX ? " fx" : ""}${crop.flipY ? " fy" : ""}`
  return `${crop.x},${crop.y},${crop.width},${crop.height} r${crop.rotation}${flips}`
}

export { describeCrop, imageCropperFixture }
