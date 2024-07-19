import type { PropsWithChildren } from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChatRoom } from "@/containers/ai/container"

const queryClient = new QueryClient()
export function MainContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatRoom />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
