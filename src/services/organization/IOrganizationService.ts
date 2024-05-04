import { CreateOrganizationPayload, OrganizationResponse } from "../../utils/types/common/types";

interface IOrganizationService {
  createOrg(payload: CreateOrganizationPayload): Promise<OrganizationResponse>;
  deleteOrg(orgId: string): Promise<OrganizationResponse>;
}

export default IOrganizationService;
