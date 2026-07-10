export type GenerateOptions = {
  url: string;
  outputPath: string;
  contractName: string;
  params: Array<[string, string]>;
  headers: Array<[string, string]>;
  authBearer?: string;
  authBasic?: string;
};
