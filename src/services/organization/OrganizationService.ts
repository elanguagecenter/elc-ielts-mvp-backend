import IOrganizationRepository from "../../repository/organization/IOrganizationRepository";
import IUsersRepository from "../../repository/users/IUsersRepository";
import { CreateOrganizationPayload, OrgAdminResponse, OrganizationResponse } from "../../utils/types/common/types";
import CommonValidator from "../../utils/validators/CommonValidator";
import IOrganizationService from "./IOrganizationService";

class OrganizationService implements IOrganizationService {
  private organizationRepository: IOrganizationRepository;
  private userRepository: IUsersRepository;

  constructor(organizationRepository: IOrganizationRepository, userRepository: IUsersRepository) {
    this.organizationRepository = organizationRepository;
    this.userRepository = userRepository;
  }

  async getAll(page: string, limit: string): Promise<Array<OrganizationResponse>> {
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    CommonValidator.validateLowerLimit(pageNum, 1, "Page");
    CommonValidator.validateLowerLimit(limitNum, 0, "Limit");
    return await this.organizationRepository.getAllOrgs(pageNum, limitNum);
  }

  async createOrg(payload: CreateOrganizationPayload<string>): Promise<OrganizationResponse> {
    CommonValidator.validateNotEmptyOrBlankString(payload.org_name, "Org Name");
    CommonValidator.validateNotEmptyOrBlankString(payload.org_email, "Org Email");
    CommonValidator.validateNotEmptyOrBlankString(payload.org_mobile_number, "Org Mobile");
    CommonValidator.validateNotEmptyOrBlankString(payload.adminId, "Admin Id");
    const validatedPayload: CreateOrganizationPayload<number> = {
      org_name: payload.org_name,
      org_email: payload.org_email,
      org_mobile_number: payload.org_mobile_number,
      adminId: payload.adminId,
      number_of_students: CommonValidator.validatePositiveNumberString(payload.number_of_students.toString(), "Number of Students"),
      monthly_subscription: CommonValidator.validatePositiveNumberString(payload.monthly_subscription.toString(), "Monthly Subscription"),
      monthly_allowed_practice_listening_tests: CommonValidator.validatePositiveNumberString(
        payload.monthly_allowed_practice_listening_tests.toString(),
        "Allowed Listening Tests"
      ),
      monthly_allowed_practice_speaking_tests: CommonValidator.validatePositiveNumberString(payload.monthly_allowed_practice_speaking_tests.toString(), "Allowed Speaking Tests"),
      monthly_allowed_practice_writing_tests: CommonValidator.validatePositiveNumberString(payload.monthly_allowed_practice_writing_tests.toString(), "Allowed Writing Tests"),
      monthly_allowed_practice_reading_tests: CommonValidator.validatePositiveNumberString(payload.monthly_allowed_practice_reading_tests.toString(), "Allowed Reading Tests"),
    };
    const orgAdmin: OrgAdminResponse = await this.userRepository.getOrgAdminById(payload.adminId);
    CommonValidator.validateTrueValue(orgAdmin.org_id === null, "Org admin already has been allocated to a organization");
    return await this.organizationRepository.create(validatedPayload);
  }

  async deleteOrg(orgId: string): Promise<OrganizationResponse> {
    CommonValidator.validateNotEmptyOrBlankString(orgId, "Org Id");
    return this.organizationRepository.delete(orgId);
  }
}

export default OrganizationService;
