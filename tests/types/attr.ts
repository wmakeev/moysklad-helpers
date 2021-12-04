import { PatchCollection } from 'moysklad-api-model'
import Moysklad from 'moysklad'

import { getHelpers } from '../../src'

const ms = Moysklad({ apiVersion: '1.2' })
const { attr } = getHelpers(ms)

const ATTR_ID = 'id'

const productPatch1: PatchCollection<'product'> = [
  {
    meta: { type: 'product', href: '' },
    attributes: [attr(`entity/product/metadata/attributes/${ATTR_ID}`, 'value')]
  }
]
productPatch1

// TODO Test entity type and href?
const productPatch2: PatchCollection<'product'> = [
  {
    meta: { type: 'product', href: '' },
    attributes: [attr(`foo/bar/${ATTR_ID}`, 'value')]
  }
]
productPatch2
