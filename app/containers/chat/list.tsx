import { LoadingComponent } from "@/components/primitives/loading"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Repo } from "@/core/repositories"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { MoreHorizontal, Pencil } from "lucide-react"

export function ChatListContainer() {
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    async queryFn() {
      return await Repo.chat.ListChat()
    },
  })
  return (
    <div className="relative h-full overflow-y-auto">
      <div className="sticky top-0 px-4 py-2 bg-background/50 backdrop-blur">List Chat</div>
      {isLoading && <LoadingComponent />}
      {chats && (
        <div className="flex flex-col">
          {chats.map((chat) => (
            <Link
              key={chat.GetId()}
              className={cn("px-4 py-2 flex flex-row justify-between group relative")}
              to="/chat/$roomId"
              params={{ roomId: chat.GetRoomId() }}
              activeProps={{ className: "bg-foreground/5" }}
            >
              <span>{`${chat.GetRoomId()}`}</span>
              <span className="absolute right-2 top-0 opacity-0 transition-opacity group-hover:opacity-100 h-full flex flex-col items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-muted rounded p-1">
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Rename</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-destructive">Archive</DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
