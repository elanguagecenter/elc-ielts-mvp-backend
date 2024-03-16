interface ISpeakingTestRepository<T> {
  create(id: string, speakingTestname: string): Promise<T>;
  updateStatusById(speakingTestId: string, status: string): Promise<T>;
  getById(speakingTestId: string): Promise<T>;
}

export default ISpeakingTestRepository;
