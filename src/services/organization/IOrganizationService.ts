import { CreateOrganizationPayload, OrganizationResponse } from "../../utils/types/common/types";

interface IOrganizationService {
  getAll(page: string, limit: string): Promise<Array<OrganizationResponse>>;
  createOrg(payload: CreateOrganizationPayload<string>): Promise<OrganizationResponse>;
  deleteOrg(orgId: string): Promise<OrganizationResponse>;
}

export default IOrganizationService;
