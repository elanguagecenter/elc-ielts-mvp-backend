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

export interface StartStopSpeakingTestStage {
  stgNumber: string;
}
