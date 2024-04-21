interface ITextGeneratorService {
  /*---- Speaking Test ------------------------------------------------------------------------------------------------------------*/
  generateSpeakingTestStage2(): Promise<Array<string | null>>;
  generateSpeakingTestStage3(previousGeneratedText: string): Promise<Array<string | null>>;
  /*--------------------------------------------------------------------------------------------------------------------------------*/

  /*---- Writing Test ------------------------------------------------------------------------------------------------------------*/
  generateWritingTestStage1(): Promise<Array<string | null>>;
  generateWritingTestStage2(): Promise<Array<string | null>>;
  evaluateWritingTestStage(question: string, answer: string, testStage: number): Promise<Array<string | null>>;
  /*--------------------------------------------------------------------------------------------------------------------------------*/

  /*---- Reading Test ---------------------------------------------------------------------------------------------------------------*/
  generateReadingTestStageOneText(): Promise<Array<string | null>>;
  generateReadingTestStageTwoText(): Promise<Array<string | null>>;
  generateReadingTestStageThreeText(): Promise<Array<string | null>>;
  generateReadingTestStageMcqQuestions(text: string, numberOfQuestion: number, taskNum: number): Promise<Array<string | null>>;
  generateReadingTestStageSentanceCompletionQuestions(text: string, numberOfQuestion: number, taskNum: number): Promise<Array<string | null>>;
  evaluateReadingTestQuestions(text: string, question: string, answer: string): Promise<Array<string | null>>;
  /*--------------------------------------------------------------------------------------------------------------------------------*/

  /*---- Listening Test ------------------------------------------------------------------------------------------------------------*/
  generateListeningTestStageOneText(): Promise<Array<string | null>>;
  generateListeningTestStageTwoText(): Promise<Array<string | null>>;
  generateListeningTestStageThreeText(): Promise<Array<string | null>>;
  generateListeningTestStageFourText(): Promise<Array<string | null>>;
  generateListeningTestStageMcqQuestions(text: string, numberOfQuestion: number, taskNum: number, textType: string): Promise<Array<string | null>>;
  generateListeningTestStageTrueFalseQuestions(text: string, numberOfQuestion: number, taskNum: number, textType: string): Promise<Array<string | null>>;
  evaluateListeningTestQuestions(text: string, question: string, answer: string, questionType: string): Promise<Array<string | null>>;
  /*--------------------------------------------------------------------------------------------------------------------------------*/
}

export default ITextGeneratorService;
