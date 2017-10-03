import createDictionary from './dictionary'
import * as message from './message'

export const {
  get, set, lift, fragment,
  all, constant,
  not, and, or, xor,
  add, subtract, multiply, divide,
  eq, neq, gt, lt, gte, lte, isDefined, isUndefined
} = createDictionary({ flow: 'sync' })

export { message }