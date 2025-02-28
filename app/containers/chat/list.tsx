import { LoadingComponent } from "@/components/primitives/loading"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { breakpoints } from "@/core/config/responsive"
import { Repo } from "@/core/repositories"
import { useUIStore } from "@/core/store/ui"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { useWindowSize } from "@uidotdev/usehooks"
import { Check, Database, MoreHorizontal, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChatDataContainer } from "./data"
import { Lightbulb } from "lucide-react"
import type { Chat } from "@/core/entities/chat/entity"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, type SubmitHandler } from "react-hook-form"

export function ChatListContainer() {
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
            <p className="text-xs">
              AI powered chat bot to find the best answer for your question in
              FAQ knowledge based.
            </p>
            <div className="h-2" />
            <div>
              <Dialog>
                <DialogTrigger className="inline-flex gap-1 text-primary hover:underline items-center">
                  <Lightbulb size={14} />
                  Concept
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Concept</DialogTitle>
                  <DialogDescription className="[&>p]:pb-3 [&>h3]:pb-1 [&>h3]:text-white/80">
                    <h3>Background</h3>
                    <p>
                      AI is a huge topic nowadays, and it looks like it’s not
                      just another buzzword, as its growth has been exponential
                      and it has a proven record of reducing workloads across
                      various domains.
                    </p>
                    <p>
                      However, with vast amounts of data in its memory and
                      sometimes ambiguous contexts, AI can make mistakes when
                      generating content.
                    </p>
                    <h3>Concept</h3>
                    <p>
                      With the simple context we provide, AI could be a great
                      fit for finding the best possible answer based on the user
                      prompt, as it understands natural language well (proved by
                      its ability to help me correct grammar in all blog posts).
                    </p>
                    <p>
                      This <b>proof-of-concept</b> project intends to create a
                      “smart enough” chatbot that can:
                    </p>
                    <ul className="[&>li]:list-disc pl-4">
                      <li>Understand users' languages</li>
                      <li>Understand users' contexts</li>
                      <li>Understand users' questions</li>
                      <li>
                        Provide users’ answers from the <b>DATABASE</b> provided
                        only
                      </li>
                      <li>Answer users’ questions in their language</li>
                    </ul>
                    <p>
                      Please note that this AI won’t try to think about answers
                      outside the provided scope, and the DATA provided is
                      limited. Sometimes it won’t answer the correct question.
                    </p>
                    <p>
                      However, this can be solved in real-world use cases if we
                      have enough data. Or let AI answer that it doesn’t know
                      and open the text box for contacting customer support
                      instead.
                    </p>
                  </DialogDescription>
                  <p>
                    For those who are interested in a similar solution, please
                    visit:{" "}
                    <a
                      target="_blank"
                      href="https://specialnormal.com"
                      className="text-primary hover:underline"
                    >
                      Special Normal
                    </a>
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger className="inline-flex gap-1 items-center text-primary hover:underline">
                  <Database size={14} /> View mock data
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    <Alert>
                      <Lightbulb />
                      <AlertTitle>
                        <b>Mock Data</b>
                      </AlertTitle>
                      <AlertDescription>
                        Example data of FAQs of intercom generated by AI
                      </AlertDescription>
                    </Alert>
                  </DialogTitle>
                  <div className="max-h-[80dvh] overflow-y-auto">
                    <ChatDataContainer />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-[10px] pt-1 text-muted-foreground">
              With ♥️ by{" "}
              <a
                href="https://sittipong.com"
                target="_blank"
                className="text-[#477eff] underline underline-offset-2"
              >
                Sittipong
              </a>
              ,{" "}
              <a
                href="https://specialnormal.com"
                target="_blank"
                className="text-[#477eff] underline underline-offset-2"
              >
                Special Normal
              </a>
            </p>
          </AlertDescription>
        </Alert>
      </div>
      {isLoading && <LoadingComponent />}
      {chats && (
        <div className="flex flex-col">
          {chats.map((chat, index) => (
            <ChatListItem chat={chat} key={index} />
          ))}
        </div>
      )}
    </div>
  )
}

type ChatRenameInput = {
  name: string
}
function ChatListItem({ chat }: { chat: Chat }) {
  const { width } = useWindowSize()
  const setDisplayChatList = useUIStore().setDisplayChatList
  const [isRename, setIsRename] = useState<boolean>(false)

  const { register, handleSubmit, formState } = useForm<ChatRenameInput>({
    mode: "onSubmit",
    defaultValues: { name: chat.GetName() },
  })
  const { isSubmitting } = formState
  const onSubmit: SubmitHandler<ChatRenameInput> = async (data) => {
    const response = await Repo.chat.Rename({
      roomKey: chat.GetKey(),
      name: data.name,
    })
    if (response) {
      chat.Rename(data.name)
      setIsRename(false)
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-2 flex flex-row justify-between group relative has-[.current]:bg-foreground/5",
      )}
    >
      {!isRename && (
        <>
          <Link
            key={chat.GetId()}
            to="/chat/$roomKey"
            params={{ roomKey: chat.GetKey() }}
            activeProps={{ className: "current" }}
            onClick={() => {
              if (width! < breakpoints.sm) {
                setDisplayChatList(false)
              }
            }}
          >
            <span>{chat.GetName() || chat.GetKey()}</span>
          </Link>
          <span className="absolute right-2 top-0 opacity-0 transition-opacity group-hover:opacity-100 h-full flex flex-col items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-muted rounded p-1">
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel onMouseDown={() => setIsRename(true)}>
                  Rename
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-destructive">
                  Archive
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </>
      )}
      {isRename && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("name", { required: true })}
            className="max-w-44"
            disabled={isSubmitting}
          />
          <span className="absolute right-2 top-0 h-full flex flex-row gap-1 items-center justify-center">
            {isSubmitting && <LoadingComponent />}
            {!isSubmitting && (
              <>
                <Button size={"icon"} className="w-6 h-6">
                  <Check size={16} />
                </Button>
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  onMouseDown={() => setIsRename(false)}
                  className="w-6 h-6"
                >
                  <X size={16} />
                </Button>
              </>
            )}
          </span>
        </form>
      )}
    </div>
  )
}
