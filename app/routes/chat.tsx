import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { PanelLeft } from "lucide-react"
import { ChatListContainer } from "@/containers/chat/list"
import { useWindowSize } from "@uidotdev/usehooks"

import { breakpoints } from "@/core/config/responsive"
import { useUIStore } from "@/core/store/ui"
export const Route = createFileRoute("/chat")({
  component: Component,
})

function Component() {
  const navigate = Route.useNavigate()
  const displayChatList = useUIStore().displayChatList
  const setDisplayChatList = useUIStore().setDisplayChatList
  const { width } = useWindowSize()
  useEffect(() => {
    if (width! < breakpoints.sm) {
      setDisplayChatList(false)
    } else {
      setDisplayChatList(true)
    }
  }, [width])
  return (
    <div className="w-full flex flex-row flex-1 relative">
      <div
        className={cn(
          displayChatList ? "sm:w-[15.925rem]" : "w-auto",
          "absolute top-0 left-0 bg-background p-4 pb-2 z-50 mb-2",
          " flex flex-row items-center justify-between gap-2",
        )}
      >
        <Button variant={"ghost"} size={"icon"} onMouseDown={() => setDisplayChatList(!displayChatList)}>
          <PanelLeft />
        </Button>
        {displayChatList && <Button onMouseDown={() => navigate({ to: "/chat" })}>New Chat</Button>}
      </div>
      <div
        className={cn(
          "w-full h-full absolute top-0 left-0 pt-14 sm:w-64 sm:border-r transition-transform z-10 bg-background",
          displayChatList ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <ChatListContainer />
      </div>
      <div className={cn("w-full sm:w-[calc(100vw-20rem)] flex-1", displayChatList ? "sm:pl-64" : "")}>
        <Outlet />
      </div>
    </div>
  )
}
