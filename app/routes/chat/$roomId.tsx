import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/chat/$roomId")({
  component: () => <div>Hello /chat/$roomId!</div>,
})
