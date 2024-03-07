import ELCIELTSDataInvalidError from "../../exception/ELCIELTSDataInvalidError";

const validateNotNull = <T>(param: T | undefined, paramName: string) => {
  if (param == null || param == undefined) {
    throw new ELCIELTSDataInvalidError(`${paramName} value should not be null or undefined`);
  }
};

const validateNotEmptyOrBlankString = (param: string | undefined, paramName: string) => {
  validateNotNull<string>(param, paramName);
  if (param!.trim().length == 0) {
    throw new ELCIELTSDataInvalidError(`${paramName} value should not be empty or blank`);
  }
};

const vlidatePositiveNumber = (param: number, paramName: string) => {
  validateNotNull<number>(param, paramName);
  if (param < 0) {
    throw new ELCIELTSDataInvalidError(`${paramName} value should be non negative`);
  }
};
const validatePositiveNumberString = (param: string, paramName: string): number => {
  const number = Number.parseInt(param);
  if (!Number.isNaN(number)) {
    vlidatePositiveNumber(number, paramName);
    return number;
  } else {
    throw new ELCIELTSDataInvalidError(`${paramName} value should be a number`);
  }
};

const validateValidPossibleNumberValue = (param: number, possibleValues: Array<number>, paramName: string) => {
  if (!possibleValues.includes(param)) {
    throw new ELCIELTSDataInvalidError(`${paramName} value should a value from ${possibleValues.toString()}`);
  }
};

const validateDefinedStatus = (status: string, paramName: string, allowedStatuses: Array<string>) => {
  validateNotEmptyOrBlankString(status, paramName);
  if (!allowedStatuses.includes(status)) {
    throw new ELCIELTSDataInvalidError(`allowed values for ${paramName} are : ${allowedStatuses.toString()}`);
  }
};

export default {
  validateNotNull: validateNotNull,
  validateNotEmptyOrBlankString: validateNotEmptyOrBlankString,
  vlidatePositiveNumber: vlidatePositiveNumber,
  validatePositiveNumberString: validatePositiveNumberString,
  validateValidPossibleNumberValue: validateValidPossibleNumberValue,
  validateDefinedStatus: validateDefinedStatus,
};
