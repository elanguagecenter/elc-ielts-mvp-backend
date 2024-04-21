interface IListeningTestRepository<T> {
  updateStatusById(listeningTestId: string, status: string): Promise<T>;
  getById(listeningTestId: string): Promise<T>;
}

export default IListeningTestRepository;
