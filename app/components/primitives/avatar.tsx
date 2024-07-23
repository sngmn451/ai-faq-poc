export function Avatar({ avatarUrl, alt }: { avatarUrl?: string; alt: string }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={alt} className="w-8 h-8 rounded-full" />
  }
  return <div className="w-8 h-8 rounded-full bg-muted flex flex-col items-center justify-center">{alt}</div>
}
