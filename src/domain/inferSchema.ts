// Pure recursive transform: JSON value -> Effect Schema source code string.
export function inferSchema(value: unknown): string {
    if (value === null) return "Schema.Null";

    if (Array.isArray(value)) {
        if (value.length === 0) return "Schema.Array(Schema.Unknown)";
        return `Schema.Array(${inferSchema(value[0])})`;
    }

    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const keys = Object.keys(obj);
        if (keys.length === 0) return "Schema.Struct({})";

        const fields = keys
            .map((key) => `  ${key}: ${inferSchema(obj[key])},`)
            .join("\n");

        return `Schema.Struct({\n${fields}\n})`;
    }

    if (typeof value === "string") return "Schema.String";
    if (typeof value === "number") return "Schema.Number";
    if (typeof value === "boolean") return "Schema.Boolean";

    return "Schema.Unknown";
}
