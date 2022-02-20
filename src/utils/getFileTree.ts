import * as fs from 'fs-extra';
import * as path from 'path';

// export const writeFile = (url: string, value: string) => {
//   return new Promise<string | undefined>((resolve, reject) => {
//     try {
//       const file = fs.createWriteStream(url);
//       file.write(value);

//       file.on('close', () => {
//         resolve(undefined);
//       });
//       file.end();
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

type GetFileTreeOptions = {
  onlyFolder?: boolean;
  filterFn?: (filePath: string) => boolean;
};

export function getFileTreeSync(
  sourceUrl: string,
  { onlyFolder, filterFn }: GetFileTreeOptions = {},
) {
  const returnObj: string[] = [];
  const files = fs.readdirSync(sourceUrl);

  files.forEach((file) => {
    const url = path.join(sourceUrl, file);

    if (url.match(/node_modules|\.git$|\.gitconfig|dist/gm)) {
      return;
    }

    const isDir = fs.lstatSync(url).isDirectory();

    const pass = !filterFn || filterFn?.(url);

    if (!isDir) {
      if (!onlyFolder && pass) {
        returnObj.push(url);
      }
      return;
    }

    returnObj.push(...getFileTreeSync(url, { onlyFolder, filterFn }));

    if (onlyFolder) {
      returnObj.push(url);
    }
  });

  return returnObj;
}

export async function getFileTree(
  sourceUrl: string,
  { onlyFolder, filterFn }: GetFileTreeOptions = {},
) {
  const returnObj: string[] = [];
  const files = await fs.readdir(sourceUrl);

  for (const file of files) {
    const url = path.join(sourceUrl, file);

    if (url.match(/node_modules|\.git$|\.gitconfig|dist/gm)) {
      continue;
    }

    const isDir = (await fs.lstat(url)).isDirectory();

    const pass = !filterFn || filterFn?.(url);

    if (!isDir) {
      if (!onlyFolder && pass) {
        returnObj.push(url);
      }
      continue;
    }

    const child = await getFileTree(url, { onlyFolder, filterFn });

    returnObj.push(...child);

    if (onlyFolder) {
      returnObj.push(url);
    }
  }

  return returnObj;
}
