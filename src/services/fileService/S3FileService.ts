import IFileService from "./IFileService";
import { S3Client } from "@aws-sdk/client-s3";
import { PassThrough, Transform } from "stream";
import configs from "../../config/configs";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "../../config/S3ClientConfig";

class S3FileService implements IFileService {
  private static instance: IFileService = new S3FileService();
  private s3Client: S3Client;

  static getInstance(): IFileService {
    return this.instance;
  }

  private constructor() {
    this.s3Client = s3Client;
  }

  async writeBufferArrayToFile(data: Buffer[], outputFile: string): Promise<string> {
    const stream: Transform = new PassThrough();
    data.forEach((line) => {
      stream.write(line);
      stream.write(Buffer.alloc(1 * 44100 * 2));
    });
    stream.end();
    return await this.uploadStreamToS3(stream, outputFile);
  }

  private async uploadStreamToS3(stream: Transform, outputFile: string): Promise<string> {
    const uploadCommand = new Upload({
      client: this.s3Client,
      params: {
        Bucket: configs.bucket_name,
        Key: `${configs.listeningAudioOutS3BasePath}/${outputFile}`,
        Body: stream,
        ContentType: "audio/mpeg",
      },
    });
    return await uploadCommand
      .done()
      .then((res) => res.Key || `${configs.listeningAudioOutS3BasePath}/${outputFile}`)
      .catch(() => {
        throw new ELCIELTSInternalError("Error occured when uploading lsitening audio to s3");
      });
  }
}

export default S3FileService;
