import { Button } from "@/components/ui/button"
import { ChatRoomContainer } from "@/containers/chat/container"
import { cn } from "@/lib/utils"
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useState } from "react"
import { Menu } from "lucide-react"
export const Route = createFileRoute("/chat")({
  component: Component,
})

function Component() {
  const isRoot = useLocation().pathname === "/chat"
  const [displayChatrooms, setDisplayChatrooms] = useState(isRoot)
  return (
    <div className="w-full flex flex-row flex-1 relative">
      <Button variant={"ghost"} size={"icon"} className="absolute top-4 left-4 z-50" onMouseDown={() => setDisplayChatrooms(!displayChatrooms)}>
        <Menu />
      </Button>
      <div
        className={cn(
          "w-full h-full absolute top-0 left-0 pt-10 sm:w-80 sm:border-r transition-transform",
          displayChatrooms ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4">Item</div>
      </div>
      {isRoot ? (
        <div className={cn(" w-full sm:w-[calc(100vw-20rem)] flex-1", displayChatrooms ? "sm:pl-80" : "")}>
          <ChatRoomContainer />
        </div>
      ) : (
        <div className={cn(" w-full sm:w-[calc(100vw-20rem)] flex-1", displayChatrooms ? "sm:pl-80" : "")}>
          <Outlet />
        </div>
      )}
    </div>
  )
}
