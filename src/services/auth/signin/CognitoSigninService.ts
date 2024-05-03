import {
  AuthFlowType,
  RespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommandInput,
  GlobalSignOutCommand,
  GlobalSignOutCommandOutput,
  AdminListGroupsForUserCommand,
  AdminListGroupsForUserCommandOutput,
  AuthenticationResultType,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoChallangePayload, UserSigninPayload, UserSigninResponse } from "../../../utils/types/common/types";
import ISigninService from "./ISigninService";
import cognitoClient from "../../../config/CognitoConfig";
import configs from "../../../config/configs";
import crypto from "crypto";
import ELCIELTSUnauthorizedError from "../../../exception/ELCIELTSUnauthorizedError";
import { CognitoChallanges, CognitoUserGroups, SigninResponseStatus, UserTypes } from "../../../utils/types/common/common";
import CommonValidator from "../../../utils/validators/CommonValidator";
import ELCIELTSInternalError from "../../../exception/ELCIELTSInternalError";

class CognitoSigninService implements ISigninService {
  private static instance: ISigninService = new CognitoSigninService();
  private cognitoClient: CognitoIdentityProviderClient;
  private cognitoChallangeExecutionMap: Map<string, (...params: Array<any>) => Promise<UserSigninResponse>>;
  private cognitoGroupUserTypeMap: Map<string, string>;

  private constructor() {
    this.cognitoClient = cognitoClient;
    this.cognitoChallangeExecutionMap = new Map([[CognitoChallanges.NEW_PASSWORD_REQUIRED, this.completeNewPasswordRequiredChallange.bind(this)]]);
    this.cognitoGroupUserTypeMap = new Map([
      [CognitoUserGroups.STUDENT_GROUP, UserTypes.STUDENT],
      [CognitoUserGroups.TEACHER_GROUP, UserTypes.TEACHER],
    ]);
  }

  static GetInstance(): ISigninService {
    return this.instance;
  }

  async studentSignIn(payLoad: UserSigninPayload): Promise<UserSigninResponse> {
    CommonValidator.validateNotEmptyOrBlankString(payLoad.userName, "Student User Name");
    CommonValidator.validateNotEmptyOrBlankString(payLoad.password, "password");
    const params: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: configs.cognito_client_id,
      AuthParameters: {
        USERNAME: payLoad.userName,
        PASSWORD: payLoad.password,
        SECRET_HASH: this.generateSecretHash(payLoad.userName, configs.cognito_client_id, configs.cognito_client_secret),
      },
    };
    const command = new InitiateAuthCommand(params);
    return await this.cognitoClient
      .send(command)
      .then((res) => {
        if (res.AuthenticationResult) {
          return this.getUserGroup(payLoad.userName, res.AuthenticationResult);
        } else if (res.ChallengeName === SigninResponseStatus.NEW_PASSWORD_REQUIRED) {
          return {
            status: SigninResponseStatus.NEW_PASSWORD_REQUIRED,
            sessionData: res.Session,
          };
        } else {
          throw new Error("Student couldn't be authenticated, please try again later");
        }
      })
      .catch((err) => {
        console.log(err);
        throw new ELCIELTSUnauthorizedError(err.message);
      });
  }

  async completeCognitoChallange(payLoad: CognitoChallangePayload): Promise<UserSigninResponse> {
    CommonValidator.validateNotEmptyOrBlankString(payLoad.userName, "Student User Name");
    CommonValidator.validateNotEmptyOrBlankString(payLoad.challangeName, "Challange Name");
    const challangeExecution = this.cognitoChallangeExecutionMap.get(payLoad.challangeName) || (() => Promise.reject(new ELCIELTSInternalError("Internal error")));
    return await challangeExecution(payLoad.userName, payLoad.newPassword, payLoad.cognitoSession);
  }

  async studentSignout(accessToken: string): Promise<GlobalSignOutCommandOutput> {
    CommonValidator.validateNotEmptyOrBlankString(accessToken, "accessToken");
    const command = new GlobalSignOutCommand({ AccessToken: accessToken });
    return await this.cognitoClient.send(command);
  }

  private async getUserGroup(userName: string, authResult: AuthenticationResultType | undefined): Promise<UserSigninResponse> {
    const command = new AdminListGroupsForUserCommand({
      Username: userName,
      UserPoolId: configs.cognito_pool_id,
    });
    const output: AdminListGroupsForUserCommandOutput = await this.cognitoClient.send(command);
    return {
      status: SigninResponseStatus.AUTHENTICATED,
      tokenData: authResult,
      userType: output.Groups?.map((group) => this.cognitoGroupUserTypeMap.get(group.GroupName || "") || "")[0],
    };
  }

  private async completeNewPasswordRequiredChallange(userName: string, newPassword: string, cognitoSession: string): Promise<UserSigninResponse> {
    CommonValidator.validateNotEmptyOrBlankString(newPassword, "New Password");
    CommonValidator.validateNotEmptyOrBlankString(cognitoSession, "Session");

    const challangeParams: RespondToAuthChallengeCommandInput = {
      ChallengeName: CognitoChallanges.NEW_PASSWORD_REQUIRED,
      ClientId: configs.cognito_client_id,
      Session: cognitoSession,
      ChallengeResponses: {
        USERNAME: userName,
        NEW_PASSWORD: newPassword,
        SECRET_HASH: this.generateSecretHash(userName, configs.cognito_client_id, configs.cognito_client_secret),
      },
    };
    const command = new RespondToAuthChallengeCommand(challangeParams);
    return await this.cognitoClient
      .send(command)
      .then((res) => {
        return this.getUserGroup(userName, res.AuthenticationResult);
      })
      .catch((err) => {
        console.log(err);
        throw new ELCIELTSUnauthorizedError("Student couldn't be authenticated, please try again later");
      });
  }

  private generateSecretHash(userName: string, clientId: string, clientSecret: string): string {
    return crypto
      .createHmac("sha256", clientSecret)
      .update(userName + clientId)
      .digest("base64");
  }
}

export default CognitoSigninService;
