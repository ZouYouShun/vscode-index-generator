# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 2.1.0 (2023-03-05)


### Features

* **Camelize:** cleanup camelize with vscode question ([86adfb3](https://github.com/ZouYouShun/vscode-index-generator/commit/86adfb38230c538cfcff6b1ab06fafbd188a6740))
* **Command:** [OpenAndRun] support custom delay time ([2d561d1](https://github.com/ZouYouShun/vscode-index-generator/commit/2d561d1da121e2e6313cdb1c9aaf22bc5db22d6f))
* **IndexGenerator:** support text format  when generate index file re-export content with configuration setting ([accd492](https://github.com/ZouYouShun/vscode-index-generator/commit/accd492fd3941e3c6555b5092b042391d1f82e75))
* **Project:** cleanup whole project ([4c6ce02](https://github.com/ZouYouShun/vscode-index-generator/commit/4c6ce02cacd9a2c084fc41da729d36805b648e9d))

## 2.0.0 (2022-02-20)

✨ Release with standard-version
✨ Index generator refactor for better re-export format
✨ support change any extension of files. like `.md` to `.mdx`
✨ Prettier format can also format sort at same time(optional).
✨ Whole project code cleanup

### Features

- **Camelize:** cleanup camelize with vscode question ([86adfb3](https://github.com/ZouYouShun/vscode-index-generator/commit/86adfb38230c538cfcff6b1ab06fafbd188a6740))
- **Command:** [OpenAndRun] support custom delay time ([2d561d1](https://github.com/ZouYouShun/vscode-index-generator/commit/2d561d1da121e2e6313cdb1c9aaf22bc5db22d6f))
- **Project:** cleanup whole project ([4c6ce02](https://github.com/ZouYouShun/vscode-index-generator/commit/4c6ce02cacd9a2c084fc41da729d36805b648e9d))

## 1.1.2

### Feature

change ts formatter to [`dozerg.tsimportsorter`](https://marketplace.visualstudio.com/items?itemName=dozerg.tsimportsorter)

## 1.1.0

### Feature

- Support to ts config setting with include and exclude, excludeFiles

```json
{
  "toTs": {
    "include": ["**/src/*"],
    "exclude": ["**/build/*"],
    "excludeFiles": [".gitignore"] // ignore files that you want to ignore, same as git ignore format
  }
}
```

## 1.0.0

### Feature

- Support clear empty folder command

### Fix

- Complete export default logic

## 0.1.6

### Fix

- Change default export to `export { default as Name } from './Name';`

## 0.1.5

### Feature

- Support run commands with folder all files

## 0.1.4

### Feature

- Add support with jsx to tsx

## 0.1.3

### Break Change

- remove format and Sort auto save file

## 0.1.2

### feature

- add keybinding with format and Sort

## 0.1.1

### feature

- add format and Sort

## 0.0.3

### bug fix

- make format and to ts cmd more stable

## 0.0.22

### feature

- add add formatSort cmd

### bug fix

- fix to ts format issue

## 0.0.16

### feature

- add firstLowerCase config

## 0.0.15

### feature

- add camelize switcher

## 0.0.14

### feature

- fix index with js

## 0.0.13

### feature

- add index generator with js files

## 0.0.12

### feature

- add prettier format whole folder

## 0.0.11

- Initial release
- first release with createIndex, createIndexOnlyTarget, switchTypeInterface, toTs
