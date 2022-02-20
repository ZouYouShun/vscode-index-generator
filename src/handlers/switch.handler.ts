export class SwitchHandler {
  constructor(private template: string) {}

  switchTypeInterface() {
    if (this.template.includes('type')) {
      this.switchDo(true);
      return this.template;
    }

    if (this.template.includes('interface')) {
      this.switchDo(false);

      return this.template;
    }

    return null;
  }

  // (type .*)|(};)
  private switchDo(fromType: boolean) {
    const t1 = ['type ', 'interface '];
    const t2 = [' = {\n', ' {\n'];
    const t3 = [`};\n`, `}\n`];

    const change = [t1, t2, t3];

    change.forEach((t) => {
      const from = new RegExp(`${t[fromType ? 0 : 1]}`, 'gi');
      const to = t[fromType ? 1 : 0];
      this.template = this.template
        .replace(/( {\n)?(: {\n)/, '____')
        .replace(from, to)
        .replace(/____/, ': {\n');
    });

    return this.template;
  }
}
