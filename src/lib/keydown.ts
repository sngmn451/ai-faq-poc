import { useCallback } from "react"

// export function handleCommandCtrlEnter(fn: () => void) {
//   return (e: KeyboardEvent) => {
//     if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
//       fn()
//     }
//   }
// }
export const handleCommandCtrlEnter = (fn: () => void) =>
  useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      fn()
    }
  }, [])
