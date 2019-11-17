export class SwitchHandler {
  constructor(private template: string) {}

  async switchTypeInterface() {
    if (this.template.includes('type')) {
      this.switchDo(true);
      return this.template;
    }

    if (this.template.includes('interface')) {
      this.switchDo(false);

      return this.template;
    }
  }
  private switchDo(fromType: boolean) {
    const t1 = ['type', 'interface'];
    const t2 = ['= {', '{'];
    const t3 = ['};', '}'];

    const change = [t1, t2, t3];
    change.forEach((t) => {
      (this.template as any).replace(...(fromType ? t : t.reverse()));
    });

    return this.template;
  }
}
