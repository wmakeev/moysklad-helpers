import test from 'tape'
import { getRefMetaType } from '../src'

test('getRefMetaType', t => {
  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/customentity/123-456'
    ),
    'customentity'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/demand/metadata/attributes/123-456'
    ),
    'attributemetadata'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/demand/metadata/states/123-456'
    ),
    'state'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/context/companysettings/pricetype/123-456'
    ),
    'pricetype'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/demand/123-456'
    ),
    'demand'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/demand/123-456/positions/123-456'
    ),
    'demandposition'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/customerorder/123-456/positions/123-456'
    ),
    'customerorderposition'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/invoicein/123-456/positions/123-456'
    ),
    'invoiceinposition'
  )

  t.equal(
    getRefMetaType(
      'https://api.moysklad.ru/api/remap/1.2/entity/counterparty/123-456/accounts/123-456'
    ),
    'account'
  )

  t.equal(
    getRefMetaType('https://api.moysklad.ru/api/remap/1.2/audit/123-456'),
    'audit'
  )

  t.end()
})
