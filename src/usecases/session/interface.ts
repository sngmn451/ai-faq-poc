export interface ISessionUsecase {
  Create(): Promise<{
    id: string
    expires: Date
  }>
}
