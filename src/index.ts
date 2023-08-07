import { ClickHouseClient, createClient } from '@clickhouse/client'
import pLimit from 'p-limit'

const host = 'http://localhost:8123'
const username = 'default'
const password = undefined

const requests = 1000
const workers = 20

async function main() {
  await runPerformanceTest(true)
  await runPerformanceTest(false)
}

async function runPerformanceTest(keep_alive: boolean) {
  const client = await createClickHouseClient(keep_alive)
  const averageResponseTime = await measureAverageResponseTime(client, keep_alive)
  console.log(`Average response time with keep alive ${keep_alive}: ${averageResponseTime}ms`)
  await client.close()
}

async function measureAverageResponseTime(client: ClickHouseClient, keep_alive: boolean) {
  const limit = pLimit(workers)
  const queries = Array.from({length: requests}, () => limit(async () => {
    const start = process.hrtime()
    await client.query({
      query: 'SELECT 1',
      format: 'JSONEachRow'
    })
    const responseTime = process.hrtime(start)[1] / 1000000
    return responseTime
  }))
  const responseTimes = await Promise.all(queries)
  return responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
}

async function createClickHouseClient(keep_alive: boolean) {
  return createClient({
    host,
    username,
    password,
    keep_alive: {
      enabled: keep_alive
    },
    compression: {
      response: false,
      request: false
    }
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
