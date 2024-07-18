export function Prefetch() {
  return Prefetchs.all()
}
export function Preload() {
  return Preloads.all()
}

type TPreload = {
  url: string
  as: "style" | "script" | "font" | "image" | "fetch" | "track"
}
class preload {
  constructor(private list: TPreload[] = []) {}
  add(item: TPreload) {
    this.list.push(item)
  }
  remove(url: string) {
    this.list = this.list.filter((item) => item.url !== url)
  }
  all() {
    return this.list.map((item) => (
      <link rel="preload" href={item.url} as={item.as} />
    ))
  }
}
class prefetch {
  constructor(private urls: string[] = []) {}
  add(url: string, type: string) {
    this.urls.push(url)
  }
  remove(url: string) {
    this.urls = this.urls.filter((item) => item !== url)
  }
  all() {
    return this.urls.map((item) => <link rel="prefech" href={item} />)
  }
}
const Prefetchs = new prefetch()
const Preloads = new preload()
