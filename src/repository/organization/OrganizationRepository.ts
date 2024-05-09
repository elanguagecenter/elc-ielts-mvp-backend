import prisma from "../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../exception/ELCIELTSNotFoundError";
import Handle from "../../utils/decorators/DBErrorHandlingDecorator";
import { CreateOrganizationPayload, OrganizationResponse } from "../../utils/types/common/types";
import IOrganizationRepository from "./IOrganizationRepository";

class OrganizationRepository implements IOrganizationRepository {
  private static instance: IOrganizationRepository = new OrganizationRepository();

  static getInstance(): IOrganizationRepository {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async getById(orgId: string): Promise<OrganizationResponse> {
    return await prisma.organization
      .findUniqueOrThrow({
        where: {
          org_id: orgId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Organization not found for orgId: ${orgId}`);
      });
  }

  @Handle
  async create(data: CreateOrganizationPayload<number>): Promise<OrganizationResponse> {
    return await prisma.organization.create({
      data: {
        org_name: data.org_name,
        org_email: data.org_email,
        org_mobile_number: data.org_mobile_number,
        number_of_students: data.number_of_students,
        monthly_allowed_practice_speaking_tests: data.monthly_allowed_practice_speaking_tests,
        monthly_allowed_practice_reading_tests: data.monthly_allowed_practice_reading_tests,
        monthly_allowed_practice_writing_tests: data.monthly_allowed_practice_writing_tests,
        monthly_allowed_practice_listening_tests: data.monthly_allowed_practice_listening_tests,
        monthly_subscription: data.monthly_subscription,
        admin: {
          connect: {
            id: data.adminId,
          },
        },
      },
    });
  }

  @Handle
  async delete(orgId: string): Promise<OrganizationResponse> {
    return await prisma.organization.delete({
      where: {
        org_id: orgId,
      },
    });
  }

  @Handle
  async getAllOrgs(page: number, limit: number): Promise<Array<OrganizationResponse>> {
    const skip = (page - 1) * limit;
    return await prisma.organization.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }
}

export default OrganizationRepository;
