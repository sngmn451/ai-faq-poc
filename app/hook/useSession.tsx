import Cookies from "js-cookie"
import { useEffect } from "react"

const TIMEOUT = 1000 * 60 * 5 // 5 minutes
export function useSession() {
  useEffect(() => {
    checkSession()
    let timeout: NodeJS.Timeout
    timeout = setInterval(checkSession, TIMEOUT)
    return () => {
      clearInterval(timeout)
    }
  }, [])
}

async function checkSession() {
  const session = Cookies.get("session")
  if (!session) {
    await renewSession()
  }
}

async function renewSession() {
  await fetch("/api/v1/sessions/renew")
}
