/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as ChatImport } from "./routes/chat"
import { Route as IndexImport } from "./routes/index"
import { Route as ChatRoomIdImport } from "./routes/chat/$roomId"

// Create/Update Routes

const ChatRoute = ChatImport.update({
  path: "/chat",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const ChatRoomIdRoute = ChatRoomIdImport.update({
  path: "/$roomId",
  getParentRoute: () => ChatRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/chat": {
      id: "/chat"
      path: "/chat"
      fullPath: "/chat"
      preLoaderRoute: typeof ChatImport
      parentRoute: typeof rootRoute
    }
    "/chat/$roomId": {
      id: "/chat/$roomId"
      path: "/$roomId"
      fullPath: "/chat/$roomId"
      preLoaderRoute: typeof ChatRoomIdImport
      parentRoute: typeof ChatImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  ChatRoute: ChatRoute.addChildren({ ChatRoomIdRoute }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/chat"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/chat": {
      "filePath": "chat.tsx",
      "children": [
        "/chat/$roomId"
      ]
    },
    "/chat/$roomId": {
      "filePath": "chat/$roomId.tsx",
      "parent": "/chat"
    }
  }
}
ROUTE_MANIFEST_END */
