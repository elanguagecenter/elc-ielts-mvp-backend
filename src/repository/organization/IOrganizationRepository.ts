import { CreateOrganizationPayload, OrganizationResponse } from "../../utils/types/common/types";

interface IOrganizationRepository {
  getById(orgId: string): Promise<OrganizationResponse>;
  getAllOrgs(page: number, limit: number): Promise<Array<OrganizationResponse>>;
  create(data: CreateOrganizationPayload<number>): Promise<OrganizationResponse>;
  delete(orgId: string): Promise<OrganizationResponse>;
}

export default IOrganizationRepository;
