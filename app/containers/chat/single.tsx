import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useResponsiveStore } from "@/core/store/responsive"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { handleCommandCtrlEnter } from "@/lib/keydown"
import { useSession } from "@/hook/useSession"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Repo } from "@/core/repositories"
import type { Chat } from "@/core/entities/chat/entity"
import type { TChatMessage } from "@/core/entities/chat/interface"
import { ArrowUp } from "lucide-react"
import { NewChatComponent } from "@/components/chat/new"
import { Avatar } from "@/components/primitives/avatar"
import { differenceInDays, format, formatDistanceToNow } from "date-fns"
import type { TChatSendMessagePayload } from "@/core/repositories/chat/interface"
import { useNavigate } from "@tanstack/react-router"
import { useUIStore } from "@/core/store/ui"
import { breakpoints } from "@/core/config/responsive"
import { useWindowSize } from "@uidotdev/usehooks"
import { LoadingComponent } from "@/components/primitives/loading"

interface Props {
  roomKey?: string
}
export function ChatRoomContainer({ roomKey }: Props) {
  const navigate = useNavigate()
  const displayChatList = useUIStore().displayChatList
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const chatRoomRef = useRef<HTMLDivElement>(null)
  const { data: responsive, set: setResponsive } = useResponsiveStore()
  useSession()
  useEffect(() => {
    function setChatAreaHeight() {
      if (chatBoxRef.current) {
        setResponsive("chatbox-height", chatBoxRef.current.offsetHeight)
      }
      if (chatRoomRef.current) {
        setResponsive("chatroom-width", chatRoomRef.current.offsetWidth)
      }
    }
    setChatAreaHeight()
    window.addEventListener("resize", setChatAreaHeight)
    const interval = setInterval(() => {
      if (chatBoxRef.current) {
        setResponsive("chatbox-height", chatBoxRef.current.offsetHeight)
      }
    }, 100)
    return () => {
      window.removeEventListener("resize", setChatAreaHeight)
      clearInterval(interval)
    }
  }, [])

  const { data: chat, refetch } = useQuery({
    queryKey: ["chat", roomKey || "new"],
    async queryFn() {
      if (chatRoomRef?.current) {
        chatRoomRef.current.scrollTo(0, chatRoomRef.current.scrollHeight)
      }
      return await Repo.chat.GetChat(roomKey, { limit: 999, offset: 0 })
    },
  })
  const {
    mutate: sendMesage,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationKey: ["chat"],
    mutationFn: async (message: string) => {
      const payload: TChatSendMessagePayload = { message }
      if (roomKey) {
        payload.roomKey = roomKey
      }
      chat?.AddLastMessage({
        source: "human",
        content: message,
        timestamp: new Date(),
      })
      const key = await Repo.chat.SendMessage(payload)
      console.log({ key, roomKey })
      if (key !== roomKey) {
        navigate({ to: `/chat/${key}` })
      } else {
        await refetch()
      }
    },
  })
  useEffect(() => {
    refetch()
  }, [mutationError])
  async function submitPrompt(prompt: string) {
    if (!isPending) {
      sendMesage(prompt)
    }
  }
  return (
    <>
      <div
        ref={chatRoomRef}
        className="flex flex-col w-full relative h-[100dvh] overflow-y-auto"
        style={{
          maxHeight: `calc(100dvh-${responsive["chatbox-height"]}px)`,
        }}
      >
        {chat && (
          <div
            className="flex flex-col gap-2"
            style={{
              paddingBottom: `calc(${responsive["chatbox-height"]}px + 2rem)`,
            }}
          >
            <div
              className={cn(
                " sticky top-0 p-4 z-10 bg-background/50 backdrop-blur min-h-[4.25rem] flex flex-row items-center justify-start",
                !displayChatList && "pl-[4.5rem]",
              )}
            >
              <b>{chat.GetName()}</b>
            </div>
            <ChatMessageList chat={chat} isPending={isPending} />
          </div>
        )}
        {!chat && <NewChatComponent />}
        <ChatBox ref={chatBoxRef} submitPrompt={submitPrompt} isPending={isPending} />
      </div>
    </>
  )
}

