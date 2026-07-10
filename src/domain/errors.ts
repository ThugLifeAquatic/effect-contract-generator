export class HelpRequested extends Error {
  readonly _tag = "HelpRequested";

  constructor() {
    super("Help requested");
    this.name = "HelpRequested";
  }
}

export class ArgumentParseError extends Error {
  readonly _tag = "ArgumentParseError";

  constructor(message: string) {
    super(message);
    this.name = "ArgumentParseError";
  }
}

export class InvalidUrlError extends Error {
  readonly _tag = "InvalidUrlError";

  constructor(public readonly url: string) {
    super(`Invalid URL: ${url}`);
    this.name = "InvalidUrlError";
  }
}

export class RequestExecutionError extends Error {
  readonly _tag = "RequestExecutionError";

  constructor(
    public readonly url: string,
    public readonly cause: unknown,
  ) {
    super(`Request failed before receiving a response for ${url}`);
    this.name = "RequestExecutionError";
  }
}

export class HttpStatusError extends Error {
  readonly _tag = "HttpStatusError";

  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly url: string,
  ) {
    super(`Request failed with status ${status} ${statusText} for ${url}`);
    this.name = "HttpStatusError";
  }
}

export class JsonDecodeError extends Error {
  readonly _tag = "JsonDecodeError";

  constructor(
    public readonly url: string,
    public readonly cause: unknown,
  ) {
    super(`Response body is not valid JSON for ${url}`);
    this.name = "JsonDecodeError";
  }
}

export class FormattingError extends Error {
  readonly _tag = "FormattingError";

  constructor(public readonly cause: unknown) {
    super("Failed to format generated TypeScript");
    this.name = "FormattingError";
  }
}

export class FileWriteError extends Error {
  readonly _tag = "FileWriteError";

  constructor(
    public readonly outputPath: string,
    public readonly cause: unknown,
  ) {
    super(`Failed to write generated contract to ${outputPath}`);
    this.name = "FileWriteError";
  }
}

export type AppError =
  | HelpRequested
  | ArgumentParseError
  | InvalidUrlError
  | RequestExecutionError
  | HttpStatusError
  | JsonDecodeError
  | FormattingError
  | FileWriteError;

type AppErrorTag = AppError["_tag"];

export function isTaggedError<TTag extends AppErrorTag>(
  cause: unknown,
  tag: TTag,
): cause is Extract<AppError, { _tag: TTag }> {
  return (
    typeof cause === "object" &&
    cause !== null &&
    "_tag" in cause &&
    (cause as { _tag: string })._tag === tag
  );
}
