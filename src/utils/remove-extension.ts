export const removeExtension = (str: string) => {
  return str.split('.').slice(0, -1).join('.');
};
