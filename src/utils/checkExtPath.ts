export const checkExtPath = (exts, filePath) => {
  function regexString(cb: (ext: string) => string) {
    return exts.map(cb).join('|');
  }
  return (
    !new RegExp(regexString(ext => `.${ext}$|.${ext}x$`), 'gi').test(
      filePath
    ) ||
    // prettier-ignore
    new RegExp(
    `(${regexString(ext => `.spec.${ext}$`)})|(^_)|${regexString(ext => `.test.${ext}$`)}`,
    'gi'
  ).test(filePath)
  );
};
