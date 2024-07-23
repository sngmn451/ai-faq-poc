import { NewChatComponent } from "@/components/chat/new"
import { ChatRoomContainer } from "@/containers/chat/single"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/chat/")({
  component: () => <ChatRoomContainer />,
})

function Component() {
  return (
    <div className="w-full px-4">
      <NewChatComponent />
    </div>
  )
}
