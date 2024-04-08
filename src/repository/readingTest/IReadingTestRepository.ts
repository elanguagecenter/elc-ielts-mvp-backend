interface IReadingTestRepository<T> {
  updateStatusById(readingTestId: string, status: string): Promise<T>;
  getById(readingTestId: string): Promise<T>;
}

export default IReadingTestRepository;
