import ELCIELTSInternalError from "./ELCIELTSInternalError";

class ELCIELTSNotFoundError extends ELCIELTSInternalError {
  constructor(message: string) {
    super(message, 404);
  }
}

export default ELCIELTSNotFoundError;
