import type { Instance } from 'moysklad'

import { EntityRef, EntityRefOrPath, Path } from './types'

function isEntityRef(val: any): val is EntityRef {
  return val?.meta?.href != null
}

function getShortHrefMetaType(shortHref: string) {
  switch (true) {
    case shortHref.indexOf('entity/customentity') === 0:
      return 'customentity'

    case shortHref.indexOf('metadata/attributes') !== -1:
      return 'attributemetadata'

    case shortHref.indexOf('metadata/states') !== -1:
      return 'state'

    case shortHref.indexOf(
      'context/companysettings/metadata/customEntities'
    ) === 0:
      return 'customentitymetadata'

    case shortHref.indexOf('context/companysettings/pricetype') === 0:
      return 'pricetype'

    default:
      const parts = shortHref.split('/')
      if (parts[0] === 'entity' && parts[1]) {
        if (parts[3] === 'positions') {
          return `${parts[1]}position`
        } else {
          return parts[1]
        }
      }
      throw new Error('Неизвестный тип сокращенного href - ' + shortHref)
  }
}

// TODO Как правильно ограничить M чтобы не было примеси (напр. `EntityRef & object`), когда M value не указан
type RefType = <T extends EntityRefOrPath | undefined, M>(
  path: T,
  value?: M
) => T extends EntityRefOrPath
  ? EntityRef & M
  : T extends EntityRefOrPath | undefined
  ? (EntityRef & M) | undefined
  : never

export function getHelpers(ms: Instance) {
  /**
   * Возвращает href для некого пути
   *
   * ```ts
   * href('')
   * ```
   */
  const href = (path: Path | EntityRef): string => {
    if (isEntityRef(path)) {
      return ms.buildUrl(path.meta.href)
    } else {
      return ms.buildUrl(path)
    }
  }

  // TODO Подумать, возможно оптимизировать, чтобы не вызывать href несколько раз
  const getStrPath = (path: Path | EntityRef) =>
    ms.parseUrl(href(path)).path.join('/')

  const meta = (path: Path | EntityRef) => ({
    type: getShortHrefMetaType(getStrPath(path)),
    href: href(path)
  })

  const attr = <T>(path: Path, value: T) => {
    if (getShortHrefMetaType(getStrPath(path)) !== 'attributemetadata') {
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

  const ref: RefType = (path, value) => {
    return path != null
      ? Object.assign({}, value as any, { meta: meta(path!) }) // ? { ...value, meta: meta(path!) }
      : undefined
  }

  const positionRef = <T>(
    docPath: Path | EntityRef,
    posId: string,
    value?: T
  ) => {
    return ref(href(docPath) + `/positions/${posId}`, value)
  }

  const refEqual = (
    entityRef1: Path | EntityRef,
    entityRef2: Path | EntityRef
  ) => {
    return entityRef1 == null || entityRef2 == null
      ? false
      : href(entityRef1) === href(entityRef2)
  }

  const copyEntRefs = <T extends EntityRef, K extends keyof T>(
    srcEntity: T,
    fieldNames: K[]
  ) => {
    return fieldNames.reduce((res, fieldName) => {
      const curFieldVal = srcEntity[fieldName]

      if (isEntityRef(curFieldVal)) {
        res[fieldName] = {
          meta: curFieldVal.meta
        } as EntityRef
      }

      return res
    }, {} as { [P in K]: EntityRef })
  }

  const copyFields = <T extends EntityRef, K extends keyof T>(
    srcEntity: T,
    fieldNames: Array<K>
  ) => {
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
    copyEntRefs,
    copyFields
  }
}
