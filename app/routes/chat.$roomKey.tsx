import { ChatRoomContainer } from "@/containers/chat/single"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/chat/$roomKey")({
  component: Component,
})

export function Component() {
  return <ChatRoomContainer roomKey={Route.useParams().roomKey} />
}
