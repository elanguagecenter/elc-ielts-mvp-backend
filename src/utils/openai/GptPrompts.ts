const GptPrompts = {
  PartOneSpeakingQuestionGenerationPrompt: (context: string) => {
    return `You are a english language expert who make IELTS speaking exam questions in British council , Generate a Task card for IELTS speaking test part 2 which is more similler to real exam in the context of ${context}. give me the result without any additional headings like "Of course! Here's a task card for Part 2 of the IELTS speaking test"`;
  },
  PartTwoSpeakingQuestionGenerationPrompt: (previousQuestion: string) => {
    return `You are a English language expert who conduct IELTS speaking exam with student in British council , Now student have given the speach on follwing questions and points. 

      "${previousQuestion}"

      Generate some questions for speaking test part 3. give me the result without any additional headings and in bullet points only
    `;
  },
};

export default GptPrompts;
