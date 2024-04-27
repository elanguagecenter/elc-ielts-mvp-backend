class Incrementer {
  private value: number;

  constructor() {
    this.value = 0;
  }

  reset(toValue: number = 0): void {
    this.value = toValue;
  }

  incrementAndGet(): number {
    this.value = this.value + 1;
    return this.value;
  }
}

export default Incrementer;
