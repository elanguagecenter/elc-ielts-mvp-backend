interface IFileService {
  writeBufferArrayToFile(data: Array<Buffer>, outputFile: string): Promise<string>;
}

export default IFileService;
