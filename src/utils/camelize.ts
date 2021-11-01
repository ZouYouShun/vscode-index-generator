function clearString(s: string) {
  const pattern = new RegExp(/[.\-_]/);
  let rs = '';
  for (let i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, ' ');
  }
  return rs;
}

// 駝峰式命名
export function camelize(str: string) {
  str = ' ' + str;
  str = clearString(str);
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) {
      return '';
    } // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export function uncamelize(text: string, separator = '_') {
  if ('undefined' === typeof separator) {
    separator = '_';
  }

  // Replace all capital letters and group of numbers by the
  // separator followed by lowercase version of the match
  text = text.replace(/[A-Z]|\d+/g, function (match) {
    return separator + match.toLowerCase();
  });

  // Remove first separator (to avoid _hello_world name)
  return text.replace(new RegExp('^' + separator), '');
}

export function upperCaseArray(str: string) {
  return str.split(/(?=[A-Z])/);
}

export function firstLowerCase(input: string): string {
  return input[0].toLowerCase() + input.substr(1);
}
