import { Effect } from "effect";
import { parseArgs } from "./cli/parseArgs.js";
import { renderError } from "./app/renderError.js";
import { ArgumentParseError, isTaggedError } from "./domain/errors.js";
import { generateContract } from "./generator/generateContract.js";

async function main(): Promise<void> {
  // Parse CLI args at the edge, then hand control to the Effect program.
  const program = Effect.gen(function* () {
    const cliOptions = yield* Effect.try({
      try: () => parseArgs(process.argv.slice(2)),
      catch: (cause) =>
        isTaggedError(cause, "HelpRequested") || isTaggedError(cause, "ArgumentParseError")
          ? cause
          : new ArgumentParseError(`Invalid CLI input: ${String(cause)}`),
    });

    yield* generateContract(cliOptions);
  });

  // Centralize all user-facing failures in one interpreter.
  const handledProgram = program.pipe(Effect.catchAll(renderError));

  // runPromise is the boundary where we execute the lazy Effect program.
  await Effect.runPromise(handledProgram);
}

void main();
