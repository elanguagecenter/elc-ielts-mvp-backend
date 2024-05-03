interface ISpeakingTestRepository<T> {
  create(id: string, speakingTestname: string): Promise<T>;
  updateStatusByStudentIdAndId(speakingTestId: string, status: string, studentId: string): Promise<T>;
  updateStatusByTeacherIdAndId(speakingTestId: string, status: string, teacherId: string): Promise<T>;
  getById(speakingTestId: string): Promise<T>;
  updateEvaluatorId(testId: string, evaluatorId: string | null): Promise<T>;
}

export default ISpeakingTestRepository;
