# clickhouse-js performance test

This is a performance test for [clickhouse-js](https://github.com/ClickHouse/clickhouse-js/), intended to reproduce an issue where performance is degraded when using keep-alive. 

## Dependencies
- NodeJS
- yarn
- ClickHouse

## Usage
1. Make sure clickhouse is running, edit index.ts to change host or credentials.
2. `yarn`
3. `yarn start`
