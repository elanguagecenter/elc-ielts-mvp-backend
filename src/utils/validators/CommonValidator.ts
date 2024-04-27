import ELCIELTSDataInvalidError from "../../exception/ELCIELTSDataInvalidError";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";

const validateNotNull = <T>(param: T | undefined, paramName: string) => {
  if (param === null || param === undefined || param === "undefined") {
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

const validateParamInADefinedValues = (param: string, definedValues: Array<string>, paramName: string) => {
  validateNotEmptyOrBlankString(param, paramName);
  if (!definedValues.includes(param)) {
    throw new ELCIELTSDataInvalidError(`${paramName} should be a value from [${definedValues.toString()}]`);
  }
};

const validateTrueValue = (value: boolean, error: string) => {
  if (!value) {
    throw new ELCIELTSDataInvalidError(error);
  }
};

const arraySizeValidator = <T>(array: Array<T>, size: number, error: ELCIELTSInternalError) => {
  if (array.length !== size) {
    throw error;
  }
};

const validateJsonString = (jsonString: string, paramName: string): Map<string, string> => {
  validateNotNull<string>(jsonString, paramName);
  try {
    return new Map<string, string>(JSON.parse(jsonString));
  } catch (err) {
    throw new ELCIELTSDataInvalidError(`${paramName} should be a valid json object`);
  }
};

export default {
  validateNotNull: validateNotNull,
  validateNotEmptyOrBlankString: validateNotEmptyOrBlankString,
  vlidatePositiveNumber: vlidatePositiveNumber,
  validatePositiveNumberString: validatePositiveNumberString,
  validateValidPossibleNumberValue: validateValidPossibleNumberValue,
  validateDefinedStatus: validateDefinedStatus,
  validateParamInADefinedValues: validateParamInADefinedValues,
  validateTrueValue: validateTrueValue,
  arraySizeValidator: arraySizeValidator,
  validateJsonString: validateJsonString,
};
