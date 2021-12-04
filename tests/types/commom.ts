import Moysklad from 'moysklad'
import { EntityRef, Patch } from 'moysklad-api-model'
import { getHelpers } from '../../src'
import { noop, testTypeEqual } from '../tools'

const ms = Moysklad()

const { ref } = getHelpers(ms)

const orderPatch: Patch<'customerorder'> = {
  // TODO Почему тут нет ошибки? Работает как any.
  state: ref('foo') as EntityRef<never>
}

testTypeEqual<EntityRef<'state'>>(ref('foo'))

noop(orderPatch)
