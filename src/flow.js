import polyFilter from 'poly-filter'
import pipe from 'function-pipe'
import { extract, construct, collect, spread, applicator } from './message'
import { sequential, parallel, apply, forAll } from './transport'

const identity = x => x

export const when = (condition, yes, no = identity) => input => {
  const original = construct(input)
  const branch = x => (extract(x) ? yes(original) : no(original))
  const flow = sequential([ condition, branch ])

  return flow(original)
}

export const either = (left, right) => input => {
  const original = construct(input)
  const branch = x => (extract(x) === undefined ? right(original) : x)
  const flow = sequential([ left, branch ])

  return flow(original)
}

export const choice = (condition, options, defaultOption = identity) => input => {
  const original = construct(input)
  const branch = x => (options[extract(x)] || defaultOption)(original)
  const flow = sequential([ condition, branch ])

  return flow(original)
}

export const map = func => sequential([ spread, forAll(func), collect ])

export const filter = func => sequential([
  spread,
  forAll(when(func, identity, () => undefined)),
  polyFilter(x => x !== undefined),
  collect
])

export const chain = (...steps) => sequential(steps)

export const all = (...steps) => sequential([ parallel(steps), collect ])

export const functionCall = func => (...args) => sequential([
  construct,
  parallel(args.concat([identity])),
  apply(func)
])

export const lift = pipe(applicator, functionCall)
