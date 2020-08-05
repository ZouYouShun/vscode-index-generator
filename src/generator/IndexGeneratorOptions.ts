export type IndexGeneratorOptions = {
  force?: boolean;
  js?: boolean;
  type?: 'js' | 'ts' | 'both';
  ignore?: string;
  onlyTarget?: boolean;
  prettierConfig?: string;
};
