import { EntityRef, HrefMetaType } from '../types'

/**
 * Возвращает MetaType для указанной ссылки
 *
 * @param href Cсылка или href
 * @returns MetaType для указанной ссылки
 */
export function getRefMetaType<T extends `https://${string}`>(
  href: T
): HrefMetaType<T>

/**
 * Возвращает MetaType для указанной ссылки
 *
 * @param ref Сокращенная ссылка
 * @returns MetaType для указанной ссылки
 */
export function getRefMetaType<T extends string>(ref: T): HrefMetaType<T>

/**
 * Возвращает MetaType
 *
 * @param entityRef Объект ссылка
 * @returns MetaType
 */
export function getRefMetaType<T extends string>(
  entityRef: EntityRef<T>
): HrefMetaType<T>

export function getRefMetaType(anyRef: any) {
  if (anyRef?.meta?.href) {
    return getRefMetaType(anyRef.meta.href)
  }

  if (anyRef.substr(0, 8) === 'https://') {
    const parts = anyRef.substr(8).split('/')
    if (parts[1] === 'api' && parts[2] === 'remap') {
      return getRefMetaType(parts.slice(4).join('/'))
    } else {
      throw new Error(`Некорректный href - ${anyRef}`)
    }
  }

  // TODO Возможно тут нужно сравнивать не под подстроке а по массиву (path)
  switch (true) {
    case anyRef.indexOf('entity/customentity') === 0:
      return 'customentity'

    case anyRef.indexOf('metadata/attributes') !== -1:
      return 'attributemetadata'

    case anyRef.indexOf('metadata/states') !== -1:
      return 'state'

    case anyRef.indexOf('context/companysettings/metadata/customEntities') ===
      0:
      return 'customentitymetadata'

    case anyRef.indexOf('context/companysettings/pricetype') === 0:
      return 'pricetype'

    default:
      const parts = anyRef.split('/')
      if (parts[0] === 'entity' && parts[1]) {
        if (parts[3] === 'positions') {
          return `${parts[1]}position`
        } else {
          return parts[1]
        }
      }

      throw new Error('Неизвестный тип сокращенного href - ' + anyRef)
  }
}
