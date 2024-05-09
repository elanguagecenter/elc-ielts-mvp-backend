import express from "express";
import { CognitoAuthMiddleware } from "../middlewares/AuthMiddleware";
import EndPointAccessVerifyMiddleware from "../middlewares/EndPointAccessVerifyMiddleware";
import OrganizationController from "../controllers/OrganizationController";

const organizationRoute = express.Router({ mergeParams: true });
const organizationController = new OrganizationController();

// routes begining /ielts/organization
organizationRoute.get("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.SuperAdminAccess, organizationController.getOrganizations.bind(organizationController));
organizationRoute.post("/", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.SuperAdminAccess, organizationController.createOrganization.bind(organizationController));
organizationRoute.delete("/:orgId", CognitoAuthMiddleware, EndPointAccessVerifyMiddleware.SuperAdminAccess, organizationController.deleteOrganization.bind(organizationController));

export default organizationRoute;
