interface IWritingTestRepository<T> {
  updateStatusById(writingTestId: string, status: string): Promise<T>;
  getById(writingTestId: string): Promise<T>;
}

export default IWritingTestRepository;
