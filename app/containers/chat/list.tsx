import { LoadingComponent } from "@/components/primitives/loading"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { breakpoints } from "@/core/config/responsive"
import { Repo } from "@/core/repositories"
import { useUIStore } from "@/core/store/ui"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { useWindowSize } from "@uidotdev/usehooks"
import { MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChatDataContainer } from "./data"

export function ChatListContainer() {
  const { width } = useWindowSize()
  const setDisplayChatList = useUIStore().setDisplayChatList
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    async queryFn() {
      return await Repo.chat.ListChat()
    },
  })
  return (
    <div className="relative h-full overflow-y-auto">
      <div className="sticky top-0 px-4 py-2 bg-background/50 backdrop-blur">
        <Alert>
          <AlertTitle>
            <b>FAQ AI Bot</b>
          </AlertTitle>
          <AlertDescription>
            <p>Demo project using GPT-4o-mini to create AI chat bot to find the best answer for your question in FAQ knowledge based.</p>
            <div className="h-2" />
            <Dialog>
              <DialogTrigger className="text-primary hover:underline">View mock data</DialogTrigger>
              <DialogContent>
                <div className="max-h-[80dvh] overflow-y-auto">
                  <ChatDataContainer />
                </div>
              </DialogContent>
            </Dialog>
          </AlertDescription>
        </Alert>
      </div>
      {isLoading && <LoadingComponent />}
      {chats && (
        <div className="flex flex-col">
          {chats.map((chat) => (
            <Link
              key={chat.GetId()}
              className={cn("px-4 py-2 flex flex-row justify-between group relative")}
              to="/chat/$roomKey"
              params={{ roomKey: chat.GetKey() }}
              activeProps={{ className: "bg-foreground/5" }}
              onClick={() => {
                if (width! < breakpoints.sm) {
                  setDisplayChatList(false)
                }
              }}
            >
              <span>{chat.GetName() || chat.GetKey()}</span>
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
