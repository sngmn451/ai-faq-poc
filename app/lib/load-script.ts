export function loadScript(src: string, callback?: () => void) {
  const script = document.createElement("script")
  if (callback) {
    script.onload = callback
  }
  script.src = src
  document.head.appendChild(script)
}
