export interface Params {
  config?: string;
}

export interface Context {
  input: string[];
  outputFileName: string;
  cwd: string;
  srcDir?: string;
  transform?: (path: string) => string;
}

export interface ExportItem {
  file: string;
  id: string;
}
