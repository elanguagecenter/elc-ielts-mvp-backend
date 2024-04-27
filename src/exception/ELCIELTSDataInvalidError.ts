import ELCIELTSInternalError from "./ELCIELTSInternalError";

class ELCIELTSDataInvalidError extends ELCIELTSInternalError {
  constructor(message: string) {
    super(message, 400);
  }
}

export default ELCIELTSDataInvalidError;
