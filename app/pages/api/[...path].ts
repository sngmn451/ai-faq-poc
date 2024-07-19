import Api from "~/server"
import type { APIRoute } from "astro"

const ApiHandler: APIRoute = ({ request, locals }) => Api.fetch(request, locals.runtime.env)

export {
  ApiHandler as GET,
  ApiHandler as POST,
  ApiHandler as PUT,
  ApiHandler as DELETE,
  ApiHandler as HEAD,
  ApiHandler as PATCH,
  ApiHandler as TRACE,
  ApiHandler as OPTIONS,
  ApiHandler as CONNECT,
}
