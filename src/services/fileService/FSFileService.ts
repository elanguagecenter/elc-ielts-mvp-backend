import configs from "../../config/configs";
import IFIleService from "./IFileService";
import fs from "fs";

class FSFileService implements IFIleService {
  private static instance: IFIleService = new FSFileService();

  static getInstance(): IFIleService {
    return this.instance;
  }

  writeBufferArrayToFile(data: Array<Buffer>, outputFile: string): void {
    const writeStream: fs.WriteStream = fs.createWriteStream(`${configs.listeningAudioOutBasePath}/${outputFile}`, { flags: "a" });
    data.forEach((line) => {
      writeStream.write(line);
      writeStream.write(Buffer.alloc(1 * 44100 * 2));
    });
    writeStream.end();
  }
}

export default FSFileService;
