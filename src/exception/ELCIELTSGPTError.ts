import ELCIELTSInternalError from "./ELCIELTSInternalError";

class ELCIELTSGPTError extends ELCIELTSInternalError {
  constructor(message: string) {
    super(message, 502);
  }
}

export default ELCIELTSGPTError;
