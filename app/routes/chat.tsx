import { Button } from "@/components/ui/button"
import { ChatRoomContainer } from "@/containers/chat/single"
import { cn } from "@/lib/utils"
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { PanelLeft, Pencil } from "lucide-react"
import { ChatListContainer } from "@/containers/chat/list"
import { useWindowSize } from "@uidotdev/usehooks"

import { breakpoints } from "@/core/config/responsive"
import { useUIStore } from "@/core/store/ui"
export const Route = createFileRoute("/chat")({
  component: Component,
})

function Component() {
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
          displayChatList ? "sm:w-56" : "w-auto",
          "absolute top-4 left-4 z-50",
          " flex flex-row items-center justify-between gap-2",
        )}
      >
        <Button variant={"ghost"} size={"icon"} onMouseDown={() => setDisplayChatList(!displayChatList)}>
          <PanelLeft />
        </Button>
        {displayChatList && <Button>New Chat</Button>}
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
