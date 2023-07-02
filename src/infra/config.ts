export class Injector {
  constructor() {
    return this;
  }

  static dependencies: { [key: string]: any } = {};

  static add(dependencie: Object, key: string) {
    if (this.dependencies[key]) return;
    this.dependencies[key] = dependencie;
  }

  static get<R = any>(key: string): R {
    return this.dependencies[key];
  }
}
