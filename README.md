# effect-contract-generator

Generate Effect Schema contracts from live JSON API responses.

## Features

- CLI for endpoint, params, headers, and auth
- Typed, tagged domain errors with an interpreter
- Prettier-formatted generated contracts
- Unit tests using Vitest + @effect/vitest

## Requirements

- Node.js 20+
- npm

## Install

```bash
npm install
```

## Generate a contract

```bash
npm run generate
```

Generate from a custom endpoint:

```bash
npm run generate -- \
  --url https://jsonplaceholder.typicode.com/comments \
  --param postId=1 \
  --name Comment \
  --output ./GeneratedContracts.ts
```

## Test

```bash
npm test
```

## Format

```bash
npm run format
```

## Project structure

- src/main.ts: app entrypoint
- src/cli: argument parsing and usage output
- src/domain: schema inference and typed errors
- src/http: request construction and fetch/json handling
- src/generator: generation workflow
- src/app: error interpreter
- tests: test suite
