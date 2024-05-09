import { Response, Request, NextFunction } from "express";
import { CreateOrganizationPayload, OrganizationResponse } from "../utils/types/common/types";
import IOrganizationService from "../services/organization/IOrganizationService";
import OrganizationService from "../services/organization/OrganizationService";
import OrganizationRepository from "../repository/organization/OrganizationRepository";
import { Constants } from "../utils/types/common/constants";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import CommonUserRepository from "../repository/users/CommonUserRepository";

class OrganizationController {
  private organizationService: IOrganizationService;
  constructor() {
    this.organizationService = new OrganizationService(OrganizationRepository.getInstance(), CommonUserRepository.getInstance());
  }

  @AsyncControllerHandle
  async getOrganizations(req: Request, res: Response, next: NextFunction) {
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const result: Array<OrganizationResponse> = await this.organizationService.getAll(page, limit);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async createOrganization(req: Request, res: Response, next: NextFunction) {
    const payload: CreateOrganizationPayload<string> = req.body;
    const result: OrganizationResponse = await this.organizationService.createOrg(payload);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async deleteOrganization(req: Request, res: Response, next: NextFunction) {
    const orgId = req.params.orgId;
    const result: OrganizationResponse = await this.organizationService.deleteOrg(orgId);
    res.status(200).send(result);
  }
}

export default OrganizationController;
