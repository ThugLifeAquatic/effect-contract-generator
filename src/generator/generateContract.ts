import { Effect, Console } from "effect";
import * as fs from "node:fs/promises";
import prettier from "prettier";
import { FileWriteError, FormattingError } from "../domain/errors.js";
import { inferSchema } from "../domain/inferSchema.js";
import { fetchJson } from "../http/request.js";
import type { GenerateOptions } from "../types.js";

// Effect.gen keeps this effectful workflow readable without losing typed errors.
export const generateContract = (options: GenerateOptions) =>
  Effect.gen(function* () {
    const { json } = yield* fetchJson(options);

    yield* Console.log("Inferring structural contract...");
    const schemaBody = inferSchema(json);

    const fileContent = [
      `import { Schema } from "effect";`,
      "",
      `export const ${options.contractName}Contract = ${schemaBody};`,
      "",
      `export type ${options.contractName} = Schema.Schema.Type<typeof ${options.contractName}Contract>;`,
      "",
    ].join("\n");

    const formattedContent = yield* Effect.tryPromise(() =>
      prettier.format(fileContent, { parser: "typescript" }),
    ).pipe(Effect.mapError((cause) => new FormattingError(cause)));

    yield* Console.log(`Writing TS contract to ${options.outputPath}...`);
    yield* Effect.tryPromise(() =>
      fs.writeFile(options.outputPath, formattedContent, "utf-8"),
    ).pipe(Effect.mapError((cause) => new FileWriteError(options.outputPath, cause)));

    yield* Console.log("🎉 Contract generation complete!");
  });
