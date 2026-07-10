import { Console } from "effect";

const usageText = [
    "Usage:",
    "  npm run generate -- [options]",
    "",
    "Options:",
    "  --url <endpoint>               API endpoint to fetch",
    "  --output <path>                Output TypeScript file path",
    "  --name <contractName>          Generated contract name",
    "  --param <key=value>            Query param (repeatable)",
    "  --header <name:value>          HTTP header (repeatable)",
    "  --auth-bearer <token>          Bearer token auth",
    "  --auth-basic <user:pass>       Basic auth credentials",
    "  --help                         Show this help",
    "",
    "Examples:",
    "  npm run generate -- --url https://api.example.com/users --param page=1 --auth-bearer \"$API_TOKEN\"",
    "  npm run generate -- --url https://api.example.com/orders --header x-api-key:abc123",
].join("\n");

export const printUsage = () => Console.log(usageText);
