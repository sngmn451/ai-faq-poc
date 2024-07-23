import { ChatRoomContainer } from "@/containers/chat/single"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/chat/$roomId")({
  component: Component,
})

export function Component() {
  const roomId = Route.useParams().roomId
  return <ChatRoomContainer roomId={roomId} />
}
