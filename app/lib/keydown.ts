import { useCallback } from "react"

export const handleCommandCtrlEnter = (fn: () => void) =>
  useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      fn()
    }
  }, [])
