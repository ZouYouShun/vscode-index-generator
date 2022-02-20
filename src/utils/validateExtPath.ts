import { escapeRegExp } from './escapeRegExp';

/**
 * check file ext. be match expect exts
 */
export const validateExtPath = (
  filePath: string,
  {
    includeExts,
    excludeExts = [],
    excludePrivatePrefix = [],
  }: {
    includeExts: string[];
    excludeExts?: string[];
    excludePrivatePrefix?: string[];
  },
) => {
  const prefixFn = (ext: string) => {
    const prefixDot = ext[0] === '.' ? '' : '.';

    return `${prefixDot}${ext}$`;
  };

  const includeRegex = escapeRegExp(includeExts.map(prefixFn).join('|'));
  const excludeRegex = escapeRegExp(
    [
      ...excludePrivatePrefix.map((x) => `^${x}`),
      ...excludeExts.map(prefixFn),
    ].join('|'),
  );

  return (
    new RegExp(includeRegex, 'i').test(filePath) &&
    (excludeRegex.length === 0 || !new RegExp(excludeRegex, 'i').test(filePath))
  );
};
