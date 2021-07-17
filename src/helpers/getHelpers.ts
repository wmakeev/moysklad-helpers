import type { Instance } from 'moysklad'
import {
  DocumentPositionType,
  DocumentWithPositionsMetaType,
  MetaType
} from 'moysklad-api-model'
import { EntityRef, isEntityRef, HrefMetaType, Meta } from '../types'
import { getRefMetaType } from './getRefMetaType'

export function getHelpers(ms: Instance) {
  /**
   * Возвращает href для некого пути
   */
  function href<T extends string>(ref: T): string

  function href<M extends MetaType>(entityRef: EntityRef<M>): string

  function href(path: any) {
    if (isEntityRef(path)) {
      return ms.buildUrl(path.meta.href)
    } else {
      return ms.buildUrl(path)
    }
  }

  function meta<T extends string>(path: T): Meta<HrefMetaType<T>>

  function meta<M extends MetaType>(entityRef?: EntityRef<M>): Meta<M>

  function meta(path: any) {
    return {
      type: getRefMetaType(path),
      href: href(path)
    }
  }

  const attr = <T>(path: string, value: T) => {
    if (getRefMetaType(path) !== 'attributemetadata') {
      throw new Error('attr: Href не соответствует типу атрибута')
    }

    return {
      meta: {
        type: 'attributemetadata',
        href: href(path)
      },
      value
    }
  }

  function ref<T extends string>(path: T): EntityRef<HrefMetaType<T>>
  function ref<T extends string>(
    path: T | undefined
  ): EntityRef<HrefMetaType<T>> | undefined

  function ref<M extends MetaType>(entityRef?: EntityRef<M>): EntityRef<M>
  function ref<M extends MetaType>(
    entityRef?: EntityRef<M> | undefined
  ): EntityRef<M> | undefined

  function ref(path: any) {
    return path != null ? { meta: meta(path) } : undefined
  }

  function positionRef<T extends string>(
    documentRef: T,
    positionId: string
  ): HrefMetaType<T> extends DocumentWithPositionsMetaType
    ? EntityRef<DocumentPositionType[HrefMetaType<T>]>
    : never

  function positionRef<M extends DocumentWithPositionsMetaType>(
    documentRef: EntityRef<M>,
    positionId: string
  ): EntityRef<DocumentPositionType[M]>

  function positionRef(...args: any[]) {
    const docHref = href(args[0])
    return ref(`${docHref}/positions/${args[1]}`)
  }

  const refEqual = (
    entityRef1: string | EntityRef | null | undefined,
    entityRef2: string | EntityRef | null | undefined
  ): boolean => {
    return entityRef1 == null || entityRef2 == null
      ? false
      : href(entityRef1 as any) === href(entityRef2 as any)
  }

  function copyFieldsRefs<T extends EntityRef, K extends keyof T>(
    srcEntity: T,
    fieldNames: K[]
  ) {
    return fieldNames.reduce(
      (res, fieldName) => {
        const curFieldVal = srcEntity[fieldName]

        if (isEntityRef(curFieldVal)) {
          res[fieldName] = ref(curFieldVal as EntityRef<MetaType>) as any
        } else {
          res[fieldName] = curFieldVal as any
        }

        return res
      },
      {} as {
        [P in K]: T[P] extends EntityRef<infer M> ? EntityRef<M> : T[P]
      }
    )
  }

  function copyFields<T extends EntityRef, K extends keyof T>(
    srcEntity: T,
    fieldNames: Array<K>
  ) {
    return fieldNames.reduce((res, fieldName) => {
      const curFieldVal = srcEntity[fieldName]

      if (curFieldVal != null) {
        res[fieldName] = curFieldVal
      }

      return res
    }, {} as { [P in K]: T[P] })
  }

  return {
    href,
    attr,
    meta,
    ref,
    positionRef,
    refEqual,
    copyFields,
    copyFieldsRefs
  }
}