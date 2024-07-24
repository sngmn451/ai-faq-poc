import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { storage } from "@/core/config/analytic"
import { loadScript } from "@/lib/load-script"
import { useEffect } from "react"

const GA_TAG_ID = import.meta.env.PUBLIC_GA_TAGID

export function useConsent() {
  const { toast } = useToast()
  useEffect(() => {
    loadTracking()
    if (!getPrompt()) {
      toast({
        title: "🍪 Cookies Alert!",
        description: "Please allow me to collect anonymous usage data.",
        variant: "default",
        duration: Infinity,
        action: (
          <div className="flex flex-col gap-1 sm:flex-row">
            <ToastAction
              className="border-border hover:bg-muted focus:outline-none"
              onClick={() => consentAction(true)}
              altText="Allow consent"
            >
              Sure
            </ToastAction>
            <ToastAction
              className="border-none hover:bg-muted focus:outline-none"
              onClick={() => consentAction(false)}
              altText="Disallow consent"
            >
              Nah!
            </ToastAction>
          </div>
        ),
        className: "border-border",
      })
    }
  }, [])
  function consentAction(isConsent: boolean) {
    setConsent(isConsent)
  }
}

function getPrompt() {
  return localStorage.getItem(storage.promp) === "true"
}
function setConsent(accept: boolean) {
  localStorage.setItem(storage.promp, String(true))
  localStorage.setItem(storage.consent, String(accept))

  window.gtag("consent", "default", {
    ad_personalization: "denied",
    ad_user_data: "denied",
    ad_storage: "denied",
    analytics_storage: accept ? "granted" : "denied",
    functionality_storage: accept ? "granted" : "denied",
    personalization_storage: "denied",
    security_storage: "denied",
  })
}

function loadTracking() {
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_TAG_ID}`, function () {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    gtag("js", new Date())
    gtag("config", GA_TAG_ID, {
      debug_mode: import.meta.env.DEV || Number(new URL(window.location.href).searchParams.get("debug")) === 1,
    })
    window.gtag = gtag
  })
}
declare global {
  interface Window {
    dataLayer: any | []
  }
}
