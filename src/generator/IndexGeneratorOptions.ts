export type IndexGeneratorOptions = {
  force?: boolean;
  js?: boolean;
  type?: 'js' | 'ts' | 'both';
  ignore?: string;
  perttierConfig?: string;
};
