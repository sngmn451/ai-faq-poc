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
import type { Chat } from "@/core/entities/chat/repository"
import type { TChat, TChatMessage } from "@/core/entities/chat/interface"
import { ArrowUp } from "lucide-react"
import { NewChatComponent } from "@/components/chat/new"
import { Avatar } from "@/components/primitives/avatar"
import { differenceInDays, format, formatDistanceToNow } from "date-fns"
import type { TChatSendMessagePayload } from "@/core/repositories/chat/interface"

interface Props {
  roomId?: string
}
export function ChatRoomContainer({ roomId }: Props) {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const charRoomRef = useRef<HTMLDivElement>(null)
  const { data: responsive, set: setResponsive } = useResponsiveStore()
  useSession()
  useEffect(() => {
    function setChatAreaHeight() {
      if (chatBoxRef.current) {
        setResponsive("chatbox-height", chatBoxRef.current.offsetHeight)
      }
      if (charRoomRef.current) {
        setResponsive("chatroom-width", charRoomRef.current.offsetWidth)
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
    queryKey: ["chat", roomId || ""],
    async queryFn() {
      return await Repo.chat.GetChat(roomId)
    },
  })
  const {
    mutate: sendMesage,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["chat"],
    mutationFn: async (message: string) => {
      const payload: TChatSendMessagePayload = { message }
      if (roomId) {
        payload.roomId = roomId
      }
      await Repo.chat.SendMessage(payload)
      await refetch()
    },
  })
  async function submitPrompt(prompt: string) {
    await sendMesage(prompt)
  }
  return (
    <>
      <div
        ref={charRoomRef}
        className="p-4 flex flex-col w-full relative min-h-[100dvh]"
        style={{
          maxHeight: `calc(100dvh-${responsive["chatbox-height"]}px)`,
        }}
      >
        {chat && (
          <div className="flex flex-col gap-2">
            <ChatMessageList chat={chat} />
          </div>
        )}
        {!chat && <NewChatComponent />}
        <ChatBox ref={chatBoxRef} submitPrompt={submitPrompt} />
      </div>
    </>
  )
}

export interface ChatBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  submitPrompt: (prompt: string) => void
}

type ChatBoxInput = {
  prompt: string
}
const ChatBox = React.forwardRef<HTMLDivElement, ChatBoxProps>(({ className, submitPrompt, ...props }, ref) => {
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
      className={cn("rounded-lg backdrop-blur absolute w-[calc(100%-2rem)] bottom-4 p-2 bg-muted/20 shadow-md transition-[width]", className)}
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
        <Button size={"icon"} className="rounded-full w-9 h-9 aspect-square">
          <ArrowUp />
        </Button>
      </form>
    </div>
  )
})

export function ChatMessageList({ chat }: { chat: Chat }) {
  return (
    <>
      {/* {JSON.stringify(chats)} */}
      {chat.GetMessages().map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </>
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
    <div className={cn("flex flex-row gap-4", message.source === "human" ? "justify-end" : "")}>
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
