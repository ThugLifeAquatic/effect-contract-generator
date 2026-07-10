// Pure recursive transform: JSON value -> Effect Schema source code string.
const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const reservedWords = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "let",
  "enum",
  "await",
  "implements",
  "package",
  "protected",
  "static",
  "interface",
  "private",
  "public",
]);

function formatObjectKey(key: string): string {
  // Bare keys must be safe TS identifiers and not reserved words.
  const isValidIdentifier = identifierPattern.test(key);
  if (isValidIdentifier && !reservedWords.has(key)) {
    return key;
  }

  return JSON.stringify(key);
}

export function inferSchema(value: unknown): string {
  if (value === null) return "Schema.Null";

  if (Array.isArray(value)) {
    if (value.length === 0) return "Schema.Array(Schema.Unknown)";

    // Infer from the whole response array, not just the first element.
    const itemSchemas = Array.from(new Set(value.map((item) => inferSchema(item))));
    const itemSchema =
      itemSchemas.length === 1 ? itemSchemas[0] : `Schema.Union(${itemSchemas.join(", ")})`;

    return `Schema.Array(${itemSchema})`;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return "Schema.Struct({})";

    const fields = keys
      .map((key) => `  ${formatObjectKey(key)}: ${inferSchema(obj[key])},`)
      .join("\n");

    return `Schema.Struct({\n${fields}\n})`;
  }

  if (typeof value === "string") return "Schema.String";
  if (typeof value === "number") return "Schema.Number";
  if (typeof value === "boolean") return "Schema.Boolean";

  return "Schema.Unknown";
}
