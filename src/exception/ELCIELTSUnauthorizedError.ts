import ELCIELTSInternalError from "./ELCIELTSInternalError";

class ELCIELTSUnauthorizedError extends ELCIELTSInternalError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default ELCIELTSUnauthorizedError;
