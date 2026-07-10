import { beforeEach, describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { renderError } from "../src/app/renderError.js";
import { HelpRequested, InvalidUrlError } from "../src/domain/errors.js";

describe("renderError", () => {
    beforeEach(() => {
        process.exitCode = undefined;
    });

    it.effect("sets exit code for failing errors", () =>
        Effect.gen(function* () {
            yield* renderError(new InvalidUrlError("bad-url"));
            expect(process.exitCode).toBe(1);
        })
    );

    it.effect("does not set exit code for help", () =>
        Effect.gen(function* () {
            yield* renderError(new HelpRequested());
            expect(process.exitCode).toBeUndefined();
        })
    );
});
