export const RESPONSE = {
  401: new Response(
    JSON.stringify({
      success: false,
    }),
    {
      status: 401,
    }
  ),
  422: new Response(
    JSON.stringify({
      success: false,
      message: "Unprocessable Entity",
    }),
    {
      status: 422,
    }
  ),
}
