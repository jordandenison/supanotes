import type { Id, NullableId, Params } from '@feathersjs/feathers'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { KnexService } from '@feathersjs/knex'
import { v4 as uuidv4 } from 'uuid'

const processNewData = <A extends { id?: string; accountId?: string; userId?: string }>(
  data: A,
  table: string,
  params?: Params
): A => {
  const newData = { ...data, createdAt: new Date(), updatedAt: new Date() } as A

  if (!newData.id) {
    newData.id = uuidv4()
  }

  return newData
}

interface IHasUpdatedAt {
  updatedAt: Date
}

export class BaseService<
  T,
  A extends { id?: string; updatedAt?: Date | string },
  B extends KnexAdapterParams<any>, // eslint-disable-line
  C
> extends KnexService<T, A, B, C> {
  async create(data: A, params?: B): Promise<T>
  async create(data: A[], params?: B): Promise<T[]>
  async create(data: A | A[], params?: B): Promise<T | T[]> {
    const newData: A | A[] = Array.isArray(data)
      ? data.map((item: A) => processNewData<A>(item, this.fullName, params))
      : processNewData<A>(data, this.fullName, params)

    return super.create(newData, params)
  }

  async patch(id: NullableId, data: C, params?: B): Promise<T[]>
  async patch(id: Id, data: C, params?: B): Promise<T>
  async patch(id: null, data: C, params?: B): Promise<T[]>
  async patch(id: NullableId | Id | null, data: C, params?: B): Promise<T | T[]> {
    (data as IHasUpdatedAt).updatedAt = new Date()

    return super.patch(id, data, params)
  }

  async update(id: Id, data: A, params?: B): Promise<T> {
    data.updatedAt = new Date()

    return super.update(id, data, params)
  }
}
