import type { IBaseApiRepository } from "./api.interface"

export class BaseApiRepository implements IBaseApiRepository {
  baseUrl = "/api"
}
