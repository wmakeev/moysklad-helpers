import { HrefMetaType } from '../../src/types'
import { noop } from '../tools'

const t10: HrefMetaType<'entity/demand/metadata/attributes/123-456'> =
  'attributemetadata'

// @ts-expect-error
// never
const e11: HrefMetaType<'entity/demand/metadata/attributes3/123-456'> = 'demand'

const t12: HrefMetaType<'https://api.moysklad.ru/api/remap/1.2/entity/demand/metadata/attributes/123-456'> =
  'attributemetadata'

// @ts-expect-error
// never
const e12: HrefMetaType<'https://api.moysklad.ru/FOO/remap/1.2/entity/demand/metadata/attributes/123-456'> =
  'never'

const t20: HrefMetaType<'entity/invoiceout/metadata/states/123-456'> = 'state'

const t30: HrefMetaType<'context/companysettings/metadata/customEntities/123-456'> =
  'customentitymetadata'

const t40: HrefMetaType<'context/companysettings/pricetype/123-456'> =
  'pricetype'

const t50: HrefMetaType<'entity/customerorder/123-456'> = 'customerorder'

const t60: HrefMetaType<'entity/purchaseorder/123-456/positions/123-456'> =
  'purchaseorderposition'

const t70: HrefMetaType<'audit/123-456'> = 'audit'

const t80: HrefMetaType<'entity/counterparty/123-456/accounts/123-456'> =
  'account'

// @ts-expect-error
// never
const t100: HrefMetaType<'foo'> = 'never'

noop(t10, e11, t12, e12, t20, t30, t40, t50, t60, t70, t80, t100)
