import { describe, expect, it } from "@effect/vitest";
import { inferSchema } from "../src/domain/inferSchema.js";

describe("inferSchema", () => {
    it("infers primitive values", () => {
        expect(inferSchema("a")).toBe("Schema.String");
        expect(inferSchema(123)).toBe("Schema.Number");
        expect(inferSchema(true)).toBe("Schema.Boolean");
        expect(inferSchema(null)).toBe("Schema.Null");
    });

    it("infers empty array as unknown array", () => {
        expect(inferSchema([])).toBe("Schema.Array(Schema.Unknown)");
    });

    it("infers nested object structures", () => {
        const result = inferSchema({
            id: 1,
            profile: {
                name: "Ada",
                tags: ["dev"],
            },
        });

        expect(result).toBe(
            [
                "Schema.Struct({",
                "  id: Schema.Number,",
                "  profile: Schema.Struct({",
                "  name: Schema.String,",
                "  tags: Schema.Array(Schema.String),",
                "}),",
                "})",
            ].join("\n")
        );
    });
});
