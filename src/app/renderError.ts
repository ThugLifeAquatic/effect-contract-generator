import { Effect, Console } from "effect";
import { printUsage } from "../cli/usage.js";
import type { AppError } from "../domain/errors.js";

const setFailureExitCode = () =>
  Effect.sync(() => {
    process.exitCode = 1;
  });

function assertNever(value: never): never {
  // If a new AppError tag is added and not handled in the switch, this throws.
  throw new Error(`Unhandled AppError variant: ${String(value)}`);
}

// This is the interpreter from domain errors -> user-facing effects.
export function renderError(error: AppError) {
  switch (error._tag) {
    case "HelpRequested":
      return printUsage();

    case "ArgumentParseError":
      return Effect.gen(function* () {
        yield* Console.error(`❌ ${error.message}`);
        yield* printUsage();
        yield* setFailureExitCode();
      });

    case "InvalidUrlError":
      return Effect.gen(function* () {
        yield* Console.error(`❌ ${error.message}`);
        yield* Console.error("Tip: include protocol, e.g. https://api.example.com/resource");
        yield* setFailureExitCode();
      });

    case "RequestExecutionError":
      return Effect.gen(function* () {
        yield* Console.error(`❌ ${error.message}`);
        yield* Console.error(`Cause: ${String(error.cause)}`);
        yield* setFailureExitCode();
      });

    case "HttpStatusError":
      return Effect.gen(function* () {
        yield* Console.error(`❌ HTTP ${error.status} ${error.statusText} from ${error.url}`);
        yield* Console.error("Tip: verify auth headers/params and endpoint permissions.");
        yield* setFailureExitCode();
      });

    case "JsonDecodeError":
      return Effect.gen(function* () {
        yield* Console.error(`❌ ${error.message}`);
        yield* Console.error("Tip: this tool currently expects JSON responses.");
        yield* setFailureExitCode();
      });

    case "FormattingError":
      return Effect.gen(function* () {
        yield* Console.error(`❌ ${error.message}`);
        yield* Console.error(`Cause: ${String(error.cause)}`);
        yield* setFailureExitCode();
      });

    case "FileWriteError":
      return Effect.gen(function* () {
        yield* Console.error(`❌ ${error.message}`);
        yield* Console.error("Tip: check output path and file permissions.");
        yield* setFailureExitCode();
      });

    default:
      return assertNever(error);
  }
}
