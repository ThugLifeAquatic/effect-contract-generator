import { describe, expect, it } from "@effect/vitest";
import { ArgumentParseError, InvalidUrlError, isTaggedError } from "../src/domain/errors.js";

describe("errors", () => {
    it("recognizes tagged app errors", () => {
        const error = new InvalidUrlError("not-a-url");

        expect(isTaggedError(error, "InvalidUrlError")).toBe(true);
        expect(isTaggedError(error, "ArgumentParseError")).toBe(false);
    });

    it("returns false for non-error values", () => {
        expect(isTaggedError(null, "InvalidUrlError")).toBe(false);
        expect(isTaggedError("oops", "InvalidUrlError")).toBe(false);
    });

    it("keeps strong narrowing semantics", () => {
        const cause: unknown = new ArgumentParseError("bad arg");

        if (isTaggedError(cause, "ArgumentParseError")) {
            expect(cause.message).toContain("bad arg");
        } else {
            throw new Error("Expected ArgumentParseError narrowing to succeed");
        }
    });
});
