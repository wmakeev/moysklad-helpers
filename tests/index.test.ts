import test from 'tape'
import Moysklad from 'moysklad'

import { EntityRef, getHelpers } from '../src'
import { noop } from './tools'

const ENDPOINT = 'https://online.moysklad.ru/api/remap/1.2'

test('href', t => {
  const ms = Moysklad({ apiVersion: '1.2' })
  const { href } = getHelpers(ms)

  const ref1 =
    'entity/customerorder/metadata/attributes/39f9f7bc-d4da-11e4-95df-0cc47a05161a'

  const href1 = ms.buildUrl(ref1) as `${typeof ENDPOINT}/${typeof ref1}`

  const entityRef1: EntityRef<'attributemetadata'> = {
    meta: {
      type: 'attributemetadata',
      href: href1
    }
  }

  t.equal(href(href1), href1, 'should return href for href')
  t.equal(href(ref1), href1, 'should return href for ref')
  t.equal(href(entityRef1), href1, 'should return href for entityRef')

  t.equal(
    href('https://online.moysklad.ru/api/remap/1.1/entity/customerorder'),
    'https://online.moysklad.ru/api/remap/1.2/entity/customerorder',
    'should rebuild url with other api version'
  )

  t.end()
})

test('meta', t => {
  const ms = Moysklad({ apiVersion: '1.2' })
  const { meta, href } = getHelpers(ms)

  const ATTR_REF =
    'entity/cashin/metadata/attributes/10b16e0a-c64b-4243-96c1-196472fc1d21'

  const CUSTOM_REF =
    'entity/customentity/8280660e-48ec-4015-896d-239f116ddad7/515d1f0f-cd2d-458c-8840-864cc4e96089'

  const STATE_REF =
    'entity/contract/metadata/states/b10df47c-fe57-11e6-7a34-3acf0007bd21'

  const PRICE_TYPE_REF =
    'context/companysettings/pricetype/e0b1a992-f9c5-44aa-8cee-afa0257a95e6'

  const ENTITY_REF = 'entity/customerorder/e0b4a992-f9c5-44aa-8cee-0fa0257a95e6'

  const POSITIONS_REF =
    'entity/customerorder/dbc32eaf-a39e-13e9-912f-f3d400026eaf/positions'

  t.deepEqual(
    meta(ATTR_REF),
    {
      type: 'attributemetadata',
      href: href(ATTR_REF)
    },
    'should return attributemetadata meta object'
  )

  t.deepEqual(
    meta(CUSTOM_REF),
    {
      type: 'customentity',
      href: href(CUSTOM_REF)
    },
    'should return customentity meta object'
  )

  t.deepEqual(
    meta(STATE_REF),
    {
      type: 'state',
      href: href(STATE_REF)
    },
    'should return state meta object'
  )

  t.deepEqual(
    meta(PRICE_TYPE_REF),
    {
      type: 'pricetype',
      href: href(PRICE_TYPE_REF)
    },
    'should return pricetype meta object'
  )

  t.deepEqual(
    meta(ENTITY_REF),
    {
      type: 'customerorder',
      href: href(ENTITY_REF)
    },
    'should return entity meta object'
  )

  t.deepEqual(
    meta(ENTITY_REF),
    {
      type: 'customerorder',
      href: href(ENTITY_REF)
    },
    'should return entity meta object'
  )

  t.deepEqual(
    meta(POSITIONS_REF),
    {
      type: 'customerorderposition',
      href: href(POSITIONS_REF)
    },
    'should return position meta object'
  )

  t.throws(
    () => {
      meta('entity2/cashin/10b16e0a-c64b-4243-96c1-196472fc1d21')
    },
    /Неизвестный тип сокращенного href/,
    'should throw error if unknown href'
  )

  t.end()
})

test('attr', t => {
  const ms = Moysklad({ apiVersion: '1.2' })
  const { attr } = getHelpers(ms)

  const ref1 =
    'entity/customerorder/metadata/attributes/39f9f7bc-d4da-11e4-95df-0cc47a05161a'

  const HREF1 = ms.buildUrl(ref1)

  const attr1 = {
    meta: {
      type: 'attributemetadata',
      href: HREF1
    },
    value: 'foo'
  }

  t.deepEqual(attr(HREF1, 'foo'), attr1, 'should return href for href')
  t.deepEqual(attr(ref1, 'foo'), attr1, 'should return href for ref')

  t.throws(
    () => {
      attr('entity/customerorder', 'bar')
    },
    /Href не соответствует типу атрибута/,
    'should throw error on not attribute href'
  )

  t.end()
})

test('ref', t => {
  const ms = Moysklad({ apiVersion: '1.2' })
  const { ref } = getHelpers(ms)

  const ref1 =
    'entity/customerorder/metadata/attributes/39f9f7bc-d4da-11e4-95df-0cc47a05161a'

  const HREF1 = ms.buildUrl(ref1) as `${typeof ENDPOINT}/${typeof ref1}`

  const entityRef1: EntityRef<'attributemetadata'> = {
    meta: {
      type: 'attributemetadata',
      href: HREF1
    }
  }

  const result11: EntityRef<'attributemetadata'> = ref(HREF1)

  t.deepEqual(result11.meta, entityRef1.meta, 'should return entityRef (11)')

  const result12: EntityRef<string> = ref(ref1)

  t.deepEqual(result12.meta, entityRef1.meta, 'should return entityRef (12)')

  const result2: EntityRef<string> & {
    foo: string
  } = {
    ...ref(HREF1),
    foo: 'bar'
  }

  t.deepEqual(result2.meta, entityRef1.meta, 'should return entityRef (2)')
  t.strictEqual(result2.foo, 'bar', 'should return extended entityRef (2)')

  // @ts-expect-error
  const result3: {
    meta: {
      type: 'attributemetadata3'
      href: string
    }
  } = ref(entityRef1)
  noop(result3)

  t.deepEqual(result2.meta, entityRef1.meta, 'should return entityRef (2)')

  const result9 = ref(undefined)
  t.deepEqual(
    result9,
    undefined,
    'should return undefined for undefined path arg'
  )

  const result10: EntityRef<'account'> = ref(
    'entity/organization/8fa61aaf-36cc-11ea-0a80-04d200088ba4/accounts/0855a906-5b29-11eb-0a80-052300107764'
  )
  t.equal(result10.meta.type, 'account')

  t.end()
})

