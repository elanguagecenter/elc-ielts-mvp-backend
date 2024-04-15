import configs from "../../config/configs";
import IFileService from "./IFileService";
import fs from "fs";

class FSFileService implements IFileService {
  private static instance: IFileService = new FSFileService();

  static getInstance(): IFileService {
    return this.instance;
  }

  private constructor() {}

  async writeBufferArrayToFile(data: Array<Buffer>, outputFile: string): Promise<string> {
    const writeStream: fs.WriteStream = fs.createWriteStream(`${configs.listeningAudioOutBasePath}/${outputFile}`, { flags: "a" });
    data.forEach((line) => {
      writeStream.write(line);
      writeStream.write(Buffer.alloc(1 * 44100 * 2));
    });
    writeStream.end();
    return "local";
  }
}

export default FSFileService;
