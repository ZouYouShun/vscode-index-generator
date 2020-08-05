import { escapeRegExp } from './escapeRegExp';

export const checkExtPath = (exts: string[], filePath: string) => {
  function regexString(cb: (ext: string) => string) {
    return exts.map(cb).join('|');
  }

  return (
    !new RegExp(
      escapeRegExp(regexString((ext) => `.${ext}$|.${ext}x$`)),
      'gi',
    ).test(filePath) ||
    new RegExp(
      escapeRegExp(
        `(${regexString((ext) => `.spec.${ext}$`)})|(^_)|(.d.ts)|${regexString(
          (ext) => `.test.${ext}$`,
        )}`,
      ),
      'gi',
    ).test(filePath)
  );
};
