import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useResponsiveStore } from "@/core/store/responsive"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { handleCommandCtrlEnter } from "@/lib/keydown"
import { useSession } from "@/hook/useSession"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Repo } from "@/core/repositories"
import type { Chat } from "@/core/entities/chat/repository"
import type { TChatMessage } from "@/core/entities/chat/interface"

// type ChatMeta = {
//   avatarUrl?: string
//   alt: string
// }
// type Chat = {
//   source: "human" | "ai"
//   content: string
//   timestamp: Date
//   meta: ChatMeta
// }

export function ChatRoom() {
  const chatAreaRef = useRef<HTMLDivElement>(null)
  // const [chats, setChats] = React.useState<Chat[]>([])
  const { data: responsive, set: setResponsive } = useResponsiveStore()
  useSession()
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

  const { data: chats } = useQuery({
    queryKey: ["chats"],
    async queryFn() {
      return (await Repo.chat.ListChat()) || []
    },
  })
  function submitPrompt(prompt: string) {
    // setChats((cur) => {
    //   return [
    //     ...cur,
    //     {
    //       source: "human",
    //       content: prompt,
    //       timestamp: new Date(),
    //       meta: { avatarUrl: undefined, alt: "Human" },
    //     },
    //   ]
    // })
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
          {JSON.stringify(chats)}
          {/* <ChatMessageList chat={chats as Chat} /> */}
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
const ChatBox = React.forwardRef<HTMLDivElement, ChatBoxProps>(({ className, submitPrompt, ...props }, ref) => {
  const { register, handleSubmit, setValue } = useForm<ChatBoxInput>({
    mode: "onSubmit",
  })
  const onSubmit: SubmitHandler<ChatBoxInput> = (data) => {
    submitPrompt(data.prompt)
    setValue("prompt", "")
  }

  return (
    <div {...props} className={cn("w-[calc(100vw-2rem)] rounded-lg fixed bottom-4 left-4 p-4 bg-muted/20 shadow-md", className)}>
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
})

// export function ChatMessageList({ chat }: { chat: Chat }) {
//   return (
//     <>
//       {chat.getMessage().map((message) => (
//         <ChatMessage key={message.timestamp.toString()} message={message} />
//       ))}
//     </>
//   )
// }
// export function ChatMessage({ message }: { message: TChatMessage }) {
//   const [now, setNow] = React.useState(new Date())
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setNow(new Date())
//     }, 1000)
//     return () => clearInterval(interval)
//   }, [])
//   return (
//     <div className={cn("flex flex-row gap-4", message.source === "human" ? "justify-end" : "")}>
//       {message.source === "ai" && <Avatar avatarUrl={message.meta.avatarUrl} alt={message.meta.alt} />}
//       <div className="flex flex-col gap-2">
//         <div className="bg-muted px-4 py-2 rounded-lg">{message.content}</div>
//         <div className="text-xs text-white/50">
//           {differenceInDays(message.timestamp, now) > 1
//             ? format(message.timestamp, "LL")
//             : formatDistanceToNow(message.timestamp, {
//                 addSuffix: false,
//                 includeSeconds: false,
//               })}
//         </div>
//       </div>
//     </div>
//   )
// }

// export function Avatar({ avatarUrl, alt }: { avatarUrl?: string; alt: string }) {
//   if (avatarUrl) {
//     return <img src={avatarUrl} alt={alt} className="w-8 h-8 rounded-full" />
//   }
//   return <div className="w-8 h-8 rounded-full bg-muted flex flex-col items-center justify-center">{alt}</div>
// }
