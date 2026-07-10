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

## Architecture notes

### Runtime flow

1. Parse CLI args in `src/cli/parseArgs.ts` (pure function).
2. Build and run the Effect program in `src/main.ts`.
3. Fetch and decode JSON in `src/http/request.ts`.
4. Infer schema source from response shape in `src/domain/inferSchema.ts`.
5. Format and write generated contract in `src/generator/generateContract.ts`.
6. Render all domain failures through `src/app/renderError.ts`.

### Error model

- Errors are represented as tagged classes in `src/domain/errors.ts`.
- The `_tag` discriminant enables exhaustive switching in `renderError`.
- Unknown failures at boundaries are mapped into domain errors before interpretation.

### Inference decisions

- Object keys are emitted as bare identifiers only when TypeScript-safe.
- Unsafe or reserved keys are quoted.
- Arrays are inferred from all elements.
- Homogeneous arrays produce `Schema.Array(ItemSchema)`.
- Heterogeneous arrays produce `Schema.Array(Schema.Union(...))`.

### Test strategy

- Unit tests focus on pure logic and domain behavior.
- `parseArgs` tests CLI parsing and validation paths.
- `inferSchema` tests primitives, nested structures, key safety, and mixed arrays.
- `errors` tests tagged error guards and narrowing behavior.
- `renderError` uses `it.effect` to validate Effectful interpreter behavior.
