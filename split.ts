// This file contains the logic used to generate the chunks of data.
import { readFileSync, writeFileSync } from 'fs'

const file = readFileSync('./mrkl-full.json').toString('utf-8')
const allClaims = JSON.parse(file).claims

const sortedAddresses: string[] = Object.keys(allClaims)
sortedAddresses.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1)

// evenly divides 252803, the number of claims, into 2503 files
const DESIRED_COHORT_SIZE = 101

type LastAddress = string
const addressChunks: { [firstAddress: string]: LastAddress } = {}

for (let i = 0; i < sortedAddresses.length; i += DESIRED_COHORT_SIZE) {
  const lastIndex = Math.min(i + DESIRED_COHORT_SIZE - 1, sortedAddresses.length - 1)
  addressChunks[sortedAddresses[i].toLowerCase()] = sortedAddresses[lastIndex].toLowerCase()
  writeFileSync(`./chunks/${sortedAddresses[i].toLowerCase()}.json`, JSON.stringify(sortedAddresses.slice(i, lastIndex + 1).reduce((claims, addr) => {
    claims[addr] = allClaims[addr]
    return claims
  }, <{ [address: string]: any }>{})))
}

writeFileSync(`./chunks/mapping.json`, JSON.stringify(addressChunks))

