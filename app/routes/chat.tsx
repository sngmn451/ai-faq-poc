import { Button } from "@/components/ui/button"
import { ChatRoomContainer } from "@/containers/chat/single"
import { cn } from "@/lib/utils"
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { PanelLeft, Pencil } from "lucide-react"
import { ChatListContainer } from "@/containers/chat/list"
import { useWindowSize } from "@uidotdev/usehooks"

import { breakpoints } from "@/core/config/responsive"
export const Route = createFileRoute("/chat")({
  component: Component,
})

function Component() {
  const [displayChatrooms, setDisplayChatrooms] = useState(window.innerWidth < breakpoints.sm ? false : true)
  const { width } = useWindowSize()
  useEffect(() => {
    if (width! < breakpoints.sm) {
      setDisplayChatrooms(false)
    } else {
      setDisplayChatrooms(true)
    }
  }, [width])
  return (
    <div className="w-full flex flex-row flex-1 relative">
      <div className="absolute top-4 left-4 z-50 flex flex-row items-center gap-2">
        <Button variant={"ghost"} size={"icon"} onMouseDown={() => setDisplayChatrooms(!displayChatrooms)}>
          <PanelLeft />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <Pencil />
        </Button>
      </div>
      <div
        className={cn(
          "w-full h-full absolute top-0 left-0 pt-14 sm:w-64 sm:border-r transition-transform",
          displayChatrooms ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <ChatListContainer />
      </div>
      <div className={cn("w-full sm:w-[calc(100vw-20rem)] flex-1", displayChatrooms ? "sm:pl-64" : "")}>
        <Outlet />
      </div>
    </div>
  )
}
