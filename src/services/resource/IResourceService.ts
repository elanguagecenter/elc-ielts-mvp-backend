import { GetS3SignedUrlResponse } from "../../utils/types/common/types";

interface IResourceService {
  getS3SignedUrl(s3Path: string): Promise<GetS3SignedUrlResponse>;
}

export default IResourceService;
