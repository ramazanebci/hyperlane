import map from 'poly-map'
import pipe from 'function-pipe'
import { lift, extract, construct, collect } from './message'
import * as core from './core'
import * as essentials from './essentials'
import createFlow from './flow'
import { fragment, defragment } from './fragment'

const createDictionary = conf => {
  const flow =
    typeof conf.flow === 'function'
      ? conf.flow
      : createFlow(conf.flow)

  return {
    ...map(fragment(flow.call), core),
    ...map(fragment(flow.call), essentials),
    lift: pipe(lift, fragment(flow.call)),
    call: (func, ...args) => fragment(flow.call, lift(func))(...args),
    when: fragment(flow.when, extract),
    chain: fragment(flow.chain, map(defragment)),
    all: fragment(flow.all, collect),
  }
}

export default createDictionary
