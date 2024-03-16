const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const getRandomContextValue = (contextArray: Array<string>): string => {
  return contextArray[Math.floor(getRandomNumber(0, contextArray.length))];
};

export default {
  getRandomContextValue: getRandomContextValue,
};
