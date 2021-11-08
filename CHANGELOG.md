# Change Log

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
