import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/S3ClientConfig";
import IResourceService from "./IResourceService";
import { GetS3SignedUrlResponse } from "../../utils/types/common/types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import configs from "../../config/configs";
import CommonValidator from "../../utils/validators/CommonValidator";
import ELCIELTSNotFoundError from "../../exception/ELCIELTSNotFoundError";

class SimpleResourceService implements IResourceService {
  private static instance: IResourceService = new SimpleResourceService();
  private s3Client: S3Client;

  static getInstance(): IResourceService {
    return this.instance;
  }

  private constructor() {
    this.s3Client = s3Client;
  }

  async getS3SignedUrl(s3Path: string): Promise<GetS3SignedUrlResponse> {
    CommonValidator.validateNotEmptyOrBlankString(s3Path, "S3 Object Key");
    const s3ObjectParams = {
      Bucket: configs.bucket_name,
      Key: s3Path,
    };
    const command = new GetObjectCommand(s3ObjectParams);
    return this.validateObjectExistance(s3Path)
      .then(() => getSignedUrl(this.s3Client, command, { expiresIn: 3600 }))
      .then((url) => {
        return {
          signedUrl: url,
        };
      });
    // add error handling
  }

  private async validateObjectExistance(s3Path: string) {
    const headObjectParams = {
      Bucket: configs.bucket_name,
      Key: s3Path,
    };
    const command = new HeadObjectCommand(headObjectParams);
    await this.s3Client.send(command).catch(() => {
      throw new ELCIELTSNotFoundError(`Requested S3 object is not existing in bucket`);
    });
  }
}

export default SimpleResourceService;
