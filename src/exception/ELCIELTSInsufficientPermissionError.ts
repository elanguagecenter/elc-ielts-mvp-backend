import ELCIELTSInternalError from "./ELCIELTSInternalError";

class ELCIELTSInsufficientPermissionError extends ELCIELTSInternalError {
  constructor(message: string) {
    super(message, 402);
  }
}

export default ELCIELTSInsufficientPermissionError;
