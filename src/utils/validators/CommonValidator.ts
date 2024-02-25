import ELCIELTSDataInvalidError from "../../exception/ELCIELTSDataInvalidError";

const validateNotNull = <T>(param: T, paramName: string) => {
  if (param == null || param == undefined) {
    throw new ELCIELTSDataInvalidError(`${paramName} value should not be null or undefined`);
  }
};

const validateNotEmptyOrBlankString = (param: string, paramName: string) => {
  validateNotNull<string>(param, paramName);
  if (param.trim().length == 0) {
    throw new ELCIELTSDataInvalidError(`${paramName} value should not be empty or blank`);
  }
};

const vlidatePositiveNumber = (param: number, paramName: string) => {
  validateNotNull<number>(param, paramName);
  if (param < 0) {
    throw new ELCIELTSDataInvalidError(`${paramName} value should be non negative`);
  }
};

export default {
  validateNotNull: validateNotNull,
  validateNotEmptyOrBlankString: validateNotEmptyOrBlankString,
  vlidatePositiveNumber: vlidatePositiveNumber,
};
