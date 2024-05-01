export interface CreateTest {
  name: string;
}

export interface CreateSpekingTest {
  name: string;
}

export interface CreateSpekingTestStage {
  name: string;
}

export interface UpdateSpeakingTestQuestion {
  operation: string;
}

export interface UpdateTestStagePayload {
  stgNumber: string;
  evaluation?: string;
}

export interface UpdateWritingTestStage {
  answer: string;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------ 
 * Practice Reading
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
export interface UpdateReadingTestStage {
  answerMap: string;
}
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------------------------------------------------------------ 
 * Practice Listening
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
export interface UpdateListeningTestStage {
  answerMap: string;
}
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
