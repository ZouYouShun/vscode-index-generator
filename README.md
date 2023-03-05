# Index Generator (TS/JS)

## **Create index.ts(js) for folder.**

View Feature Contributions to get all command that you can use

![](https://raw.githubusercontent.com/ZouYouShun/vscode-index-generator/master/doc/assets/sample.gif)

| Command                                   | Command                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| index-generator.createbothIndex           | Create index all file and folder with this target folder and sub folder.     |
| index-generator.createbothIndexOnlyTarget | Create only target file index file with this target folder.                  |
| index-generator.createjsIndex             | (js)Create index all file and folder with this target folder and sub folder. |
| index-generator.createjsIndexOnlyTarget   | (js)Create only target file index file with this target folder.              |
| index-generator.clearEmptyFolder          | Clear all empty folder with this target folder and sub folder.               |
| index-generator.switchTypeInterface       | Switch Type and Interface                                                    |
| index-generator.switchCamelize            | switch word between camelize and underline                                   |
| index-generator.toTs                      | Change files to ts.                                                          |
| index-generator.changeExt                 | Change files extension from [source] to [target].                            |
| index-generator.format                    | format all file with prettier and import sort(optional).                     |
| index-generator.formatSortTsOnce          | format and sort with extensions.                                             |
| index-generator.openAndRun                | open all files under folder and run command                                  |

### Export default

when we re-export from index, we use `camel case` to as that by default, like

```ts
export { default as FileName } from './file-name';
```

if you want to customize with different mode, you can set `index-generator.reExportDefaultCase` to change that format case (`lowerCamelCase`/`CamelCase`/`followFileName`).

```json
{
  "index-generator.reExportDefaultCase": "followFileName"
}
```

- CamelCase (default)

```ts
export { default as FileName } from './file-name';
```

- lowerCamelCase

```ts
export { default as fileName } from './file-name';
```

- followFileName (follow the first one character case format)

```ts
export { default as fileName } from './example-file-name';

export { default as fileName } from './exampleFileName';

export { default as FileName } from './Example-File-Name';

export { default as FileName } from './ExampleFileName';
```
