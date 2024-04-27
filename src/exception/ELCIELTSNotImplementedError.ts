import ELCIELTSInternalError from "./ELCIELTSInternalError";

class ELCIELTSNotImplementedError extends ELCIELTSInternalError {
  constructor(message: string) {
    super(message, 501);
  }
}

export default ELCIELTSNotImplementedError;
