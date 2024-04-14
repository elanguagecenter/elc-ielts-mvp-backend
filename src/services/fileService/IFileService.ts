interface IFIleService {
  writeBufferArrayToFile(data: Array<Buffer>, outputFile: string): void;
}

export default IFIleService;
