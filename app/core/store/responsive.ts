import { create } from "zustand"

type TField = "chatbox-height" | "chatroom-width"
type TData = {
  [key in TField]: any
}
type TResponsiveStore = {
  data: TData
  set: (field: TField, value: any) => void
}

export const useResponsiveStore = create<TResponsiveStore>()((set) => ({
  data: {
    "chatbox-height": 0,
    "chatroom-width": 0,
  },
  set: (field: TField, value: any) => {
    set((state) => ({
      data: {
        ...state.data,
        [field]: value,
      },
    }))
  },
}))
