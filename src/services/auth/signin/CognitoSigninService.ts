import {
  AuthFlowType,
  RespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommandInput,
  GlobalSignOutCommand,
  GlobalSignOutCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoChallangePayload, UserSigninPayload, UserSigninResponse } from "../../../utils/types/common/types";
import ISigninService from "./ISigninService";
import cognitoClient from "../../../config/CognitoConfig";
import configs from "../../../config/configs";
import crypto from "crypto";
import ELCIELTSUnauthorizedError from "../../../exception/ELCIELTSUnauthorizedError";
import { CognitoChallanges, SigninResponseStatus } from "../../../utils/types/common/common";
import CommonValidator from "../../../utils/validators/CommonValidator";
import ELCIELTSInternalError from "../../../exception/ELCIELTSInternalError";

class CognitoSigninService implements ISigninService {
  private static instance: ISigninService = new CognitoSigninService();
  private cognitoClient: CognitoIdentityProviderClient;
  private cognitoChallangeExecutionMap: Map<string, (...params: Array<any>) => Promise<UserSigninResponse>>;

  private constructor() {
    this.cognitoClient = cognitoClient;
    this.cognitoChallangeExecutionMap = new Map([[CognitoChallanges.NEW_PASSWORD_REQUIRED, this.completeNewPasswordRequiredChallange.bind(this)]]);
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
          return {
            status: SigninResponseStatus.AUTHENTICATED,
            tokenData: res.AuthenticationResult,
          };
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
        return {
          status: SigninResponseStatus.AUTHENTICATED,
          tokenData: res.AuthenticationResult,
        };
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
