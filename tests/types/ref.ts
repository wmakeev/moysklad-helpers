import Moysklad from 'moysklad'
import { Account } from 'moysklad-api-model'

import { EntityRef, getHelpers } from '../../src'
import { noop } from '../tools'

const ms = Moysklad({ apiVersion: '1.2' })
const { ref } = getHelpers(ms)

// customentity

const t10: EntityRef<'customentity'> = ref('entity/customentity/123-456')

const t11: EntityRef<'customentity'> = ref(
  'https://api.moysklad.ru/api/remap/1.2/entity/customentity/123-456'
)

// attributemetadata

const t20: EntityRef<'attributemetadata'> = ref(
  'entity/demand/metadata/attributes/123-456'
)

const t21: EntityRef<'customentity'> = ref(
  'https://api.moysklad.ru/api/remap/1.2/entity/customentity/123-456'
)

const account = {} as Account

const t30: EntityRef<'account'> = ref(account)

noop(t10, t11, t20, t21, t30)
