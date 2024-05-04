import { Response, Request, NextFunction } from "express";
import { CreateOrganizationPayload, OrganizationResponse } from "../utils/types/common/types";
import IOrganizationService from "../services/organization/IOrganizationService";
import OrganizationService from "../services/organization/OrganizationService";
import OrganizationRepository from "../repository/organization/OrganizationRepository";

class OrganizationController {
  private organizationService: IOrganizationService;
  constructor() {
    this.organizationService = new OrganizationService(OrganizationRepository.getInstance());
  }

  async createOrganization(req: Request, res: Response, next: NextFunction) {
    const payload: CreateOrganizationPayload = req.body;
    const result: OrganizationResponse = await this.organizationService.createOrg(payload);
    res.status(200).send(result);
  }

  async deleteOrganization(req: Request, res: Response, next: NextFunction) {
    const orgId = req.params.orgId;
    const result: OrganizationResponse = await this.organizationService.deleteOrg(orgId);
    res.status(200).send(result);
  }
}

export default OrganizationController;
