import { ReadingTestQuestionTypes } from "../types/common/common";

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const getRandomContextValue = (contextArray: Array<string>): string => {
  return contextArray[Math.floor(getRandomNumber(0, contextArray.length))];
};

const getRandomReadingQuestionTypes = (): Array<string> => {
  const questionTypes: Array<string> = [...Object.values(ReadingTestQuestionTypes)];
  return "0,0".split(",").flatMap(() => {
    const randNum = getRandomNumber(0, questionTypes.length);
    return questionTypes.splice(randNum, 1);
  });
};

export default {
  getRandomContextValue: getRandomContextValue,
  getRandomReadingQuestionTypes: getRandomReadingQuestionTypes,
};