export interface ChatBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  submitPrompt: (prompt: string) => void
  isPending: boolean
}

type ChatBoxInput = {
  prompt: string
}
const ChatBox = React.forwardRef<HTMLDivElement, ChatBoxProps>(({ className, submitPrompt, isPending, ...props }, ref) => {
  const displayChatList = useUIStore().displayChatList
  const { width } = useWindowSize()
  const { register, handleSubmit, setValue } = useForm<ChatBoxInput>({
    mode: "onSubmit",
  })
  const onSubmit: SubmitHandler<ChatBoxInput> = (data) => {
    submitPrompt(data.prompt)
    setValue("prompt", "")
    setPrompt("")
  }
  const [prompt, setPrompt] = useState("")
  function onInput(e: React.FormEvent<HTMLTextAreaElement>) {
    setPrompt(e.currentTarget.value)
  }
  return (
    <div
      {...props}
      ref={ref}
      className={cn("rounded-lg backdrop-blur fixed bottom-4 p-2 bg-muted/20 shadow-md transition-all border", className)}
      style={{
        width: width! < breakpoints.sm ? "calc(100vw - 2rem)" : displayChatList ? "calc(100vw - 18rem)" : "calc(100vw - 2rem)",
        left: width! < breakpoints.sm ? "1rem" : displayChatList ? "17rem" : "1rem",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-2 items-end">
        <div
          className="grid flex-1 text-sm after:pb-2 [&>textarea]:text-inherit after:text-inherit [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:overflow-y-auto [&>textarea]:[grid-area:1/1/2/2] after:[grid-area:1/1/2/2] after:whitespace-pre-wrap after:invisible after:content-[attr(data-cloned-val)_'_'] after:border after:max-h-[30vh] after:overflow-y-hidden"
          data-cloned-val={prompt}
        >
          <Textarea
            rows={1}
            placeholder="Type a message..."
            className="border-none outline-none focus-visible:ring-0"
            {...register("prompt", { required: true })}
            onInput={onInput}
            onKeyDown={handleCommandCtrlEnter(handleSubmit(onSubmit))}
          />
        </div>
        <Button size={"icon"} className="rounded-full w-9 h-9 aspect-square items-center justify-center" disabled={isPending}>
          {isPending ? <LoadingComponent showMessage={false} /> : <ArrowUp />}
        </Button>
      </form>
    </div>
  )
})

export function ChatMessageList({ chat, isPending }: { chat: Chat; isPending: boolean }) {
  return (
    <div className="px-4">
      {chat.GetMessages().map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {isPending && <ChatMessageAIThinking />}
    </div>
  )
}
function ChatMessageAIThinking({ message = "Finding your best answer..." }: { message?: string }) {
  return (
    <div className={cn("flex flex-row gap-4")}>
      <Avatar alt={"AI"} />
      <div className="flex flex-col gap-2 max-w-[calc(100%-8rem)]">
        <div className="bg-muted px-4 py-2 rounded-lg">
          <LoadingComponent message={message} />
        </div>
      </div>
    </div>
  )
}
export function ChatMessage({ message }: { message: TChatMessage }) {
  const [now, setNow] = React.useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className={cn("flex flex-row gap-4 pb-4", message.source === "human" ? "justify-end" : "")}>
      {message.source === "ai" && <Avatar alt={"AI"} />}
      <div className="flex flex-col gap-2 max-w-[calc(100%-8rem)]">
        <div className="bg-muted px-4 py-2 rounded-lg">{message.content}</div>
        <div className="text-xs text-white/50">
          {differenceInDays(message.timestamp, now) > 1
            ? format(message.timestamp, "LL")
            : formatDistanceToNow(message.timestamp, {
                addSuffix: false,
                includeSeconds: false,
              })}
        </div>
      </div>
    </div>
  )
}
