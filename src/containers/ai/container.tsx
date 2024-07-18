import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useResponsiveStore } from "@/core/store/responsive"
import { cn } from "@/lib/utils"
import { format, differenceInDays, formatDistanceToNow } from "date-fns"
import { useEffect, useRef } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { handleCommandCtrlEnter } from "@/lib/keydown"

type ChatMeta = {
  avatarUrl?: string
  alt: string
}
type Chat = {
  source: "human" | "ai"
  content: string
  timestamp: Date
  meta: ChatMeta
}

export function ChatRoom() {
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const [chats, setChats] = React.useState<Chat[]>([])
  const { data: responsive, set: setResponsive } = useResponsiveStore()
  useEffect(() => {
    function setChatAreaHeight() {
      if (chatAreaRef.current) {
        setResponsive("chat-height", chatAreaRef.current.offsetHeight)
      }
    }
    setChatAreaHeight()
    window.addEventListener("resize", setChatAreaHeight)
    return () => {
      window.removeEventListener("resize", setChatAreaHeight)
    }
  }, [])
  function submitPrompt(prompt: string) {
    setChats((cur) => {
      return [
        ...cur,
        {
          source: "human",
          content: prompt,
          timestamp: new Date(),
          meta: { avatarUrl: undefined, alt: "Human" },
        },
      ]
    })
  }
  return (
    <>
      <div
        className="p-4 w-full"
        style={{
          maxHeight: `calc(100dvh-${responsive["chat-height"]}px)`,
        }}
      >
        <div className="flex flex-col gap-2">
          <ChatMessageList chats={chats} />
        </div>
        <ChatBox ref={chatAreaRef} submitPrompt={submitPrompt} />
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
const ChatBox = React.forwardRef<HTMLDivElement, ChatBoxProps>(
  ({ className, submitPrompt, ...props }, ref) => {
    const { register, handleSubmit, setValue } = useForm<ChatBoxInput>({
      mode: "onSubmit",
    })
    const onSubmit: SubmitHandler<ChatBoxInput> = (data) => {
      submitPrompt(data.prompt)
      setValue("prompt", "")
    }

    return (
      <div
        {...props}
        className={cn(
          "w-[calc(100vw-2rem)] rounded-lg fixed bottom-4 left-4 p-4 bg-muted/20 shadow-md",
          className
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Textarea
            placeholder="Type a message..."
            className="resize-none hover:resize-y"
            {...register("prompt", { required: true })}
            onKeyDown={handleCommandCtrlEnter(handleSubmit(onSubmit))}
          />
          <div className="flex flex-row justify-end">
            <Button>Send</Button>
          </div>
        </form>
      </div>
    )
  }
)

export function ChatMessageList({ chats }: { chats: Chat[] }) {
  return (
    <>
      {chats.map((chat) => (
        <ChatMessage key={chat.timestamp.toString()} chat={chat} />
      ))}
    </>
  )
}
export function ChatMessage({ chat }: { chat: Chat }) {
  return (
    <div
      className={cn(
        "flex flex-row gap-4",
        chat.source === "human" ? "justify-end" : ""
      )}
    >
      {chat.source === "ai" && (
        <Avatar avatarUrl={chat.meta.avatarUrl} alt={chat.meta.alt} />
      )}
      <div className="flex flex-col gap-2">
        <div className="bg-muted px-4 py-2 rounded-lg">{chat.content}</div>
        <div className="text-xs text-white/50">
          {differenceInDays(chat.timestamp, new Date()) > 1
            ? format(chat.timestamp, "LL")
            : formatDistanceToNow(chat.timestamp)}
        </div>
      </div>
    </div>
  )
}

export function Avatar({
  avatarUrl,
  alt,
}: {
  avatarUrl?: string
  alt: string
}) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={alt} className="w-8 h-8 rounded-full" />
  }
  return (
    <div className="w-8 h-8 rounded-full bg-muted flex flex-col items-center justify-center">
      {alt}
    </div>
  )
}
