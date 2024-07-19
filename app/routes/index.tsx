import { LoadingComponent } from "@/components/primitives/loading"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/")({
  component: Component,
})

function Component() {
  const navigate = Route.useNavigate()
  useEffect(() => {
    navigate({
      to: "/chat",
    })
  }, [])
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <LoadingComponent />
    </div>
  )
}
