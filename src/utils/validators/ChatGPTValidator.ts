import ELCIELTSGPTError from "../../exception/ELCIELTSGPTError";

const validateNotNullWithError = <T>(param: T | null) => {
  if (param === null || param === undefined || param === "undefined") {
    throw new ELCIELTSGPTError("Didn't receieved a valid response from Generator");
  }
};

const validateNotNullChatGPTResponse = (param: string | null): string => {
  validateNotNullWithError<string>(param);
  if (param!.trim().length == 0) {
    throw new ELCIELTSGPTError("Didn't receieved a valid response from Generator");
  }
  return param!;
};

export default {
  validateNotNullChatGPTResponse: validateNotNullChatGPTResponse,
};
