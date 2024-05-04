import { CreateOrganizationPayload, OrganizationResponse } from "../../utils/types/common/types";

interface IOrganizationRepository {
  getById(orgId: string): Promise<OrganizationResponse>;
  create(data: CreateOrganizationPayload): Promise<OrganizationResponse>;
  delete(orgId: string): Promise<OrganizationResponse>;
}

export default IOrganizationRepository;
