import { Response, Request, NextFunction } from "express";
import IResourceService from "../services/resource/IResourceService";
import SimpleResourceService from "../services/resource/SimpleResourceService";
import { Constants } from "../utils/types/common/constants";
import { GetS3SignedUrlResponse } from "../utils/types/common/types";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";

class ResourceController {
  private resourceService: IResourceService;

  constructor() {
    this.resourceService = SimpleResourceService.getInstance();
  }

  @AsyncControllerHandle
  async getS3SignedUrl(req: Request, res: Response, next: NextFunction) {
    const s3Path = req.query.s3Path?.toString() || Constants.EMPTY_STR;
    const response: GetS3SignedUrlResponse = await this.resourceService.getS3SignedUrl(s3Path);
    res.status(200).send(response);
  }
}

export default ResourceController;