test('positionRef', t => {
  const ms = Moysklad({ apiVersion: '1.2' })

  const { ref, href, positionRef } = getHelpers(ms)

  const posId = '39f9f7bc-d4da-11e4-95df-0cc47a051618'

  const ref1 = 'entity/customerorder/39f9f7bc-d4da-11e4-95df-0cc47a05161a'

  const posHref1 = href(
    `${ref1}/positions/${posId}`
  ) as `${typeof ENDPOINT}/${typeof ref1}/positions/${string}`

  const positionRef1: EntityRef<'customerorderposition'> = ref(posHref1)

  const result1 = positionRef(ref1, posId)

  t.deepEqual(result1, positionRef1, 'should return position entityRef')

  const result2 = {
    ...positionRef(ref1, posId),
    quantity: 2
  }

  t.deepEqual(result2.quantity, 2, 'should return extended position entityRef')

  t.end()
})

test('refEqual', t => {
  const ms = Moysklad({ apiVersion: '1.2' })
  const { refEqual, ref, href } = getHelpers(ms)

  const ref1 = 'entity/customerorder/39f9f7bc-d4da-11e4-95df-0cc47a05161a'

  t.equal(refEqual(ref1, ref(ref1)), true, 'should test for equals #1')

  t.equal(refEqual(ref(ref1), href(ref1)), true, 'should test for equals #2')

  t.equal(refEqual(ref(ref1), ref(ref1)), true, 'should test for equals #3')

  t.equal(refEqual('foo', ref(ref1)), false, 'should test for equals #4')

  t.equal(refEqual(null, ref(ref1)), false, 'should test for equals #5')

  t.equal(refEqual(ref(ref1), undefined), false, 'should test for equals #6')

  t.end()
})

test('copyFields', t => {
  const ms = Moysklad({ apiVersion: '1.2' })
  const { ref, copyFields } = getHelpers(ms)

  const ref1 =
    'entity/customerorder/metadata/attributes/39f9f7bc-d4da-11e4-95df-0cc47a05161a'

  const HREF1 = ms.buildUrl(ref1) as `${typeof ENDPOINT}/${typeof ref1}`

  const src = {
    ...ref(HREF1),
    a: {
      ...ref('entity/customerorder/123-456'),
      name: 'foo'
    },
    b: ref(HREF1),
    c: 42
  }

  const result1: {
    a: EntityRef<'customerorder'> & { name: string }
    c: number
  } = copyFields(src, ['a', 'c'])

  // @ts-expect-error
  const result2: {
    a: EntityRef<'customerorder'>
    b: EntityRef<'attributemetadata'>
    c: number
  } = copyFields(src, ['a', 'c'])

  noop(result2)

  t.equal(
    result1.a.meta.href,
    `${ENDPOINT}/entity/customerorder/123-456`,
    'should copy field #1'
  )

  t.equal(result1.a.name, `foo`, 'should copy field #2')

  t.equal(
    // @ts-expect-error
    result1.b,
    undefined,
    'should not copy field'
  )

  t.equal(result1.c, 42, 'should copy field #3')

  t.end()
})

test('copyFieldsRefs', t => {
  const ms = Moysklad({ apiVersion: '1.2' })
  const { ref, copyFieldsRefs } = getHelpers(ms)

  const ref1 =
    'entity/customerorder/metadata/attributes/39f9f7bc-d4da-11e4-95df-0cc47a05161a'

  const HREF1 = ms.buildUrl(ref1) as `${typeof ENDPOINT}/${typeof ref1}`

  const src = {
    ...ref(HREF1),
    a: {
      ...ref('entity/customerorder/123-456'),
      name: 'foo'
    },
    b: ref(HREF1),
    c: 42
  }

  const result1: {
    a: EntityRef<'customerorder'>
    c: number
  } = copyFieldsRefs(src, ['a', 'c'])

  // @ts-expect-error
  const result2: {
    a: EntityRef<'customerorder'> & { name: string }
    c: number
  } = copyFieldsRefs(src, ['a', 'c'])

  // @ts-expect-error
  const result3: {
    a: EntityRef<'customerorder'>
    b: EntityRef<'attributemetadata'>
    c: number
  } = copyFieldsRefs(src, ['a', 'c'])

  noop(result2, result3)

  t.equal(
    result1.a.meta.href,
    `${ENDPOINT}/entity/customerorder/123-456`,
    'should copy entityRef field'
  )

  t.equal(
    // @ts-expect-error
    result1.b,
    undefined,
    'should not copy entityRef field'
  )

  t.equal(result1.c, 42, 'should copy not entityRef field')

  t.end()
})
