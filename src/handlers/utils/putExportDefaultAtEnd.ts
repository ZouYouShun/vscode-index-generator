export function putComponentExportDefaultAtEnd(content: string) {
  // TODO: use better migrate way with js to ts
  const exportDefaultRegex = /export default (function|class)\s*(\w*)/;

  if (
    / React,| React |'react'/.test(content) &&
    exportDefaultRegex.test(content)
  ) {
    // put all export at end of file
    const componentName = content.match(exportDefaultRegex)?.[2];

    return `${content.replace('export default ', 'export ')}
    
    export default ${componentName}`;
  }

  return content;
}
