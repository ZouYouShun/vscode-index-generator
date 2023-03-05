/**
 * replace string '.', '-', '_' to ' '
 */
function clearString(s: string) {
  const pattern = new RegExp(/[.\-_]/);
  let rs = '';
  for (let i = 0; i < s.length; i++) {
    rs = rs + s.substring(i, i + 1).replace(pattern, ' ');
  }
  return rs;
}

export function camelize(str: string) {
  str = ' ' + str;
  str = clearString(str);
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return '';
    } // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export function uncamelize(text: string, separator = '_') {
  // Replace all capital letters and group of numbers by the
  // separator followed by lowercase version of the match
  text = text.replace(/[A-Z]|\d+/g, (match) => {
    return separator + match.toLowerCase();
  });

  // Remove first separator (to avoid _hello_world name)
  return text.replace(new RegExp('^' + separator), '');
}

/**
 * @example
 * 'That is A Example For split with uppercase letter'
 * =>
 * ['That is ', 'A ', 'Example ', 'For split with uppercase letter']
 */
export function upperCaseArray(str: string) {
  return str.split(/(?=[A-Z])/);
}

export function transformFirstCharacter(
  input: string,
  processor: (source: string) => string,
): string {
  return processor(input[0]) + input.substring(1);
}

export const lowercaseCameCase = (fileName: string) => {
  return transformFirstCharacter(camelize(fileName), (x) => {
    return x.toLocaleLowerCase();
  });
};
