class ELCIELTSInternalError extends Error {
  private statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }

  getStatus() {
    return this.statusCode;
  }
}

export default ELCIELTSInternalError;
