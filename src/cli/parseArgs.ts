import { ArgumentParseError, HelpRequested } from "../domain/errors.js";
import type { GenerateOptions } from "../types.js";

function readRequiredValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new ArgumentParseError(`Missing value for ${flag}`);
  }
  return value;
}

function parseKeyValue(input: string, flag: string, separator: string): [string, string] {
  // Split only on the first separator so values can still contain ':' or '='.
  const separatorIndex = input.indexOf(separator);
  if (separatorIndex <= 0) {
    throw new ArgumentParseError(
      `Invalid ${flag} value: ${input}. Expected <key${separator}value>.`,
    );
  }

  const key = input.slice(0, separatorIndex).trim();
  const value = input.slice(separatorIndex + 1).trim();

  if (!key || !value) {
    throw new ArgumentParseError(
      `Invalid ${flag} value: ${input}. Expected non-empty key and value.`,
    );
  }

  return [key, value];
}

function validateContractName(contractName: string): void {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(contractName)) {
    throw new ArgumentParseError(
      `Invalid contract name \"${contractName}\". Use a valid TypeScript identifier.`,
    );
  }
}

// Keep argument parsing pure and synchronous so it is easy to test.
export function parseArgs(args: string[]): GenerateOptions {
  const options: GenerateOptions = {
    url: "https://jsonplaceholder.typicode.com/users/1",
    outputPath: "./GeneratedContracts.ts",
    contractName: "User",
    params: [],
    headers: [],
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--help") {
      throw new HelpRequested();
    }

    if (arg === "--url") {
      options.url = readRequiredValue(args, i, arg);
      i += 1;
      continue;
    }

    if (arg === "--output") {
      options.outputPath = readRequiredValue(args, i, arg);
      i += 1;
      continue;
    }

    if (arg === "--name") {
      options.contractName = readRequiredValue(args, i, arg);
      i += 1;
      continue;
    }

    if (arg === "--param") {
      const input = readRequiredValue(args, i, arg);
      options.params.push(parseKeyValue(input, arg, "="));
      i += 1;
      continue;
    }

    if (arg === "--header") {
      const input = readRequiredValue(args, i, arg);
      options.headers.push(parseKeyValue(input, arg, ":"));
      i += 1;
      continue;
    }

    if (arg === "--auth-bearer") {
      options.authBearer = readRequiredValue(args, i, arg);
      i += 1;
      continue;
    }

    if (arg === "--auth-basic") {
      options.authBasic = readRequiredValue(args, i, arg);
      i += 1;
      continue;
    }

    throw new ArgumentParseError(`Unknown argument: ${arg}`);
  }

  if (options.authBearer && options.authBasic) {
    // Keep auth configuration explicit to avoid silently choosing one mode.
    throw new ArgumentParseError("Use either --auth-bearer or --auth-basic, not both.");
  }

  validateContractName(options.contractName);
  return options;
}
