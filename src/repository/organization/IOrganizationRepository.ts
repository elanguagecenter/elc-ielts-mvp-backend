import { CreateOrganizationPayload, OrganizationResponse } from "../../utils/types/common/types";

interface IOrganizationRepository {
  create(data: CreateOrganizationPayload): Promise<OrganizationResponse>;
}
