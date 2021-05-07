import * as fs from 'fs';
import * as path from 'path';

import { OutputChannel } from './outputCannel';

const mkdirFull = (dirname: string) => {
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdirFull(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
  return false;
};

export namespace Lib {
  export const makeDirExit = (url: string): boolean => {
    try {
      if (!fs.existsSync(url)) {
        mkdirFull(url);
      }
    } catch (error) {
      OutputChannel.appendLine(error);
      return false;
    }
    return true;
  };

  export const writeFile = (url: string, value: string) => {
    return new Promise<string>((resolve, reject) => {
      try {
        const file = fs.createWriteStream(url);
        file.write(value);

        file.on('close', () => {
          resolve(undefined);
        });
        file.end();
      } catch (error) {
        reject(error);
      }
    });
  };

  export const deleteFile = (url: string): boolean => {
    try {
      if (fs.existsSync(url)) {
        fs.unlinkSync(url);
      }
    } catch (error) {
      OutputChannel.appendLine(error);
      return false;
    }
    return true;
  };

  export const deleteDir = (url: string) => {
    let files = [];
    if (fs.existsSync(url)) {
      files = fs.readdirSync(url);
      files.forEach((file) => {
        const curPath = `${url}/${file}`;
        if (fs.statSync(curPath).isDirectory()) {
          // recurse
          deleteDir(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(url);
    }
  };

  export const getCMDUrl = () => {
    return process.cwd();
  };

  export const isDirExists = (filePath: string) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  };

  export const getFileTree = (sourceUrl: string, onlyDir = false): string[] => {
    const returnObj: string[] = [];
    const files = fs.readdirSync(sourceUrl);

    files.forEach((file) => {
      const url = path.join(sourceUrl, file);

      const isDir = fs.lstatSync(url).isDirectory();

      if (onlyDir) {
        if (isDir) {
          return returnObj.push(url);
        }
      } else {
        if (isDir) {
          returnObj.push(...getFileTree(url));
        } else {
          returnObj.push(url);
        }
      }
    });

    return returnObj;
  };

  export const extname = (filePath: string) => {
    return path.extname(filePath).replace('.', '');
  };

  function clearString(s: string) {
    const pattern = new RegExp(/[.\-_]/);
    let rs = '';
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, ' ');
    }
    return rs;
  }

  export function camelize(str: string) {
    let currentStr = ` ${str}`;
    currentStr = clearString(currentStr);
    return currentStr.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  export function uncamelize(text: string, separator = '_') {
    let currentText = text;
    let currentSeparator = separator;
    if ('undefined' === typeof currentSeparator) {
      currentSeparator = '_';
    }

    // Replace all capital letters and group of numbers by the
    // separator followed by lowercase version of the match
    currentText = currentText.replace(/[A-Z]|\d+/g, (match) => {
      return currentSeparator + match.toLowerCase();
    });

    // Remove first separator (to avoid _hello_world name)
    return currentText.replace(new RegExp(`^${separator}`), '');
  }

  export function upperCaseArray(str: string) {
    return str.split(/(?=[A-Z])/);
  }

  export function firstLowerCase(input: string): string {
    return input[0].toLowerCase() + input.substr(1);
  }
}
