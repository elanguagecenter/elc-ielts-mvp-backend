import IOrganizationRepository from "../../repository/organization/IOrganizationRepository";
import { CreateOrganizationPayload, OrganizationResponse } from "../../utils/types/common/types";
import CommonValidator from "../../utils/validators/CommonValidator";
import IOrganizationService from "./IOrganizationService";

class OrganizationService implements IOrganizationService {
  private organizationRepository: IOrganizationRepository;

  constructor(organizationRepository: IOrganizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  async createOrg(payload: CreateOrganizationPayload): Promise<OrganizationResponse> {
    CommonValidator.validateNotEmptyOrBlankString(payload.org_name, "Org Name");
    CommonValidator.validateNotEmptyOrBlankString(payload.org_email, "Org Email");
    CommonValidator.validateNotEmptyOrBlankString(payload.org_mobile_number, "Org Mobile");
    CommonValidator.validateNotEmptyOrBlankString(payload.adminId, "Admin Id");
    CommonValidator.vlidatePositiveNumber(payload.number_of_students, "Number of Students");
    CommonValidator.vlidatePositiveNumber(payload.monthly_subscription, "Monthly Subscription");
    CommonValidator.vlidatePositiveNumber(payload.monthly_allowed_practice_listening_tests, "Allowed Listening Tests");
    CommonValidator.vlidatePositiveNumber(payload.monthly_allowed_practice_reading_tests, "Allowed Reading Tests");
    CommonValidator.vlidatePositiveNumber(payload.monthly_allowed_practice_speaking_tests, "Allowed Speaking Tests");
    CommonValidator.vlidatePositiveNumber(payload.monthly_allowed_practice_writing_tests, "Allowed Writing Tests");
    return await this.organizationRepository.create(payload);
  }

  async deleteOrg(orgId: string): Promise<OrganizationResponse> {
    CommonValidator.validateNotEmptyOrBlankString(orgId, "Org Id");
    return this.organizationRepository.delete(orgId);
  }
}

export default OrganizationService;
