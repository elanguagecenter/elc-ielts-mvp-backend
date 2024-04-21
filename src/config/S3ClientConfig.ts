import { S3Client } from "@aws-sdk/client-s3";
import configs from "./configs";

const s3Client: S3Client = new S3Client({ region: configs.aws_region });

export default s3Client;
