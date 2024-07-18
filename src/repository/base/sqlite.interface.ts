export interface IBaseSqliteRepository<T> {
  testConnection(): Promise<boolean>
  create(item: T): Promise<T>
  update(id: string, item: T): Promise<T>
  delete(id: string): Promise<void>
  get(id: string): Promise<T | undefined>
  getAll(): Promise<T[]>
  getMany(ids: string[]): Promise<T[]>
}
