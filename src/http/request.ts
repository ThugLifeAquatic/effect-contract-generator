import { Console, Effect } from "effect";
import {
  HttpStatusError,
  InvalidUrlError,
  JsonDecodeError,
  RequestExecutionError,
  isTaggedError,
} from "../domain/errors.js";
import type { GenerateOptions } from "../types.js";

function buildUrl(baseUrl: string, params: Array<[string, string]>): string {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new InvalidUrlError(baseUrl);
  }

  // Append repeatable params so callers can pass keys multiple times if needed.
  for (const [key, value] of params) {
    url.searchParams.append(key, value);
  }

  return url.toString();
}

function buildHeaders(options: GenerateOptions): Headers {
  const headers = new Headers();

  for (const [name, value] of options.headers) {
    headers.set(name, value);
  }

  if (options.authBearer) {
    headers.set("Authorization", `Bearer ${options.authBearer}`);
  }

  if (options.authBasic) {
    // Encode as RFC 7617 credentials payload.
    const credentials = Buffer.from(options.authBasic).toString("base64");
    headers.set("Authorization", `Basic ${credentials}`);
  }

  return headers;
}

export type FetchJsonResult = {
  requestUrl: string;
  json: unknown;
};

export const fetchJson = (options: GenerateOptions) =>
  Effect.gen(function* () {
    const requestUrl = yield* Effect.try({
      try: () => buildUrl(options.url, options.params),
      catch: (cause) =>
        isTaggedError(cause, "InvalidUrlError") ? cause : new InvalidUrlError(options.url),
    });

    const requestHeaders = buildHeaders(options);

    yield* Console.log(`Fetching from ${requestUrl}...`);

    const response = yield* Effect.tryPromise(
      () =>
        fetch(requestUrl, {
          method: "GET",
          headers: requestHeaders,
        }),
      // Convert transport/runtime failures into a domain-level error.
    ).pipe(Effect.mapError((cause) => new RequestExecutionError(requestUrl, cause)));

    if (!response.ok) {
      yield* Effect.fail(new HttpStatusError(response.status, response.statusText, requestUrl));
    }

    const json = yield* Effect.tryPromise(() => response.json()).pipe(
      Effect.mapError((cause) => new JsonDecodeError(requestUrl, cause)),
    );

    return { requestUrl, json } satisfies FetchJsonResult;
  });
