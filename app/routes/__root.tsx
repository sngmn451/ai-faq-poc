import { useConsent } from "@/hook/useConsent"
import { useSession } from "@/hook/useSession"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient()
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  useSession()
  useConsent()
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        {import.meta.env.DEV && <TanStackRouterDevtools />}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />}
        <Toaster />
      </QueryClientProvider>
    </>
  )
}
