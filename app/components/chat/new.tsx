import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useResponsiveStore } from "@/core/store/responsive"
import { Sparkles } from "lucide-react"

export function NewChatComponent() {
  const responsive = useResponsiveStore().data

  return (
    <div
      className="w-full h-full flex-1 flex flex-col items-center justify-center"
      style={{
        paddingBottom: `calc(${responsive["chatbox-height"]}px + 1rem)`,
      }}
    >
      <div className="flex-1" />
      <Alert>
        <Sparkles size={16} />
        <AlertTitle>FAQ AI Bot</AlertTitle>
        <AlertDescription>
          <p>Demonstrate AI chat bot to find the best answer for your question in FAQ knowledge based.</p>
          <p className="animate-bounce mt-4">Try it out! 👇</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
