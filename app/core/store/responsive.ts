import { create } from "zustand"

type TField = "chat-height"
type TData = {
  [key in TField]: any
}
type TResponsiveStore = {
  data: TData
  set: (field: TField, value: any) => void
}

export const useResponsiveStore = create<TResponsiveStore>()((set) => ({
  data: {
    "chat-height": 0,
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
