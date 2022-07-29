import {
  CompanyMetaType,
  DocumentPositionType,
  DocumentWithPositionsMetaType,
  DomineEntityMetaType,
  RemapApiHref
} from 'moysklad-api-model'

import { getHelpers } from './index'

export interface Meta<T extends string = string> {
  type: T
  href: string
}

export interface EntityRef<T extends string = string> {
  meta: Meta<T>
}

export function isEntityRef(val: any): val is EntityRef {
  return val?.meta?.href != null
}

export interface Entity<T extends string = string> extends EntityRef<T> {
  id: string
}

export interface EntityAttribute<T> extends Entity {
  value: T
}

export interface EntityWithAttributes<T> extends Entity {
  attributes: EntityAttribute<T>[]
}

// TODO Нужно прописать все варианты

// prettier-ignore

export type HrefMetaType<Ref extends string> =
  // 1.
  Ref extends RemapApiHref<infer Rest>
    ? HrefMetaType<Rest>

  // 2. entity/../../../..
  : Ref extends `entity/${string}/${string}/${string}/${string}`
    // metadata/..
    ? Ref extends `entity/${string}/metadata/${string}/${string}`
      // metadata/attributes
      ? Ref extends `entity/${string}/metadata/attributes/${string}`
        ? 'attributemetadata'

      // metadata/state
      : Ref extends `entity/${string}/metadata/states/${string}`
        ? 'state'

      // metadata/?
      : never

    // ../positions/..
    : Ref extends `entity/${string}/${string}/positions/${string}`
      ? Ref extends `entity/${infer M}/${string}/positions/${string}`
        ? M extends DocumentWithPositionsMetaType
          ? DocumentPositionType[M]
          : never
        : never

    // ../accounts/..
    : Ref extends `entity/${string}/${string}/accounts/${string}`
      ? Ref extends `entity/${infer M}/${string}/accounts/${string}`
        ? M extends CompanyMetaType
          ? 'account'
          : never
        : never

    // entity/?/?/?/?
    : never

  // 3. entity/../../..
  : Ref extends `entity/${string}/${string}/${string}`
    ? never

  // 4. entity/../..
  : Ref extends `entity/${string}/${string}`
    ? Ref extends `entity/${infer M}/${string}`
      ? M extends DomineEntityMetaType
        ? M
        : never
      : never

  // 5.
  : Ref extends `context/companysettings/metadata/customEntities/${string}`
    ? 'customentitymetadata'

  // 6.
  : Ref extends `context/companysettings/pricetype/${string}`
    ? 'pricetype'

  : never

export type Helpers = ReturnType<typeof getHelpers>
