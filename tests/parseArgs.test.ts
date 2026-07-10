import { describe, expect, it } from "@effect/vitest";
import { parseArgs } from "../src/cli/parseArgs.js";
import { ArgumentParseError, HelpRequested } from "../src/domain/errors.js";

describe("parseArgs", () => {
    it("returns defaults when no args are provided", () => {
        const result = parseArgs([]);

        expect(result).toEqual({
            url: "https://jsonplaceholder.typicode.com/users/1",
            outputPath: "./GeneratedContracts.ts",
            contractName: "User",
            params: [],
            headers: [],
        });
    });

    it("parses url, params, headers, and bearer auth", () => {
        const result = parseArgs([
            "--url",
            "https://api.example.com/users",
            "--output",
            "./MyContract.ts",
            "--name",
            "MyContract",
            "--param",
            "page=2",
            "--param",
            "limit=20",
            "--header",
            "x-api-key:abc123",
            "--auth-bearer",
            "token-1",
        ]);

        expect(result).toEqual({
            url: "https://api.example.com/users",
            outputPath: "./MyContract.ts",
            contractName: "MyContract",
            params: [
                ["page", "2"],
                ["limit", "20"],
            ],
            headers: [["x-api-key", "abc123"]],
            authBearer: "token-1",
        });
    });

    it("throws HelpRequested for --help", () => {
        expect(() => parseArgs(["--help"])).toThrow(HelpRequested);
    });

    it("throws ArgumentParseError for unknown flags", () => {
        expect(() => parseArgs(["--nope"])).toThrowError(ArgumentParseError);
    });

    it("throws ArgumentParseError when both auth modes are provided", () => {
        expect(() => parseArgs(["--auth-bearer", "t", "--auth-basic", "u:p"]))
            .toThrowError(ArgumentParseError);
    });
});
