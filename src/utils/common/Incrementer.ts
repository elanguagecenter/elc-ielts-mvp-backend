class Incrementer {
  private static instance: Incrementer = new Incrementer();
  private value: number;
  private constructor() {
    this.value = 0;
  }
  static init(): Incrementer {
    this.instance.value = 0;
    return Incrementer.instance;
  }

  incrementAndGet() {
    this.value = this.value + 1;
    return this.value;
  }
}

export default Incrementer;
