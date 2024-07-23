import { create } from "zustand"
import { breakpoints } from "../config/responsive"

type TUIStore = {
  displayChatList: boolean
  setDisplayChatList(value: boolean): void
}

export const useUIStore = create<TUIStore>()((set) => ({
  displayChatList: window.innerWidth < breakpoints.sm ? false : true,
  setDisplayChatList: (value) => set({ displayChatList: value }),
}))
