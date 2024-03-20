const GptPrompts = {
  StageTwoSpeakingQuestionGenerationPrompt: (context: string) => {
    return `You are a english language expert who make IELTS speaking exam questions in British council , Generate a Task card for IELTS speaking test part 2 which is more similler to real exam in the context of ${context}. give me the result without any additional headings like "Of course! Here's a task card for Part 2 of the IELTS speaking test"`;
  },
  StageThreeSpeakingQuestionGenerationPrompt: (previousQuestion: string) => {
    return `You are a English language expert who conduct IELTS speaking exam with student in British council , Now student have given the speach on follwing questions and points. 

      "${previousQuestion}"

      Generate some maximum five questions for speaking test part 3. give me the result without any additional headings and in bullet points only
    `;
  },
  StageOneWritingTestQuestionGenerationPrompt: (context: string) => {
    return `You are an English language expert who creates IELTS General Training writing exam questions at the British Council. Generate a Task for IELTS General Training Writing Test Part 1 in the context of '${context}' which is more similar to a real exam. Provide the result without any additional headings, just the question and points are sufficient.`;
  },

  StageTwoWritingTestQuestionGenerationPrompt: (context: string) => {
    return `You are an English language expert who creates IELTS General Training writing exam task 2 questions. Generate a Essay Task for IELTS General Training Writing Test task 2  in the context of '${context}' which is more similar to a real exam. Provide the question without any additional headings`;
  },

  WritingTestQuestionEvaluationSystemPrompt: (writingTestPart: number) => {
    return `You are an expert English teacher who excels at training candidates in IELTS. 

    You will help grade the IELTS General Training Writing Test Part ${writingTestPart} by the user. You will always provide the following:
    - The overall score
    - The breakdown of each band /criteria
    - Areas to improve with examples`;
  },

  WritingTestQuestionEvaluationUserPrompt: (question: string, answer: string) => {
    return `Question: '${question}'
            Answer: '${answer}.'`;
  },
};

export default GptPrompts;
